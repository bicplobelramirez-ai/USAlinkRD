'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const WHATSAPP_NUMBER = '18565622190'
const DOP_RATE = 61
const USA_SHIPPING = 8

function money(value: number) {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function QuoteLabel() {
  const [link, setLink] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')

  const parsed = Number.parseFloat(price)
  const hasPrice = Number.isFinite(parsed) && parsed > 0
  const tax = hasPrice ? parsed * 0.08 : 0
  const fee = hasPrice ? parsed * 0.3 : 0
  const totalUSD = hasPrice ? parsed + tax + USA_SHIPPING + fee : 0
  const totalDOP = Math.round(totalUSD * DOP_RATE)

  function sendQuote() {
    if (!link.trim()) return setError('Pega el link del producto.')
    if (!hasPrice) return setError('Escribe el precio en USD.')
    setError('')
    const message = [
      'Hola USALINK, quiero traer este producto:',
      `Link: ${link.trim()}`,
      `Precio: $${money(parsed)} USD`,
      `Total estimado: RD$${totalDOP.toLocaleString('en-US')} ($${money(totalUSD)} USD)`,
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const rows: [string, string][] = [
    ['Producto', hasPrice ? `$${money(parsed)}` : '—'],
    ['Tax USA 8%', hasPrice ? `$${money(tax)}` : '—'],
    ['Envío en USA', hasPrice ? `$${money(USA_SHIPPING)}` : '—'],
    ['Gestión USALINK', hasPrice ? `$${money(fee)}` : '—'],
  ]

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-7 w-32 -translate-x-1/2 -rotate-2 bg-tape/90" />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendQuote()
        }}
        className="relative border-2 border-ink bg-label shadow-[8px_8px_0_0_var(--color-ink)]"
      >
        <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3">
          <span className="text-lg font-black tracking-tight">GUÍA USALINK</span>
          <span className="font-label text-xs text-fog">MIA → SDQ</span>
        </div>

        <div className="grid grid-cols-2 border-b-2 border-ink font-label text-xs">
          <div className="flex flex-col gap-1 border-r-2 border-ink px-4 py-3">
            <span className="text-fog">DE</span>
            <span className="font-semibold">Cualquier tienda USA</span>
          </div>
          <div className="flex flex-col gap-1 px-4 py-3">
            <span className="text-fog">PARA</span>
            <span className="font-semibold">Tu puerta en RD</span>
          </div>
        </div>

        <label className="flex flex-col gap-1 border-b-2 border-ink px-4 py-3">
          <span className="font-label text-xs text-fog">1 · LINK DEL PRODUCTO</span>
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            type="url"
            inputMode="url"
            placeholder="https://www.nike.com/t/..."
            className="bg-transparent py-1 font-label text-sm outline-none placeholder:text-fog/60"
          />
        </label>

        <label className="flex flex-col gap-1 border-b-2 border-ink px-4 py-3">
          <span className="font-label text-xs text-fog">2 · PRECIO EN LA TIENDA (USD)</span>
          <div className="flex items-center gap-2">
            <span className="font-label text-lg font-semibold">$</span>
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              min="0.01"
              step="0.01"
              inputMode="decimal"
              placeholder="115.00"
              className="w-full bg-transparent py-1 font-label text-lg font-semibold outline-none placeholder:text-fog/60"
            />
          </div>
        </label>

        <dl className="flex flex-col gap-1 border-b-2 border-dashed border-ink px-4 py-3 font-label text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-fog">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-end justify-between gap-4 px-4 py-4">
          <div className="flex flex-col">
            <span className="font-label text-xs text-fog">TOTAL PUESTO EN RD</span>
            <output aria-live="polite" className="text-4xl font-black leading-none tracking-tight">
              {hasPrice ? `RD$${totalDOP.toLocaleString('en-US')}` : 'RD$—'}
            </output>
          </div>
          <span
            aria-hidden="true"
            className="-rotate-12 border-2 border-stamp px-2 py-1 font-label text-xs font-semibold text-stamp"
          >
            7 DÍAS
          </span>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-stamp px-4 py-4 text-base font-bold text-label transition-colors hover:bg-ink"
        >
          Pedir por WhatsApp <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-3 font-label text-sm font-semibold text-ink">
          {error}
        </p>
      ) : null}
    </div>
  )
}
