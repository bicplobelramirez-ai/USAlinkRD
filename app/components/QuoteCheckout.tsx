'use client'

import { useCallback } from 'react'
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { startQuoteCheckout } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function QuoteCheckout({ url, store }: { url: string; store: string }) {
  const fetchClientSecret = useCallback(() => startQuoteCheckout(url, store), [url, store])

  return (
    <div id="checkout" className="mt-6 overflow-hidden rounded-2xl border">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
