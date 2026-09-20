import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export const config = {
  api: { bodyParser: false },
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', chunk => (data += chunk))
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })
}

function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader) return false
  const parts = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')))
  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature) return false

  const signedPayload = `${timestamp}.${rawBody}`
  const expected = crypto.createHmac('sha256', secret).update(signedPayload, 'utf8').digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = await readRawBody(req)
  const sigHeader = req.headers['stripe-signature']
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET || !verifyStripeSignature(rawBody, sigHeader, WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'Firma inválida' })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ error: 'JSON inválido' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const pedidoId = session.metadata && session.metadata.pedido_id

    if (pedidoId) {
      await supabase
        .from('Pedidos')
        .update({ Estado: 'Pagado' })
        .eq('id', pedidoId)
    }
  }

  return res.status(200).json({ received: true })
}

