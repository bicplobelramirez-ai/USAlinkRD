import type { ProductSnapshot, QuoteSelectionInput } from "@/lib/quote-agent"
import { extractProduct } from "@/lib/stores/registry"
import { createQuote, type QuoteBreakdown } from "./quote-engine"

export interface AcceptedQuote {
  productUrl: string
  selection: QuoteSelectionInput
  product: ProductSnapshot
  breakdown: QuoteBreakdown
}

export type ReverifiedField = "price" | "availability" | "size" | "color" | "discount" | "shipping" | "salesTax" | "usaLinkFee" | "total"

export interface QuoteChange {
  field: ReverifiedField
  before: string | number | null
  after: string | number | null
}

export interface ReverificationResult {
  status: "UNCHANGED" | "CHANGED" | "FAILED"
  changes: QuoteChange[]
  /** Si es true, la futura capa de pagos no puede cobrar hasta que el cliente acepte la nueva cotización. */
  requiresAcceptance: boolean
  product: ProductSnapshot | null
  breakdown: QuoteBreakdown | null
}

export function pricingInputFor(product: ProductSnapshot, selection: QuoteSelectionInput) {
  return {
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    quantity: selection.quantity,
    availability: product.availability,
    needsSelection: product.sizes.length > 0 && !selection.size,
  }
}

/** Compara dos cotizaciones campo por campo. Función pura para poder probarla sin red. */
export function compareQuotes(previous: AcceptedQuote, product: ProductSnapshot, breakdown: QuoteBreakdown): QuoteChange[] {
  const changes: QuoteChange[] = []
  const track = (field: ReverifiedField, before: string | number | null, after: string | number | null) => {
    if (before !== after) changes.push({ field, before, after })
  }
  track("price", previous.breakdown.unitPrice.amount, breakdown.unitPrice.amount)
  track("availability", previous.product.availability, product.availability)
  if (previous.selection.size) track("size", previous.selection.size, product.sizes.includes(previous.selection.size) ? previous.selection.size : null)
  if (previous.selection.color) track("color", previous.selection.color, product.color)
  track("discount", previous.breakdown.savings, breakdown.savings)
  track("shipping", previous.breakdown.usShipping.amount, breakdown.usShipping.amount)
  track("salesTax", previous.breakdown.salesTax.amount, breakdown.salesTax.amount)
  track("usaLinkFee", previous.breakdown.usaLinkFee.amount, breakdown.usaLinkFee.amount)
  track("total", previous.breakdown.estimatedTotal.amount, breakdown.estimatedTotal.amount)
  return changes
}

/**
 * Vuelve a consultar la tienda y recalcula la cotización antes del futuro pago.
 * No realiza checkout ni cobros: solo informa si algo cambió.
 */
export async function reverifyQuote(previous: AcceptedQuote): Promise<ReverificationResult> {
  try {
    const product = await extractProduct(previous.productUrl)
    const breakdown = createQuote(pricingInputFor(product, previous.selection))
    const changes = compareQuotes(previous, product, breakdown)
    return { status: changes.length > 0 ? "CHANGED" : "UNCHANGED", changes, requiresAcceptance: changes.length > 0, product, breakdown }
  } catch {
    return { status: "FAILED", changes: [], requiresAcceptance: true, product: null, breakdown: null }
  }
}
