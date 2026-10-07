import { QUOTE_RULES, type QuoteRules } from "./config"

/**
 * Motor determinístico de cotización UsaLink.
 * Todos los montos se calculan en centavos enteros; el modelo de IA nunca participa.
 */

export type ChargeStatus = "VERIFIED" | "ESTIMATED" | "CALCULATED" | "PENDING"
export type RiskStatus = "OK" | "REVIEW_REQUIRED" | "PENDING"
export type QuoteStatus = "PENDING_PRICE" | "NEEDS_SELECTION" | "UNAVAILABLE" | "REVIEW_REQUIRED" | "ESTIMATED"

export interface QuoteCharge {
  amount: number | null
  status: ChargeStatus
}

export interface QuoteBreakdown {
  currency: "USD"
  quantity: number
  unitPrice: QuoteCharge
  productSubtotal: QuoteCharge
  originalSubtotal: number | null
  savings: number | null
  usShipping: QuoteCharge
  salesTax: QuoteCharge & { rate: number | null }
  usaLinkFee: QuoteCharge & { rate: number; minimum: number }
  estimatedTotal: QuoteCharge
  riskStatus: RiskStatus
  riskLimit: number
  quoteStatus: QuoteStatus
  /** Siempre false en V1: los pagos todavía no existen. */
  paymentEnabled: false
  rulesVersion: string
  calculatedAt: string
}

export interface PricingInput {
  currentPrice: number | null
  originalPrice: number | null
  quantity: number
  availability: "available" | "unavailable" | null
  needsSelection: boolean
  /** Valores reales confirmados por la tienda. Si existen, sustituyen a los estimados. */
  verifiedUSShipping?: number | null
  verifiedSalesTax?: number | null
  isNewCustomer?: boolean
}

export const toCents = (value: number) => Math.round(value * 100)
export const fromCents = (cents: number) => cents / 100

/** cents × rate redondeado a centavo con half-up, usando aritmética entera (puntos básicos). */
function applyRate(cents: number, rate: number) {
  const basisPoints = Math.round(rate * 10000)
  return Math.floor((cents * basisPoints + 5000) / 10000)
}

const isValidAmount = (value: number | null | undefined): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0

export function calculateUSShipping(verifiedShipping: number | null | undefined, rules: QuoteRules = QUOTE_RULES) {
  if (isValidAmount(verifiedShipping)) return { cents: toCents(verifiedShipping), status: "VERIFIED" as const }
  return { cents: toCents(rules.estimatedUSShipping), status: "ESTIMATED" as const }
}

export function calculateSalesTax(productSubtotalCents: number, verifiedTax: number | null | undefined, rules: QuoteRules = QUOTE_RULES) {
  if (isValidAmount(verifiedTax)) return { cents: toCents(verifiedTax), status: "VERIFIED" as const, rate: null }
  return { cents: applyRate(productSubtotalCents, rules.estimatedTaxRate), status: "ESTIMATED" as const, rate: rules.estimatedTaxRate }
}

/** usaLinkFee = max(productSubtotal × usaLinkFeeRate, minimumUsaLinkFee) */
export function calculateUsaLinkFee(productSubtotalCents: number, rules: QuoteRules = QUOTE_RULES) {
  return { cents: Math.max(applyRate(productSubtotalCents, rules.usaLinkFeeRate), toCents(rules.minimumUsaLinkFee)), status: "CALCULATED" as const }
}

export function createQuote(input: PricingInput, rules: QuoteRules = QUOTE_RULES, now: Date = new Date()): QuoteBreakdown {
  const quantity = Number.isInteger(input.quantity) && input.quantity >= 1 ? input.quantity : 1
  const pending: QuoteCharge = { amount: null, status: "PENDING" }
  const base = {
    currency: "USD" as const,
    quantity,
    riskLimit: rules.newCustomerOrderLimit,
    paymentEnabled: false as const,
    rulesVersion: rules.version,
    calculatedAt: now.toISOString(),
  }

  if (!isValidAmount(input.currentPrice) || input.currentPrice === 0) {
    return {
      ...base,
      unitPrice: pending,
      productSubtotal: pending,
      originalSubtotal: null,
      savings: null,
      usShipping: pending,
      salesTax: { ...pending, rate: null },
      usaLinkFee: { ...pending, rate: rules.usaLinkFeeRate, minimum: rules.minimumUsaLinkFee },
      estimatedTotal: pending,
      riskStatus: "PENDING",
      quoteStatus: "PENDING_PRICE",
    }
  }

  const unitCents = toCents(input.currentPrice)
  const subtotalCents = unitCents * quantity
  const originalUnitCents = isValidAmount(input.originalPrice) ? toCents(input.originalPrice) : null
  const hasRealDiscount = originalUnitCents !== null && unitCents < originalUnitCents

  const shipping = calculateUSShipping(input.verifiedUSShipping, rules)
  const tax = calculateSalesTax(subtotalCents, input.verifiedSalesTax, rules)
  const fee = calculateUsaLinkFee(subtotalCents, rules)
  const totalCents = subtotalCents + shipping.cents + tax.cents + fee.cents
  const totalIsVerified = shipping.status === "VERIFIED" && tax.status === "VERIFIED"

  const isNewCustomer = input.isNewCustomer ?? true
  const riskStatus: RiskStatus = isNewCustomer && subtotalCents > toCents(rules.newCustomerOrderLimit) ? "REVIEW_REQUIRED" : "OK"
  const quoteStatus: QuoteStatus =
    input.availability === "unavailable" ? "UNAVAILABLE"
      : input.needsSelection ? "NEEDS_SELECTION"
        : riskStatus === "REVIEW_REQUIRED" ? "REVIEW_REQUIRED"
          : "ESTIMATED"

  return {
    ...base,
    unitPrice: { amount: fromCents(unitCents), status: "VERIFIED" },
    productSubtotal: { amount: fromCents(subtotalCents), status: "VERIFIED" },
    originalSubtotal: hasRealDiscount ? fromCents(originalUnitCents * quantity) : null,
    savings: hasRealDiscount ? fromCents((originalUnitCents - unitCents) * quantity) : null,
    usShipping: { amount: fromCents(shipping.cents), status: shipping.status },
    salesTax: { amount: fromCents(tax.cents), status: tax.status, rate: tax.rate },
    usaLinkFee: { amount: fromCents(fee.cents), status: fee.status, rate: rules.usaLinkFeeRate, minimum: rules.minimumUsaLinkFee },
    estimatedTotal: { amount: fromCents(totalCents), status: totalIsVerified ? "CALCULATED" : "ESTIMATED" },
    riskStatus,
    quoteStatus,
  }
}

/** Montos de la cotización que el agente puede citar textualmente. */
export function breakdownAmounts(breakdown: QuoteBreakdown): number[] {
  return [
    breakdown.unitPrice.amount,
    breakdown.productSubtotal.amount,
    breakdown.originalSubtotal,
    breakdown.savings,
    breakdown.usShipping.amount,
    breakdown.salesTax.amount,
    breakdown.usaLinkFee.amount,
    breakdown.estimatedTotal.amount,
    breakdown.riskLimit,
  ].filter((value): value is number => value !== null)
}
