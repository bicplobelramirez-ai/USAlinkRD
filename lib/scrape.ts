import 'server-only'

import { buildQuote, isValidProductUrl, type Quote } from '@/lib/quote'

export interface ScrapedProduct {
  name: string
  price: number | null
  image: string | null
}

export type QuoteResult =
  | { found: true; url: string; product: ScrapedProduct; quote: Quote }
  | { found: false; url: string; product: ScrapedProduct | null; reason: string }

const MAX_PRICE_USD = 5000
const MAX_HTML_BYTES = 2_000_000
const CACHE_TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { at: number; value: QuoteResult }>()

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
}

// Bloquea direcciones internas para que nadie use el lector para entrar a la red del servidor.
function isPublicHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (!host.includes('.') || host.includes(':')) return false
  if (/^\d+(\.\d+){3}$/.test(host)) return false
  if (host === 'localhost' || /\.(local|internal|localhost|lan)$/.test(host)) return false
  return true
}

async function fetchHtml(startUrl: string) {
  let current = startUrl
  for (let hop = 0; hop < 4; hop++) {
    const parsed = new URL(current)
    if (!['https:', 'http:'].includes(parsed.protocol) || !isPublicHost(parsed.hostname)) {
      throw new Error('blocked-host')
    }
    const res = await fetch(current, {
      headers: BROWSER_HEADERS,
      redirect: 'manual',
      signal: AbortSignal.timeout(7000),
      cache: 'no-store',
    })
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get('location')
      if (!next) throw new Error('bad-redirect')
      current = new URL(next, current).toString()
      continue
    }
    if (!res.ok) throw new Error(`http-${res.status}`)
    const text = await res.text()
    return text.slice(0, MAX_HTML_BYTES)
  }
  throw new Error('too-many-redirects')
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim()
}

function metaContent(html: string, key: string) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${escaped}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name|itemprop)=["']${escaped}["']`, 'i'),
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return decodeEntities(match[1])
  }
  return null
}

function toPrice(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const number = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(number) && number > 0 ? number : null
}

function firstImage(value: unknown): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return firstImage(value[0])
  if (typeof value === 'object' && 'url' in value) return firstImage((value as { url: unknown }).url)
  return null
}

function priceFromOffers(offers: unknown): number | null {
  if (!offers) return null
  if (Array.isArray(offers)) {
    const prices = offers.map(priceFromOffers).filter((p): p is number => p !== null)
    return prices.length ? Math.min(...prices) : null
  }
  if (typeof offers !== 'object') return null
  const offer = offers as Record<string, unknown>
  return (
    toPrice(offer.price) ??
    toPrice(offer.lowPrice) ??
    priceFromOffers(offer.priceSpecification) ??
    priceFromOffers(offer.offers)
  )
}

function findProductNode(node: unknown): Record<string, unknown> | null {
  if (!node || typeof node !== 'object') return null
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findProductNode(child)
      if (found) return found
    }
    return null
  }
  const record = node as Record<string, unknown>
  const type = record['@type']
  const types = Array.isArray(type) ? type : [type]
  if (types.some((t) => t === 'Product' || t === 'ProductGroup')) return record
  return findProductNode(record['@graph']) ?? findProductNode(record.mainEntity) ?? null
}

function parseProduct(html: string): ScrapedProduct | null {
  let name: string | null = null
  let price: number | null = null
  let image: string | null = null

  const scripts = html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  for (const [, raw] of scripts) {
    try {
      const product = findProductNode(JSON.parse(raw.trim()))
      if (!product) continue
      name ??= typeof product.name === 'string' ? decodeEntities(product.name) : null
      price ??= priceFromOffers(product.offers) ?? priceFromOffers(product.hasVariant)
      image ??= firstImage(product.image)
    } catch {
      // JSON-LD mal formado en la tienda; se intenta con las etiquetas meta.
    }
  }

  name ??= metaContent(html, 'og:title') ?? metaContent(html, 'twitter:title')
  price ??=
    toPrice(metaContent(html, 'product:price:amount')) ??
    toPrice(metaContent(html, 'og:price:amount')) ??
    toPrice(metaContent(html, 'price'))
  image ??= metaContent(html, 'og:image') ?? metaContent(html, 'twitter:image')

  if (!name) {
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    name = title ? decodeEntities(title[1]) : null
  }
  if (!name && price === null) return null

  return {
    name: (name ?? 'Producto').slice(0, 140),
    price,
    image: image && /^https?:\/\//.test(image) ? image : null,
  }
}

export async function quoteProductUrl(url: string): Promise<QuoteResult> {
  if (!isValidProductUrl(url)) {
    return { found: false, url, product: null, reason: 'El enlace no es válido.' }
  }

  const cached = cache.get(url)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value

  let result: QuoteResult
  try {
    const product = parseProduct(await fetchHtml(url))
    if (!product || product.price === null) {
      result = { found: false, url, product, reason: 'La tienda no muestra el precio de forma automática.' }
    } else if (product.price > MAX_PRICE_USD) {
      result = { found: false, url, product, reason: 'Este producto requiere una cotización personalizada.' }
    } else {
      result = { found: true, url, product, quote: buildQuote(product.name, product.price) }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown'
    result = {
      found: false,
      url,
      product: null,
      reason: message === 'blocked-host' ? 'El enlace no es válido.' : 'La tienda no nos dejó leer el producto.',
    }
  }

  cache.set(url, { at: Date.now(), value: result })
  return result
}
