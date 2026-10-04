import 'server-only'

import Stripe from 'stripe'

let client: Stripe | null = null

// Created on first use so `next build` doesn't crash when the deployment has no Stripe keys yet.
function getStripe(): Stripe {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY no está configurada en este proyecto de Vercel.')
    client = new Stripe(key)
  }
  return client
}

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => Reflect.get(getStripe(), prop),
})
