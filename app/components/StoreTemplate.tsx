'use client'

import { useState } from 'react'

type StoreTemplateProps = {
  name: string
  slogan: string
  placeholder: string
  logoColor: string
}

const WHATSAPP_NUMBER = '18565622190'

export default function StoreTemplate({ name, slogan, placeholder, logoColor }: StoreTemplateProps) {
  const [link, setLink] = useState('')
  const [price, setPrice] = useState('')
  const [quote, setQuote] = useState<{
    link: string
    price: number
    tax: number
    shippingUSA: number
    profit: number
    totalUSD: number
    totalDOP: number
  } | null>(null)

  function calcularCotizacion() {
    const trimmedLink = link.trim()
    const parsedPrice = Number.parseFloat(price)

    if (!trimmedLink || !price.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      window.alert('Pega el link y un precio USD válido')
      return
    }

    const tax = parsedPrice * 0.08
    const shippingUSA = 8
    const profit = parsedPrice * 0.3
    const totalUSD = parsedPrice + tax + shippingUSA + profit
    const totalDOP = totalUSD * 61

    setQuote({
      link: trimmedLink,
      price: parsedPrice,
      tax,
      shippingUSA,
      profit,
      totalUSD,
      totalDOP,
    })
  }

  function enviarPorWhatsApp() {
    if (!quote) return

    const message = [
      `Hola USALINK! - ${name}`,
      `Link: ${quote.link}`,
      `Precio del producto: $${quote.price.toFixed(2)} USD`,
      `Impuesto USA (8%): $${quote.tax.toFixed(2)} USD`,
      `Envío dentro de USA: $${quote.shippingUSA.toFixed(2)} USD`,
      `Gestión USALINK (30%): $${quote.profit.toFixed(2)} USD`,
      '',
      `TOTAL ESTIMADO: $${quote.totalUSD.toFixed(2)} USD (~RD$${quote.totalDOP.toFixed(0)})`,
      'El envío local en RD se confirma aparte. ¿Lo ordenamos?',
    ].join('\n')

    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 pb-8 text-slate-950">
      <section className="mx-auto max-w-lg">
        <header className="-mx-4 overflow-hidden rounded-b-[2rem] px-5 pb-7 pt-5 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${logoColor}, #111827)` }}>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white">
            <span aria-hidden="true">←</span> Volver a USALINK
          </a>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">USALINK · Tienda USA</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight">{name}</h1>
              <p className="mt-2 text-sm text-white/80">{slogan}</p>
            </div>
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black ring-1 ring-white/20" aria-hidden="true">
              {name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="-mt-4 flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-md ring-1 ring-black/5">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" /> Compra 100% protegida <span className="text-slate-300" aria-hidden="true">•</span> Envío a RD
        </div>

        <div className="mt-6 rounded-[1.5rem] bg-white p-5 shadow-xl shadow-slate-200/60 ring-1 ring-black/5">
          <label htmlFor={`${name}-link`} className="text-base font-black">Pega el link del producto</label>
          <p className="mt-1 text-xs text-slate-500">Encuéntralo en {name} y nosotros lo llevamos a RD.</p>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-slate-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-900/5">
            <span className="text-lg text-slate-400" aria-hidden="true">↗</span>
            <input id={`${name}-link`} value={link} onChange={(event) => setLink(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400" />
          </div>
          <label htmlFor={`${name}-price`} className="mt-4 block text-base font-black">Precio del producto (USD)</label>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-slate-900 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-900/5">
            <span className="text-lg font-bold text-slate-400" aria-hidden="true">$</span>
            <input id={`${name}-price`} value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="Ej: 49.99" className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400" />
          </div>
          <button onClick={calcularCotizacion} className="mt-3 w-full rounded-2xl bg-slate-950 p-4 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0">
            Calcular cotización <span aria-hidden="true">→</span>
          </button>

          {quote ? (
            <section className="mt-5 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100" aria-live="polite">
              <h2 className="font-black text-emerald-950">Detalle de tu cotización</h2>
              <dl className="mt-3 flex flex-col gap-2 text-sm text-emerald-950">
                <div className="flex justify-between gap-3"><dt>Producto</dt><dd>${quote.price.toFixed(2)} USD</dd></div>
                <div className="flex justify-between gap-3"><dt>Impuesto USA (8%)</dt><dd>${quote.tax.toFixed(2)}</dd></div>
                <div className="flex justify-between gap-3"><dt>Envío USA</dt><dd>${quote.shippingUSA.toFixed(2)}</dd></div>
                <div className="flex justify-between gap-3"><dt>Gestión USALINK</dt><dd>${quote.profit.toFixed(2)}</dd></div>
                <div className="mt-2 flex justify-between gap-3 border-t border-emerald-200 pt-2 text-base font-black"><dt>Total estimado</dt><dd>RD${quote.totalDOP.toFixed(0)}</dd></div>
              </dl>
              <button onClick={enviarPorWhatsApp} className="mt-4 w-full rounded-2xl bg-emerald-600 p-4 font-black text-white transition hover:bg-emerald-700 active:scale-[0.99]">
                Enviar detalle por WhatsApp <span aria-hidden="true">→</span>
              </button>
              <p className="mt-2 text-center text-[11px] text-emerald-800">El envío dentro de RD se confirma aparte.</p>
            </section>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          {[
            ['01', 'Envío rápido'],
            ['02', 'Pago seguro'],
            ['03', 'Soporte RD'],
          ].map(([number, label]) => (
            <div key={number} className="rounded-2xl bg-white px-2 py-4 shadow-sm ring-1 ring-black/5">
              <span className="mx-auto flex size-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-black text-emerald-700">{number}</span>
              <p className="mt-2 text-[11px] font-bold text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
