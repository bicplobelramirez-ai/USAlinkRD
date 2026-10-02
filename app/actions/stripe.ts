'use server'

import { randomUUID } from 'crypto'

import { stripe } from '@/lib/stripe'
import { isValidProductUrl } from '@/lib/quote'
import { quoteProductUrl } from '@/lib/scrape'

export async function startQuoteCheckout(productUrl: string, store: string) {
  if (!isValidProductUrl(productUrl)) {
    throw new Error('El enlace del producto no es válido')
  }

  const safeStore = store.replace(/[^\p{L}\p{N} &'.-]/gu, '').slice(0, 60) || 'tienda'
  const result = await quoteProductUrl(productUrl)
  if (!result.found) {
    throw new Error('No pudimos confirmar el precio de este producto')
  }
  const { quote } = result

  const session = await stripe.checkout.sessions.create(
    {
      ui_mode: 'embedded_page',
      redirect_on_completion: 'never',
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: quote.name,
              description: `Compra en ${safeStore} + envío a República Dominicana (USALINK)`,
            },
            unit_amount: Math.round(quote.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_url: productUrl.slice(0, 500),
        store: safeStore,
      },
    },
    { idempotencyKey: randomUUID() },
  )

  return session.client_secret as string
}
