"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

const WHATSAPP_NUMBER = "18565622190"

export function LinkOnlyQuote({ productName, initialUrl }: { productName?: string; initialUrl: string }) {
  const [link, setLink] = useState(initialUrl)
  const [sending, setSending] = useState(false)

  async function sendQuote(event: React.FormEvent) {
    event.preventDefault()
    const url = link.trim()
    if (!url) return
    setSending(true)

    let detected = { title: "No detectado", price: "No detectado" }
    try {
      const response = await fetch(`/api/product-meta?url=${encodeURIComponent(url)}`)
      detected = await response.json()
    } catch {}

    const lines = [
      "NUEVA COTIZACION POR LINK:",
      productName ? `Producto de vitrina: ${productName}` : null,
      `Link: ${url}`,
      `Producto detectado: ${detected.title}`,
      `Precio detectado: ${detected.price}`,
    ].filter(Boolean)

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener")
    setSending(false)
  }

  return (
    <form onSubmit={sendQuote} className="flex flex-col gap-3 rounded-3xl bg-hub-navy p-4 text-background">
      <label htmlFor="quote-link" className="text-sm font-bold">
        Pega el link del producto
      </label>
      <input
        id="quote-link"
        type="url"
        required
        inputMode="url"
        value={link}
        onChange={(event) => setLink(event.target.value)}
        placeholder="https://..."
        className="w-full min-w-0 rounded-full bg-background px-4 py-3 text-sm text-hub-navy outline-none placeholder:text-hub-navy/40"
      />
      <button
        type="submit"
        disabled={sending}
        className="flex items-center justify-center gap-2 rounded-full bg-hub-pink py-3 text-sm font-bold text-background hover:opacity-90 disabled:opacity-70"
      >
        {sending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        {sending ? "Leyendo el link..." : "Cotizar por WhatsApp"}
      </button>
    </form>
  )
}
