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

  function cotizar() {
    const trimmedLink = link.trim()
    if (!trimmedLink) {
      window.alert('Pega el link del producto')
      return
    }

    const message = `Hola USALINK! Quiero cotizar esto de ${name}: ${trimmedLink}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-slate-950">
      <a href="/" className="text-sm font-semibold text-slate-600">← Volver a USALINK</a>
      <section className="mx-auto mt-6 max-w-lg">
        <div className="rounded-3xl p-6 text-white" style={{ backgroundColor: logoColor }}>
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">USALINK · Tienda USA</p>
          <h1 className="mt-3 text-3xl font-black">{name}</h1>
          <p className="mt-2 text-sm opacity-90">{slogan}</p>
        </div>
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <label htmlFor={`${name}-link`} className="text-sm font-bold">Pega el link del producto</label>
          <input id={`${name}-link`} value={link} onChange={(event) => setLink(event.target.value)} placeholder={placeholder} className="mt-3 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-slate-300" />
          <button onClick={cotizar} className="mt-3 w-full rounded-xl bg-slate-950 p-3 font-bold text-white transition hover:bg-slate-800">Cotizar por WhatsApp</button>
        </div>
      </section>
    </main>
  )
}
