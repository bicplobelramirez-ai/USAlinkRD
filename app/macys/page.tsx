'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '18565622190'

export default function MacysPage() {
  const [link, setLink] = useState('')

  function cotizar() {
    if (!link.trim()) {
      window.alert("Pega el link de Macy's")
      return
    }
    const message = `Hola USALINK! Quiero cotizar esto de Macy's: ${link.trim()}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] p-4 text-[#171717]">
      <a href="/" className="text-sm font-semibold text-[#6f4e37]">← Volver a USALINK</a>
      <section className="mx-auto mt-6 max-w-lg">
        <div className="rounded-3xl bg-[#efe4d5] p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-[#6f4e37]">USALINK · Tienda USA</p>
          <h1 className="mt-3 text-3xl font-black">Macy&apos;s</h1>
          <p className="mt-2 text-sm text-[#6f4e37]">Moda, belleza y hogar desde Estados Unidos.</p>
        </div>
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <label htmlFor="macys-link" className="text-sm font-bold">Pega el link del producto</label>
          <input id="macys-link" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://www.macys.com/..." className="mt-3 w-full rounded-xl border border-[#ded7cf] p-3 text-sm outline-none focus:ring-2 focus:ring-[#b78d63]" />
          <button onClick={cotizar} className="mt-3 w-full rounded-xl bg-[#171717] p-3 font-bold text-white transition hover:bg-black">Cotizar por WhatsApp</button>
        </div>
      </section>
    </main>
  )
}
