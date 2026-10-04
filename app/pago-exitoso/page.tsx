import Link from 'next/link'

import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Pago recibido | USALINK' }

export default async function PagoExitosoPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const session =
    session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)
      ? await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] }).catch(() => null)
      : null

  const paid = session?.payment_status === 'paid'
  const item = session?.line_items?.data[0]?.description
  const amount = session?.amount_total ? (session.amount_total / 100).toFixed(2) : null
  const store = session?.metadata?.store

  const message = `Hola USALINK, ya pagué mi pedido.\nProducto: ${item ?? ''}\nTotal: US$${amount ?? ''}\nReferencia: ${session?.id.slice(-10) ?? ''}`

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-black">
      <div className="flex w-full max-w-sm flex-col gap-4 text-center">
        <h1 className="text-2xl font-black text-balance">{paid ? '¡Pago recibido!' : 'Estamos confirmando tu pago'}</h1>
        {session ? (
          <div className="rounded-2xl bg-neutral-50 p-4 text-left text-sm leading-relaxed">
            <p className="font-bold">{item}</p>
            {store && <p className="text-neutral-500">{`Tienda: ${store}`}</p>}
            {amount && <p className="mt-2 text-lg font-black">{`US$${amount}`}</p>}
            <p className="mt-2 font-mono text-xs text-neutral-400">{`Ref. ${session.id.slice(-10)}`}</p>
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No encontramos la referencia del pago.</p>
        )}
        <p className="text-sm leading-relaxed text-neutral-600">
          Compramos tu producto en USA y te enviamos la factura y el número de rastreo por WhatsApp.
        </p>
        <a
          href={`https://wa.me/18565622190?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-black py-4 font-bold text-white"
        >
          Confirmar por WhatsApp
        </a>
        <Link href="/" className="rounded-xl bg-neutral-100 py-3 text-sm">
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
