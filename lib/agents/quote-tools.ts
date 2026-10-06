import type { AgentMissingField, ProductSnapshot, QuoteSelectionInput } from "@/lib/quote-agent"
import { MAX_QUANTITY } from "@/lib/quote"

/** Contrato de datos que recibe el agente. Todos los valores factuales vienen del extractor de la tienda. */
export interface QuotationAgentInput {
  storeName: string
  productName: string | null
  productUrl: string
  productImage: string | null
  productCode: string | null
  originalPrice: number | null
  currentPrice: number | null
  currency: "USD" | null
  availability: "available" | "unavailable" | null
  availableSizes: string[]
  sizeAvailabilityVerified: boolean
  selectedSize: string | null
  colors: string[]
  selectedColor: string | null
  quantity: number
  verifiedDiscounts: { label: string; amount: number; percentage: number }[]
  verificationTimestamp: string
}

/** Normaliza la selección del cliente contra los datos reales: nunca acepta una talla o color que la tienda no ofrece. */
export function sanitizeSelection(product: ProductSnapshot, raw: Partial<QuoteSelectionInput>): QuoteSelectionInput {
  const size = typeof raw.size === "string" && product.sizes.includes(raw.size) ? raw.size : null
  const color = product.color && raw.color === product.color ? raw.color : product.color
  const quantity = Number.isInteger(raw.quantity) && raw.quantity! >= 1 && raw.quantity! <= MAX_QUANTITY ? raw.quantity! : 1
  return { size, color, quantity }
}

export function buildAgentInput(product: ProductSnapshot, selection: QuoteSelectionInput): QuotationAgentInput {
  return {
    storeName: product.storeName,
    productName: product.productName,
    productUrl: product.productUrl,
    productImage: product.productImage,
    productCode: product.styleColor,
    originalPrice: product.originalPrice,
    currentPrice: product.currentPrice,
    currency: product.currency,
    availability: product.availability,
    availableSizes: product.sizes,
    sizeAvailabilityVerified: product.sizeAvailabilityVerified,
    selectedSize: selection.size,
    colors: product.color ? [product.color] : [],
    selectedColor: selection.color,
    quantity: selection.quantity,
    verifiedDiscounts: product.savings ? [{ label: `Rebaja de ${product.storeName}`, amount: product.savings.amount, percentage: product.savings.percentage }] : [],
    verificationTimestamp: product.verifiedAt,
  }
}

/** Determina qué falta para cotizar. Lo decide el backend, no el modelo. */
export function checkMissingSelections(input: QuotationAgentInput): AgentMissingField[] {
  const missing: AgentMissingField[] = []
  if (input.availableSizes.length > 0 && !input.selectedSize) missing.push("size")
  if (input.colors.length > 1 && !input.selectedColor) missing.push("color")
  return missing
}

/** Datos que todavía no se pueden verificar o calcular. */
export function listPendingItems(input: QuotationAgentInput): string[] {
  return [
    input.productName === null && "Nombre del producto",
    input.productImage === null && "Imagen del producto",
    input.currentPrice === null && "Precio",
    input.availability === null && "Disponibilidad",
    input.availableSizes.length > 0 && !input.sizeAvailabilityVerified && "Disponibilidad por talla",
    "Códigos promocionales",
    "Envío dentro de USA",
    "Sales tax",
    "Fee UsaLink",
    "Total a pagar",
  ].filter((item): item is string => Boolean(item))
}

/** Montos que el agente tiene permitido mencionar: exactamente los que vienen de la tienda. */
export function allowedAmounts(input: QuotationAgentInput) {
  const cents = new Set<number>()
  for (const value of [input.currentPrice, input.originalPrice, ...input.verifiedDiscounts.map((discount) => discount.amount)]) {
    if (value !== null) cents.add(Math.round(value * 100))
  }
  const percentages = new Set(input.verifiedDiscounts.map((discount) => Math.round(discount.percentage * 10)))
  return { cents, percentages }
}

export type FutureToolResult = { status: "not_enabled"; tool: string }

const notEnabled = (tool: string): FutureToolResult => ({ status: "not_enabled", tool })

/**
 * Herramientas reservadas para las siguientes fases. No se exponen al modelo todavía:
 * cuando se habiliten, cada una será una función determinística del backend.
 */
export const futureTools = {
  calculateUsaLinkFee: async (): Promise<FutureToolResult> => notEnabled("calculateUsaLinkFee"),
  calculateSalesTax: async (): Promise<FutureToolResult> => notEnabled("calculateSalesTax"),
  calculateUSShipping: async (): Promise<FutureToolResult> => notEnabled("calculateUSShipping"),
  createQuote: async (): Promise<FutureToolResult> => notEnabled("createQuote"),
  saveQuote: async (): Promise<FutureToolResult> => notEnabled("saveQuote"),
  createPayment: async (): Promise<FutureToolResult> => notEnabled("createPayment"),
}
