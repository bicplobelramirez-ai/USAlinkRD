import { stores } from '@/app/components/store/storeData'

export const RD_RATE = 65

export const FEES = { tax: 0, shipUSA: 8, service: 15, shipRD: 18 }

export const MAX_QUANTITY = 5

export interface Quote {
  name: string
  unitPrice: number
  quantity: number
  price: number
  tax: number
  shipUSA: number
  service: number
  shipRD: number
  total: number
  totalRD: number
}

const round2 = (value: number) => Math.round(value * 100) / 100

export function buildQuote(name: string, unitPrice: number, quantity = 1): Quote {
  const price = round2(unitPrice * quantity)
  const total = round2(price + FEES.tax + FEES.shipUSA + FEES.service + FEES.shipRD)
  return { name, unitPrice: round2(unitPrice), quantity, price, ...FEES, total, totalRD: Math.round(total * RD_RATE) }
}

export function parseQuantity(value: unknown) {
  const quantity = Number(value)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return null
  return quantity
}

export function findCatalogModel(storeSlug: string, modelId: string) {
  const store = stores[storeSlug]
  const model = store?.models.find((item) => item.id === modelId)
  return store && model ? { store, model } : null
}

export function quoteCatalogModel(storeSlug: string, modelId: string, quantity: number) {
  const match = findCatalogModel(storeSlug, modelId)
  if (!match) return null
  return { ...match, quote: buildQuote(match.model.name, match.model.usd, quantity) }
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

export function cotizarModelHref(options: { store: string; model: string; quantity: number; size?: string; color?: string }) {
  const params = new URLSearchParams({ tienda: options.store, modelo: options.model, cantidad: String(options.quantity) })
  if (options.size) params.set('talla', options.size)
  if (options.color) params.set('color', options.color)
  return `/cotizar?${params.toString()}`
}
