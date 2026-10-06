import type { ProductSnapshot } from "@/lib/quote-agent"
import { ExtractionError } from "./nike"
import { asArray, asObject, asPrice, asString, fetchStorePage, readJsonLd, safeUrl, samePrice, type Json } from "./shared"

const HOSTS = ["www.footlocker.com", "footlocker.com"]
const IMAGE_HOSTS = ["images.footlocker.com", "assets.footlocker.com"]
const SKU = /^[A-Z0-9]{4,14}$/
const HYDRATION_MARKER = "__staticRouterHydrationData = JSON.parse("

export function parseFootLockerUrl(raw: string) {
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:" || !HOSTS.includes(url.hostname)) return null
    const match = url.pathname.match(/^\/product\/[^/]+\/([A-Za-z0-9]+)\.html$/)
    if (!match || !SKU.test(match[1].toUpperCase())) return null
    url.hostname = "www.footlocker.com"
    url.search = ""
    url.hash = ""
    return { url, sku: match[1].toUpperCase() }
  } catch {
    return null
  }
}

function readHydratedProduct(html: string): Json | null {
  const start = html.indexOf(HYDRATION_MARKER)
  if (start < 0) return null
  const quote = start + HYDRATION_MARKER.length
  if (html[quote] !== '"') return null
  let end = quote + 1
  while (end < html.length && html[end] !== '"') end += html[end] === "\\" ? 2 : 1
  try {
    const data = asObject(JSON.parse(JSON.parse(html.slice(quote, end + 1)) as string))
    for (const entry of Object.values(asObject(data?.loaderData) ?? {})) {
      const product = asObject(asObject(entry)?.product)
      if (product && asObject(product.style) && Array.isArray(product.sizes)) return product
    }
  } catch {
    return null
  }
  return null
}

/** Precio visible en la página (segunda fuente): lo que el cliente ve impreso. */
function readVisiblePrice(html: string) {
  const at = html.indexOf('data-testid="ProductPrice"')
  if (at < 0) return null
  const block = html.slice(at, at + 900)
  const sale = block.match(/Price dropped from \$([\d,]+\.\d{2}) to \$([\d,]+\.\d{2})/)
  if (sale) return { onSale: true, list: asPrice(sale[1]), current: asPrice(sale[2]) }
  const amount = block.match(/>\$([\d,]+\.\d{2})</)
  return amount ? { onSale: false, list: null, current: asPrice(amount[1]) } : null
}

function readLdVariant(html: string, sku: string) {
  for (const node of readJsonLd(html)) {
    const variant = asArray(node.hasVariant).map(asObject).find((item) => asString(item?.sku)?.toUpperCase() === sku)
    if (variant) return { group: node, variant }
    if (asString(node.sku)?.toUpperCase() === sku) return { group: node, variant: null }
  }
  return null
}

const normalizeSize = (value: string) => (/^\d+(\.\d+)?$/.test(value) ? String(Number(value)) : value)

export async function extractFootLockerProduct(rawUrl: string): Promise<ProductSnapshot> {
  const parsed = parseFootLockerUrl(rawUrl)
  if (!parsed) throw new ExtractionError("invalid_url")
  const html = await fetchStorePage(parsed.url, HOSTS)

  const product = readHydratedProduct(html)
  const style = asObject(product?.style)
  const sku = asString(style?.sku)?.toUpperCase()
  if (!product || !style || sku !== parsed.sku) throw new ExtractionError("product_not_found")

  const ld = readLdVariant(html, sku)
  const ldOffer = asObject(ld?.variant?.offers)
  const ldStrike = asObject(ldOffer?.priceSpecification)

  // Fuente 1: datos del producto incluidos en la página. Fuente 2: precio impreso en pantalla.
  const dataPrice = asObject(style.price)
  const dataCurrent = asPrice(dataPrice?.salePrice) ?? asPrice(dataPrice?.listPrice)
  const dataList = asPrice(dataPrice?.listPrice)
  const visible = readVisiblePrice(html)
  const dataOnSale = dataList !== null && dataCurrent !== null && dataList > dataCurrent

  const sourcesAgree =
    visible !== null &&
    samePrice(dataCurrent, visible.current) &&
    visible.onSale === dataOnSale &&
    (!dataOnSale || samePrice(dataList, visible.list)) &&
    (ldOffer === null || samePrice(asPrice(ldOffer.price), dataCurrent))
  const ldCurrency = asString(ldOffer?.priceCurrency)
  const currencyOk = ldCurrency === null || ldCurrency === "USD"
  const currentPrice = sourcesAgree && currencyOk ? dataCurrent : null
  const ldStrikePrice = asPrice(ldStrike?.price)
  const originalPrice = currentPrice !== null && dataOnSale && (ldStrikePrice === null || samePrice(ldStrikePrice, dataList)) ? dataList : null

  const inventory = asObject(product.inventory)
  const availability = typeof inventory?.inventoryAvailable === "boolean" ? (inventory.inventoryAvailable ? "available" : "unavailable") : null

  const sizeRows = asArray(product.sizes).map(asObject).filter((size): size is Json => Boolean(size))
  const sizeAvailabilityVerified = sizeRows.length > 0 && sizeRows.every((size) => typeof asObject(size.inventory)?.inventoryAvailable === "boolean")
  const sizes = sizeAvailabilityVerified
    ? sizeRows.filter((size) => size.active !== false && asObject(size.inventory)?.inventoryAvailable === true).map((size) => asString(size.strippedSize) ?? asString(size.size)).filter((size): size is string => Boolean(size)).map(normalizeSize)
    : []

  const productName = asString(asObject(product.model)?.name) ?? asString(ld?.group.name)
  if (!productName && currentPrice === null) throw new ExtractionError("product_not_found")
  const groupImage = asString(ld?.group.sku)?.toUpperCase() === sku ? ld?.group.image : null

  return {
    storeName: "Foot Locker",
    source: "footlocker-pdp",
    productUrl: parsed.url.toString(),
    productName,
    productImage: safeUrl(ld?.variant?.image, IMAGE_HOSTS) ?? safeUrl(groupImage, IMAGE_HOSTS),
    styleColor: sku,
    color: asString(style.color) ?? asString(ld?.variant?.color),
    currency: currentPrice === null ? null : "USD",
    currentPrice,
    originalPrice,
    availability,
    sizes: [...new Set(sizes)],
    sizeAvailabilityVerified,
    verifiedAt: new Date().toISOString(),
  }
}
