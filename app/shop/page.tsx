'use client'

import { useState } from 'react'

export default function ShopPage() {
  const [link, setLink] = useState('')

  function cotizar() {
    if (!link.trim()) {
      window.alert('Pega el link de Shop.app')
      return
    }

    const message = `Hola USALINK! Quiero cotizar este producto de Shop: ${link.trim()}`
    window.open(`https://wa.me/TU_NUMERO?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8] p-4 text-[#111]">
      <header className="mx-auto flex max-w-lg items-center gap-3 py-3">
        <a href="/" aria-label="Volver al inicio" className="text-2xl leading-none">‹</a>
        <div>
          <h1 className="text-2xl font-bold">Shop App</h1>
          <p className="text-sm text-gray-500">Pega cualquier link de shop.app</p>
        </div>
      </header>

      <section className="mx-auto mt-3 max-w-lg rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="font-bold">Productos virales de Shop</h2>
        <p className="mt-1 text-xs text-gray-500">¿Viste algo en Shop.app? Pégalo aquí.</p>

        <label htmlFor="shop-link" className="sr-only">Link del producto de Shop</label>
        <input
          id="shop-link"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) cotizar()
          }}
          placeholder="https://shop.app/p/..."
          className="mt-4 w-full rounded-lg border border-gray-200 p-3 outline-none transition focus:border-black focus:ring-2 focus:ring-gray-200"
          type="url"
        />
        <button onClick={cotizar} className="mt-3 w-full rounded-lg bg-black p-3 font-bold text-white transition hover:bg-gray-800">
          Cotizar por WhatsApp
        </button>
      </section>

      <p className="mx-auto mt-6 max-w-lg text-xs text-gray-400">
        Tip: Abre shop.app, busca el producto, dale a compartir y pega el link aquí.
      </p>
    </main>
  )
}
