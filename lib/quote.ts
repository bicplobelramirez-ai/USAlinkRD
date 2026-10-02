export const RD_RATE = 59

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

// Datos de prueba: se reemplaza por el resultado de /api/scrape cuando exista.
export function getQuote(): Quote {
  const base = { name: "Nike Air Force 1 '07", price: 115, tax: 0, shipUSA: 8, service: 15, shipRD: 18 }
  const total = base.price + base.tax + base.shipUSA + base.service + base.shipRD
  return { ...base, total, totalRD: Math.round(total * RD_RATE) }
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
