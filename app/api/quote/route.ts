import { NextResponse } from "next/server"
import type { QuoteResponse } from "@/lib/quote-agent"
import { ExtractionError, extractNikeProduct, isNikeUrl } from "@/lib/stores/nike"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_URL_LENGTH = 2048

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const productUrl = body && typeof body === "object" && "productUrl" in body ? (body as { productUrl: unknown }).productUrl : null

  if (typeof productUrl !== "string" || productUrl.length > MAX_URL_LENGTH) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "invalid_url" }, { status: 400 })
  }
  if (!isNikeUrl(productUrl.trim())) {
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason: "store_not_supported" })
  }

  try {
    const product = await extractNikeProduct(productUrl.trim())
    return NextResponse.json<QuoteResponse>({ status: "product", product }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    const reason = error instanceof ExtractionError ? error.reason : "store_unavailable"
    return NextResponse.json<QuoteResponse>({ status: "unverified", reason })
  }
}
