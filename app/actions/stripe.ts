'use server'

import { randomUUID } from 'crypto'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { isValidProductUrl, parseQuantity, quoteCatalogModel, type Quote } from '@/lib/quote'
import { quoteProductUrl } from '@/lib/scrape'

export type PaymentRequest =
  | { kind: 'model'; store: string; model: string; quantity: number; size?: string; color?: string }
  | { kind: 'url'; url: string; store: string }

const clean = (value: string | undefined, max = 40) => (value ?? '').replace(/[^\p{L}\p{N} &'./-]/gu, '').slice(0, max).trim()

async function siteOrigin() {
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

async function resolveQuote(request: PaymentRequest) {
  if (request.kind === 'model') {
    const quantity = parseQuantity(request.quantity)
    if (!quantity) throw new Error('Cantidad no válida')
    const result = quoteCatalogModel(request.store, request.model, quantity)
    if (!result) throw new Error('Este modelo ya no está disponible')
    const details = [clean(request.size) && `Talla ${clean(request.size)}`, clean(request.color) && `Color ${clean(request.color)}`]
      .filter(Boolean)
      .join(' · ')
    return { quote: result.quote, storeName: result.store.name, details, productUrl: result.store.website, returnPath: `/tiendas/${result.store.slug}` }
  }

  if (!isValidProductUrl(request.url)) throw new Error('El enlace del producto no es válido')
  const result = await quoteProductUrl(request.url)
  if (!result.found) throw new Error('No pudimos confirmar el precio de este producto')
  return { quote: result.quote, storeName: clean(request.store, 60) || 'tienda', details: '', productUrl: request.url, returnPath: '/' }
}

export async function createPaymentLink(request: PaymentRequest): Promise<{ url: string; quote: Quote }> {
  const { quote, storeName, details, productUrl, returnPath } = await resolveQuote(request)
  const origin = await siteOrigin()

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: 'hosted_page',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: quote.quantity > 1 ? `${quote.name} x${quote.quantity}` : quote.name,
              description: [`Compra en ${storeName} + envío a República Dominicana (USALINK)`, details].filter(Boolean).join(' · '),
            },
            unit_amount: Math.round(quote.total * 100),
          },
          quantity: 1,
        },
      ],
      phone_number_collection: { enabled: true },
      success_url: `${origin}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${returnPath}`,
      metadata: {
        store: storeName,
        product_url: productUrl.slice(0, 500),
        quantity: String(quote.quantity),
        details: details.slice(0, 200),
      },
    },
    { idempotencyKey: randomUUID() },
  )

  if (!session.url) throw new Error('No se pudo generar el link de pago')
  return { url: session.url, quote }
}
