import type { ProductSnapshot } from "@/lib/quote-agent"
import { extractFootLockerProduct, parseFootLockerUrl } from "./footlocker"
import { extractNikeProduct, isNikeUrl } from "./nike"
import { extractUltaProduct, parseUltaUrl } from "./ulta"

const EXTRACTORS: { matches: (url: string) => boolean; extract: (url: string) => Promise<ProductSnapshot> }[] = [
  { matches: isNikeUrl, extract: extractNikeProduct },
  { matches: (url) => parseFootLockerUrl(url) !== null, extract: extractFootLockerProduct },
  { matches: (url) => parseUltaUrl(url) !== null, extract: extractUltaProduct },
]

export function isSupportedStoreUrl(url: string) {
  return EXTRACTORS.some((candidate) => candidate.matches(url))
}

/** Ahorro calculado solo con los dos precios reales de la tienda, en centavos para evitar errores de redondeo. */
function withSavings(product: ProductSnapshot): ProductSnapshot {
  if (product.currentPrice === null || product.originalPrice === null) return { ...product, savings: null }
  const originalCents = Math.round(product.originalPrice * 100)
  const savedCents = originalCents - Math.round(product.currentPrice * 100)
  if (savedCents <= 0) return { ...product, originalPrice: null, savings: null }
  return { ...product, savings: { amount: savedCents / 100, percentage: Math.round((savedCents / originalCents) * 1000) / 10 } }
}

/** Ejecuta el extractor de la tienda correspondiente. Lanza error si la tienda no es compatible o falla. */
export async function extractProduct(url: string): Promise<ProductSnapshot> {
  const extractor = EXTRACTORS.find((candidate) => candidate.matches(url))
  if (!extractor) throw new Error("store_not_supported")
  return withSavings(await extractor.extract(url))
}
