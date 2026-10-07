import { NextResponse } from "next/server"
import { runQuotationAgent } from "@/lib/agents/quotation-agent"
import { sanitizeSelection } from "@/lib/agents/quote-tools"
import { pricingInputFor } from "@/lib/pricing/reverify"
import { createQuote } from "@/lib/pricing/quote-engine"
import type { ProductSnapshot, QuoteResponse } from "@/lib/quote-agent"
import { ExtractionError } from "@/lib/stores/nike"
import { extractProduct, isSupportedStoreUrl } from "@/lib/stores/registry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_URL_LENGTH = 2048

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const productUrl = body && typeof body === "object" && "productUrl" in body ? (body as { productUrl: unknown }).productUrl : null

  if (typeof productUrl !== "string" || productUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "invalid_url" }, { status: 400 })
  }
  const url = productUrl.trim()
  if (!isSupportedStoreUrl(url)) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "store_not_supported" })
  }

  let product: ProductSnapshot
  try {
    product = await extractProduct(url)
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
  const pricing = createQuote(pricingInputFor(product, selection))
  const agent = await runQuotationAgent(product, selection, pricing)
  return NextResponse.json<QuoteResponse>({ status: "product", product, agent, pricing }, { headers: { "Cache-Control": "no-store" } })
}
