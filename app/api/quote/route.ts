import { NextResponse } from "next/server"
import { runQuotationAgent } from "@/lib/agents/quotation-agent"
import { sanitizeSelection } from "@/lib/agents/quote-tools"
import type { ProductSnapshot, QuoteResponse } from "@/lib/quote-agent"
import { extractFootLockerProduct, parseFootLockerUrl } from "@/lib/stores/footlocker"
import { ExtractionError, extractNikeProduct, isNikeUrl } from "@/lib/stores/nike"
import { extractUltaProduct, parseUltaUrl } from "@/lib/stores/ulta"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_URL_LENGTH = 2048

const EXTRACTORS: { matches: (url: string) => boolean; extract: (url: string) => Promise<ProductSnapshot> }[] = [
  { matches: isNikeUrl, extract: extractNikeProduct },
  { matches: (url) => parseFootLockerUrl(url) !== null, extract: extractFootLockerProduct },
  { matches: (url) => parseUltaUrl(url) !== null, extract: extractUltaProduct },
]

/** Ahorro calculado solo con los dos precios reales de la tienda, en centavos para evitar errores de redondeo. */
function withSavings(product: ProductSnapshot): ProductSnapshot {
  if (product.currentPrice === null || product.originalPrice === null) return { ...product, savings: null }
  const originalCents = Math.round(product.originalPrice * 100)
  const savedCents = originalCents - Math.round(product.currentPrice * 100)
  if (savedCents <= 0) return { ...product, originalPrice: null, savings: null }
  return { ...product, savings: { amount: savedCents / 100, percentage: Math.round((savedCents / originalCents) * 1000) / 10 } }
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const productUrl = body && typeof body === "object" && "productUrl" in body ? (body as { productUrl: unknown }).productUrl : null

  if (typeof productUrl !== "string" || productUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "invalid_url" }, { status: 400 })
  }
  const url = productUrl.trim()
  const extractor = EXTRACTORS.find((candidate) => candidate.matches(url))
  if (!extractor) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "store_not_supported" })
  }

  let product: ProductSnapshot
  try {
    product = withSavings(await extractor.extract(url))
  } catch (error) {
    const reason = error instanceof ExtractionError ? error.reason : "store_unavailable"
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason })
  }

  const raw = body as { size?: unknown; color?: unknown; quantity?: unknown }
  const selection = sanitizeSelection(product, {
    size: typeof raw.size === "string" ? raw.size : null,
    color: typeof raw.color === "string" ? raw.color : null,
    quantity: typeof raw.quantity === "number" ? raw.quantity : 1,
  })
  const agent = await runQuotationAgent(product, selection)
  return NextResponse.json<QuoteResponse>({ status: "product", product, agent }, { headers: { "Cache-Control": "no-store" } })
}
