"use client"

import { useState } from "react"
import { cotizarHref, cotizarProductHref } from "@/lib/quote"

export type VitrinaProducto = {
  id: number
  nombre: string
  precio: string
  imagen: string
}

type VitrinaStoreProps = {
  tienda: string
  slogan: string
  officialUrl: string
  linkPlaceholder: string
  brandColor: string
  productos: VitrinaProducto[]
  sizeLabel?: string
  colorLabel?: string
}


export default function VitrinaStore({
  tienda,
  slogan,
  officialUrl,
  linkPlaceholder,
  brandColor,
  productos,
  sizeLabel,
  colorLabel = "Color",
}: VitrinaStoreProps) {
  const [link, setLink] = useState("")
  const [selected, setSelected] = useState<VitrinaProducto | null>(null)
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [note, setNote] = useState("")
  const [detecting, setDetecting] = useState(false)

  const inputId = `link-${tienda.toLowerCase().replace(/\s+/g, "-")}`

  const openProductQuote = (producto: VitrinaProducto) => {
    setSelected(producto)
    setSize("")
    setColor("")
    setQuantity("1")
    setNote("")
  }

  const sendProductQuote = () => {
    if (!selected) return
    if (sizeLabel && !size.trim()) {
      window.alert(`Escribe: ${sizeLabel}`)
      return
    }
    if (!color.trim()) {
      window.alert(`Escribe: ${colorLabel}`)
      return
    }
    setSelected(null)
    window.location.assign(cotizarProductHref({ store: tienda, product: selected.nombre, size, color, quantity }))
  }

  const sendLinkQuote = () => {
    const value = link.trim()
    if (!value) {
      window.alert(`Pega un link de ${tienda}`)
      return
    }
    setDetecting(true)
    window.location.assign(cotizarHref(value, tienda))
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 pb-8 text-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ backgroundColor: brandColor }}>
          <a href="/" className="mb-5 inline-block text-sm text-white/70 hover:text-white">Volver a USALINK</a>
          <h1 className="text-2xl font-bold tracking-tight">{tienda}</h1>
          <p className="mt-1 text-sm text-white/65">{slogan}</p>
        </header>

        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[.98]"
        >
          {`Ver más en ${tienda} ↗`}
        </a>

        <section aria-label={`Productos ${tienda}`} className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <article key={producto.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#f5f5f5]">
                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <h2 className="text-sm font-bold leading-tight text-pretty">{producto.nombre}</h2>
              <p className="mt-1 text-xs text-slate-500">Precio USA: {producto.precio}</p>
              <button
                type="button"
                onClick={() => openProductQuote(producto)}
                className="mt-auto w-full rounded-xl px-2 py-2.5 text-xs font-bold text-white active:scale-[.98]"
                style={{ backgroundColor: brandColor, marginTop: "0.75rem" }}
              >
                Cotizar con USALINK
              </button>
            </article>
          ))}
        </section>

        <section aria-label="Cotizar por link" className="sticky bottom-4 mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-slate-700">{`Pega tu link de ${tienda}`}</label>
          <div className="flex gap-2">
            <input
              id={inputId}
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder={linkPlaceholder}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none"
            />
            <button
              type="button"
              onClick={sendLinkQuote}
              disabled={detecting}
              className="rounded-xl px-4 text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: brandColor }}
            >
              {detecting ? "Leyendo..." : "Cotizar"}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">Se enviará el link, nombre y precio detectados a WhatsApp.</p>
        </section>
      </div>

      {selected && (
        <div role="dialog" aria-modal="true" aria-labelledby="quote-title" className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="max-h-full w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={selected.imagen} alt="" className="size-14 rounded-xl bg-[#f5f5f5] object-cover" />
                <div>
                  <h2 id="quote-title" className="text-lg font-bold leading-tight">{selected.nombre}</h2>
                  <p className="text-sm text-slate-500">Precio: {selected.precio}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar" className="text-2xl leading-none text-slate-500">×</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {sizeLabel && (
                <input aria-label={sizeLabel} value={size} onChange={(e) => setSize(e.target.value)} placeholder={`${sizeLabel} (obligatorio)`} className="rounded-xl border p-3" />
              )}
              <input aria-label={colorLabel} value={color} onChange={(e) => setColor(e.target.value)} placeholder={`${colorLabel} (obligatorio)`} className="rounded-xl border p-3" />
              <select aria-label="Cantidad" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl border p-3">
                {["1", "2", "3", "4", "5"].map((n) => <option key={n} value={n}>Cantidad: {n}</option>)}
              </select>
              <textarea aria-label="Nota" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional" className="rounded-xl border p-3" rows={3} />
              <button type="button" onClick={sendProductQuote} className="rounded-xl p-3 font-bold text-white" style={{ backgroundColor: brandColor }}>
                Enviar Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
