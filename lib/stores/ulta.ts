import type { ProductSnapshot } from "@/lib/quote-agent"
import { ExtractionError } from "./nike"
import { asArray, asObject, asPrice, asString, fetchStorePage, readEnclosingObject, readJsonLd, readSchemaAvailability, safeUrl, samePrice } from "./shared"

const HOSTS = ["www.ulta.com", "ulta.com"]
const IMAGE_HOSTS = ["media.ulta.com"]

export function parseUltaUrl(raw: string) {
  try {
    const url = new URL(raw)
    if (url.protocol !== "https:" || !HOSTS.includes(url.hostname)) return null
    if (!/^\/p\/[a-z0-9-]+-pimprod\d+\/?$/i.test(url.pathname)) return null
    const sku = url.searchParams.get("sku")
    const requestedSku = sku && /^\d{5,10}$/.test(sku) ? sku : null
    url.hostname = "www.ulta.com"
    url.search = requestedSku ? `?sku=${requestedSku}` : ""
    url.hash = ""
    return { url, requestedSku }
  } catch {
    return null
  }
}

export async function extractUltaProduct(rawUrl: string): Promise<ProductSnapshot> {
  const parsed = parseUltaUrl(rawUrl)
  if (!parsed) throw new ExtractionError("invalid_url")
  const html = await fetchStorePage(parsed.url, HOSTS)

  const ld = readJsonLd(html).find((node) => asString(node["@type"]) === "Product")
  const sku = asString(ld?.sku)
  if (!ld || !sku) throw new ExtractionError("product_not_found")
  if (parsed.requestedSku && parsed.requestedSku !== sku) throw new ExtractionError("product_not_found")

  // Fuente 1: ficha estructurada del producto. Fuente 2: módulo de precio que la página muestra.
  const offer = asObject(ld.offers) ?? asObject(asArray(ld.offers)[0])
  const ldPrice = asPrice(offer?.price)
  const pricing = readEnclosingObject(html, '"type":"ProductPricing"', '{"id":')
  const pricingMatches = asString(pricing?.skuId) === sku
  const listPrice = pricingMatches ? asPrice(pricing?.listPrice) : null
  const salePrice = pricingMatches ? asPrice(pricing?.salePrice) : null
  const shownPrice = salePrice ?? listPrice

  const currentPrice = asString(offer?.priceCurrency) === "USD" && samePrice(ldPrice, shownPrice) ? shownPrice : null
  const originalPrice = currentPrice !== null && salePrice !== null && listPrice !== null && listPrice > salePrice ? listPrice : null

  const ldAvailability = readSchemaAvailability(offer?.availability)
  const moduleAvailability = pricingMatches && typeof pricing?.unavailable === "boolean" ? (pricing.unavailable ? "unavailable" : "available") : null
  const availability = ldAvailability !== null && (moduleAvailability === null || moduleAvailability === ldAvailability) ? ldAvailability : null

  const brand = asString(ld.brand) ?? asString(asObject(ld.brand)?.name)
  const name = asString(ld.name)
  const productName = name ? [brand, name].filter(Boolean).join(" ") : null
  const image = asArray(ld.image).find(Boolean) ?? ld.image

  return {
    storeName: "Ulta Beauty",
    source: "ulta-pdp",
    productUrl: safeUrl(offer?.url, HOSTS) ?? parsed.url.toString(),
    productName,
    productImage: safeUrl(image, IMAGE_HOSTS),
    styleColor: `Item ${sku}`,
    color: null,
    currency: currentPrice === null ? null : "USD",
    currentPrice,
    originalPrice,
    availability,
    sizes: [],
    sizeAvailabilityVerified: true,
    verifiedAt: new Date().toISOString(),
  }
}
