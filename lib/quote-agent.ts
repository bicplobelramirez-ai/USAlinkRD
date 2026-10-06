export const WHATSAPP_NUMBER = "18565622190"

export interface QuoteDiscount {
  label: string
  amount: number
  percent?: number
  code?: string
  verified: boolean
}

export interface VerifiedQuote {
  storeName: string
  productName: string
  productUrl: string
  productImage: string | null
  originalPrice: number
  currentPrice: number
  availability: "available" | "limited" | "unavailable"
  sizes: string[]
  selectedSize: string | null
  colors: string[]
  selectedColor: string | null
  quantity: number
  storeDiscounts: QuoteDiscount[]
  promoCodes: QuoteDiscount[]
  verifiedDiscounts: QuoteDiscount[]
  usaShipping: number
  salesTax: number
  usaLinkFee: number
  savingsAmount: number
  savingsPercentage: number
  finalTotal: number
}

export interface QuoteRequest {
  productUrl: string
  storeHint?: string
  productHint?: string
  size?: string
  color?: string
  quantity?: number
}

/** Datos factuales extraídos del producto real. `null` significa pendiente de verificación. */
export interface ProductSnapshot {
  storeName: string
  source: "nike-pdp" | "footlocker-pdp" | "ulta-pdp"
  productUrl: string
  productName: string | null
  productImage: string | null
  styleColor: string | null
  color: string | null
  currency: "USD" | null
  currentPrice: number | null
  originalPrice: number | null
  availability: "available" | "unavailable" | null
  sizes: string[]
  sizeAvailabilityVerified: boolean
  verifiedAt: string
  /** Calculado en el servidor solo a partir de originalPrice y currentPrice reales. */
  savings?: { amount: number; percentage: number } | null
}

export const SUPPORTED_STORES = ["Nike", "Foot Locker", "Ulta Beauty"]

export type UnverifiedReason = "invalid_url" | "store_not_supported" | "store_unavailable" | "product_not_found" | "network_error"

export interface QuoteSelectionInput {
  size: string | null
  color: string | null
  quantity: number
}

export type AgentMissingField = "size" | "color"
export type AgentNextStep = "ask_size" | "ask_color" | "ready_for_pricing" | "unavailable" | "needs_review"

/** Respuesta del Agente de Cotización. Solo contiene texto y pasos: nunca precios propios. */
export interface QuoteAgentResult {
  source: "openai" | "rules"
  model: string
  nextStep: AgentNextStep
  question: string | null
  summary: string
  discountExplanation: string | null
  missing: AgentMissingField[]
  pending: string[]
  rejectedModelOutput: boolean
}

export type QuoteResponse =
  | { status: "verified"; quote: VerifiedQuote }
  | { status: "product"; product: ProductSnapshot; agent?: QuoteAgentResult }
  | { status: "unverified"; reason?: UnverifiedReason }

export const ANALYSIS_STEPS = [
  "Analizando producto…",
  "Verificando precio…",
  "Buscando promociones y descuentos…",
  "Verificando disponibilidad…",
  "Calculando tu cotización…",
]

export const PRODUCT_STEPS = ["Analizando producto…", "Verificando precio…", "Verificando disponibilidad…"]

/** Punto único de entrada al sistema de cotización. Los datos vienen siempre del servidor. */
export async function requestQuote(request: QuoteRequest): Promise<QuoteResponse> {
  try {
    const response = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productUrl: request.productUrl, size: request.size, color: request.color, quantity: request.quantity }),
    })
    return (await response.json()) as QuoteResponse
  } catch {
    return { status: "unverified", reason: "network_error" }
  }
}

export function whatsappQuoteUrl(request: Partial<QuoteRequest> & { intent?: "help" | "review" }) {
  const lines = [
    request.intent === "review" ? "Hola UsaLink, solicito revisión de esta cotización:" : "Hola UsaLink, quiero ayuda para cotizar:",
    request.productUrl ? `Link: ${request.productUrl}` : null,
    request.storeHint ? `Tienda: ${request.storeHint}` : null,
    request.productHint ? `Producto: ${request.productHint}` : null,
    request.size ? `Talla: ${request.size}` : null,
    request.color ? `Color: ${request.color}` : null,
    request.quantity ? `Cantidad: ${request.quantity}` : null,
  ].filter(Boolean)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`
}
