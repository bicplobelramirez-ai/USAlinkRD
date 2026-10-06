import type { ProductSnapshot } from "@/lib/quote-agent"

const NIKE_HOSTS = new Set(["www.nike.com", "nike.com"])
const IMAGE_HOST = "static.nike.com"
const STYLE_COLOR = /^[A-Z0-9]{5,9}-\d{3}$/
const FETCH_TIMEOUT_MS = 12000

export class ExtractionError extends Error {
  constructor(public reason: "invalid_url" | "store_unavailable" | "product_not_found") {
    super(reason)
  }
}

type Json = Record<string, unknown>
const asObject = (value: unknown): Json | null => (value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : null)
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])
const asString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null)
const asPrice = (value: unknown) => {
  const parsed = typeof value === "string" ? Number(value) : value
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function isNikeUrl(raw: string) {
  return parseNikeUrl(raw) !== null
}

function parseNikeUrl(raw: string) {
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:" || !NIKE_HOSTS.has(url.hostname)) return null
    // Solo la tienda de USA: las otras regiones usan prefijos como /es/t/ y otra moneda.
    if (!/^\/t\/[^/]+/.test(url.pathname)) return null
    url.hostname = "www.nike.com"
    url.search = ""
    url.hash = ""
    return url
  } catch {
    return null
  }
}

function safeNikeUrl(value: unknown, allowedHost: string) {
  const raw = asString(value)
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" && url.hostname === allowedHost ? url.toString() : null
  } catch {
    return null
  }
}

function readNextData(html: string) {
  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!match) return null
  try {
    return asObject(asObject(asObject(JSON.parse(match[1]))?.props)?.pageProps)
  } catch {
    return null
  }
}

function readJsonLdVariant(html: string, styleColor: string) {
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const parsed: unknown = JSON.parse(match[1])
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        const group = asObject(node)
        const variant = asArray(group?.hasVariant).map(asObject).find((item) => asString(item?.mpn)?.toUpperCase() === styleColor)
        if (group && variant) return { groupName: asString(group.name), variant }
      }
    } catch {
      continue
    }
  }
  return null
}

function readAvailability(statusModifier: string | null): ProductSnapshot["availability"] {
  if (!statusModifier) return null
  if (statusModifier.startsWith("BUYABLE")) return "available"
  if (statusModifier.includes("SOLD_OUT") || statusModifier.includes("OUT_OF_STOCK")) return "unavailable"
  return null
}

export async function extractNikeProduct(rawUrl: string): Promise<ProductSnapshot> {
  const url = parseNikeUrl(rawUrl)
  if (!url) throw new ExtractionError("invalid_url")

  let html: string
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })
    if (response.status === 404) throw new ExtractionError("product_not_found")
    if (!response.ok || !NIKE_HOSTS.has(new URL(response.url).hostname)) throw new ExtractionError("store_unavailable")
    html = await response.text()
  } catch (error) {
    if (error instanceof ExtractionError) throw error
    throw new ExtractionError("store_unavailable")
  }

  const product = asObject(readNextData(html)?.selectedProduct)
  const styleColor = asString(product?.styleColor)?.toUpperCase() ?? null
  const requestedStyle = url.pathname.split("/").filter(Boolean)[2]?.toUpperCase()
  if (!product || !styleColor) throw new ExtractionError("product_not_found")
  // Si el link pide un color concreto y Nike muestra otro, no damos por buenos esos datos.
  if (requestedStyle && STYLE_COLOR.test(requestedStyle) && requestedStyle !== styleColor) throw new ExtractionError("product_not_found")

  const ld = readJsonLdVariant(html, styleColor)
  const offers = asObject(ld?.variant.offers)
  const prices = asObject(product.prices)

  const pagePrice = asPrice(prices?.currentPrice)
  const ldPrice = asPrice(offers?.price)
  const currency = asString(prices?.currency) ?? asString(offers?.priceCurrency)
  // Las dos fuentes de la página deben coincidir; si discrepan, el precio queda pendiente.
  const pricesAgree = pagePrice === null || ldPrice === null || pagePrice === ldPrice
  const currentPrice = currency === "USD" && pricesAgree ? pagePrice ?? ldPrice : null
  const initialPrice = asPrice(prices?.initialPrice)

  const contentImage = asArray(product.contentImages)
    .map((card) => asObject(asObject(asObject(card)?.properties)?.squarish)?.url)
    .find(Boolean)

  const productName = asString(asObject(product.productInfo)?.title) ?? ld?.groupName ?? null
  if (!productName && currentPrice === null) throw new ExtractionError("product_not_found")

  return {
    storeName: "Nike",
    source: "nike-pdp",
    productUrl: safeNikeUrl(asObject(product.pdpUrl)?.url, "www.nike.com") ?? url.toString(),
    productName,
    productImage: safeNikeUrl(contentImage, IMAGE_HOST) ?? safeNikeUrl(ld?.variant.image, IMAGE_HOST),
    styleColor,
    color: asString(product.colorDescription) ?? asString(ld?.variant.color),
    currency: currentPrice === null ? null : "USD",
    currentPrice,
    originalPrice: currentPrice !== null && initialPrice !== null && initialPrice > currentPrice ? initialPrice : null,
    availability: readAvailability(asString(product.statusModifier)),
    sizes: asArray(product.sizes).map((size) => asString(asObject(size)?.localizedLabel) ?? asString(asObject(size)?.label)).filter((size): size is string => Boolean(size)),
    sizeAvailabilityVerified: false,
    verifiedAt: new Date().toISOString(),
  }
}
