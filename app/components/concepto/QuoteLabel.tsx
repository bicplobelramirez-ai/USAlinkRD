'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { whatsappQuoteUrl } from '@/lib/quote-agent'

export default function QuoteLabel() {
  const router = useRouter()
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function goToQuote() {
    const productUrl = link.trim()
    if (!/^https?:\/\//i.test(productUrl)) return setError('Pega un link válido del producto.')
    setError('')
    router.push(`/cotizar?url=${encodeURIComponent(productUrl)}`)
  }

  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -top-3 left-1/2 z-10 h-7 w-32 -translate-x-1/2 -rotate-2 bg-tape/90" />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          goToQuote()
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
            <span className="font-semibold">Tu courier en RD</span>
          </div>
        </div>

        <label className="flex flex-col gap-1 border-b-2 border-ink px-4 py-3">
          <span className="font-label text-xs text-fog">LINK DEL PRODUCTO</span>
          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            type="url"
            inputMode="url"
            placeholder="https://www.nike.com/t/..."
            className="bg-transparent py-1 font-label text-sm outline-none placeholder:text-fog/60"
          />
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 bg-stamp px-4 py-4 text-base font-bold text-label transition-colors hover:bg-ink"
        >
          Obtener cotización <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-3 font-label text-sm font-semibold text-ink">
          {error}
        </p>
      ) : null}
      <a
        href={whatsappQuoteUrl({ productUrl: link.trim() || undefined })}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center font-label text-sm text-fog underline underline-offset-4 hover:text-ink"
      >
        ¿Prefieres ayuda? Cotizar por WhatsApp
      </a>
    </div>
  )
}
