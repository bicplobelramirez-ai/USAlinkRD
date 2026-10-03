'use client'

import { useState, useTransition } from 'react'

import { createPaymentLink, type PaymentRequest } from '@/app/actions/stripe'
import type { Quote } from '@/lib/quote'

const WHATSAPP = 'https://wa.me/18565622190?text='

const usd = (value: number) =>
  `US$${value.toLocaleString('en-US', { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

export default function ApprovePayment({ request, summary }: { request: PaymentRequest; summary: string }) {
  const [isPending, startTransition] = useTransition()
  const [link, setLink] = useState<{ url: string; quote: Quote } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const approve = () => {
    setError('')
    startTransition(async () => {
      try {
        setLink(await createPaymentLink(request))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo generar el link de pago')
      }
    })
  }

  const openPayment = () => {
    if (!link) return
    if (window.self !== window.top) window.open(link.url, '_blank', 'noopener')
    else window.location.assign(link.url)
  }

  const copyLink = async () => {
    if (!link) return
    await navigator.clipboard.writeText(link.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!link) {
    return (
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={approve}
          disabled={isPending}
          className="w-full rounded-xl bg-black py-4 font-bold text-white disabled:opacity-60"
        >
          {isPending ? 'Generando tu link de pago...' : 'Aprobar cotización'}
        </button>
        {error && (
          <p role="alert" className="text-center text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }

  const whatsappText = `Hola USALINK, aprobé mi cotización:\n${summary}\nTotal: ${usd(link.quote.total)} (RD$${link.quote.totalRD.toLocaleString('en-US')})\nLink de pago: ${link.url}`

  return (
    <section aria-live="polite" className="flex flex-col gap-3 rounded-2xl border-2 border-black p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Cotización aprobada</p>
        <h2 className="mt-1 text-lg font-black">Tu link de pago está listo</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">
          {`Total a pagar: ${usd(link.quote.total)} · RD$${link.quote.totalRD.toLocaleString('en-US')}. Pago seguro con tarjeta a través de Stripe.`}
        </p>
      </div>

      <div className="truncate rounded-xl bg-neutral-100 px-3 py-2 font-mono text-xs text-neutral-600">{link.url}</div>

      <button type="button" onClick={openPayment} className="w-full rounded-xl bg-black py-4 font-bold text-white">
        {`Pagar ${usd(link.quote.total)} ahora`}
      </button>
      <div className="flex gap-2">
        <button type="button" onClick={copyLink} className="flex-1 rounded-xl bg-neutral-100 py-3 text-sm font-semibold">
          {copied ? 'Link copiado' : 'Copiar link'}
        </button>
        <a
          href={WHATSAPP + encodeURIComponent(whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl bg-neutral-100 py-3 text-center text-sm font-semibold"
        >
          Enviar por WhatsApp
        </a>
      </div>
    </section>
  )
}
