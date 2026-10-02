export const RD_RATE = 59

export const FEES = { tax: 0, shipUSA: 8, service: 15, shipRD: 18 }

export interface Quote {
  name: string
  price: number
  tax: number
  shipUSA: number
  service: number
  shipRD: number
  total: number
  totalRD: number
}

const round2 = (value: number) => Math.round(value * 100) / 100

export function buildQuote(name: string, price: number): Quote {
  const total = round2(price + FEES.tax + FEES.shipUSA + FEES.service + FEES.shipRD)
  return { name, price: round2(price), ...FEES, total, totalRD: Math.round(total * RD_RATE) }
}

export function isValidProductUrl(value: string) {
  if (!value || value.length > 2000) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function cotizarHref(url: string, store?: string) {
  const params = new URLSearchParams({ url })
  if (store) params.set('store', store)
  return `/cotizar?${params.toString()}`
}
