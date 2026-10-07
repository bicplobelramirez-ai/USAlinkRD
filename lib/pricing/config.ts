/** Reglas provisionales V1 de UsaLink. Único lugar donde viven estos valores. */
export interface QuoteRules {
  version: string
  estimatedUSShipping: number
  estimatedTaxRate: number
  usaLinkFeeRate: number
  minimumUsaLinkFee: number
  newCustomerOrderLimit: number
}

export const QUOTE_RULES: QuoteRules = {
  version: "v1-2026-10",
  estimatedUSShipping: 7.99,
  estimatedTaxRate: 0.07,
  usaLinkFeeRate: 0.07,
  minimumUsaLinkFee: 7.99,
  newCustomerOrderLimit: 500.0,
}
