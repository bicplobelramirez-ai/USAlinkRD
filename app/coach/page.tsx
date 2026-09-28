"use client"

import { useState } from "react"

const productos = [
  { id: 1, nombre: "Coach Tabby Shoulder Bag 26", precio: "$350", imagen: "/coach/tabby-26.png" },
  { id: 2, nombre: "Coach Willow Tote 24 In Colorblock", precio: "$298", imagen: "/coach/willow-24.png" },
  { id: 3, nombre: "Coach City Tote Bag", precio: "$278", imagen: "/coach/city-tote.png" },
  { id: 4, nombre: "Coach Rowan File Bag", precio: "$298", imagen: "/coach/rowan-file.png" },
  { id: 5, nombre: "Coach Empire Carryall Bag 26", precio: "$398", imagen: "/coach/empire-26.png" },
  { id: 6, nombre: "Coach Lana Shoulder Bag 23", precio: "$258", imagen: "/coach/lana-23.png" },
]

type Producto = (typeof productos)[number]

const WHATSAPP = "https://wa.me/18565622190?text="

export default function CoachPage() {
  const [link, setLink] = useState("")
  const [selected, setSelected] = useState<Producto | null>(null)
  const [color, setColor] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [note, setNote] = useState("")
  const [detecting, setDetecting] = useState(false)

  const openProductQuote = (producto: Producto) => {
    setSelected(producto)
    setColor("")
    setQuantity("1")
    setNote("")
  }

  const sendProductQuote = () => {
    if (!selected || !color.trim()) {
      window.alert("Escribe el color")
      return
    }
    const message = `NUEVA COTIZACION DE VITRINA (COACH):\nProducto: ${selected.nombre}\nPrecio: ${selected.precio}\nColor: ${color}\nCantidad: ${quantity}\nNota: ${note || "Sin nota"}`
    window.open(WHATSAPP + encodeURIComponent(message), "_blank", "noopener,noreferrer")
    setSelected(null)
  }

  const sendLinkQuote = async () => {
    const value = link.trim()
    if (!value) {
      window.alert("Pega un link de coachoutlet.com")
      return
    }
    setDetecting(true)
    let details = { title: "No detectado", price: "No detectado" }
    try {
      const response = await fetch(`/api/product-meta?url=${encodeURIComponent(value)}`)
      if (response.ok) details = await response.json()
    } catch {
      // El link se envía aunque la tienda bloquee sus metadatos.
    } finally {
      setDetecting(false)
    }
    const message = `NUEVA COTIZACION POR LINK (COACH):\nLink: ${value}\nProducto detectado: ${details.title}\nPrecio detectado: ${details.price}`
    window.open(WHATSAPP + encodeURIComponent(message), "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 pb-8 text-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-3xl bg-[#422006] p-5 text-white shadow-lg">
          <a href="/" className="mb-5 inline-block text-sm text-white/70 hover:text-white">Volver a USALINK</a>
          <h1 className="text-2xl font-bold tracking-tight">Coach Outlet</h1>
          <p className="mt-1 text-sm text-white/65">Carteras premium y outlet desde USA</p>
        </header>

        <a
          href="https://www.coachoutlet.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[.98]"
        >
          Ver más en Coach Outlet ↗
        </a>

        <section aria-label="Productos Coach" className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <article key={producto.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#f5f5f5]">
                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <h2 className="text-sm font-bold leading-tight text-pretty">{producto.nombre}</h2>
              <p className="mt-1 text-xs text-slate-500">Precio USA: {producto.precio}</p>
              <button type="button" onClick={() => openProductQuote(producto)} className="mt-3 w-full rounded-xl bg-[#422006] px-2 py-2.5 text-xs font-bold text-white active:scale-[.98]">
                Cotizar con USALINK
              </button>
            </article>
          ))}
        </section>

        <section aria-label="Cotizar por link" className="sticky bottom-4 mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <label htmlFor="link-coach" className="mb-2 block text-xs font-bold text-slate-700">Pega tu link de Coach Outlet</label>
          <div className="flex gap-2">
            <input id="link-coach" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://www.coachoutlet.com/..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none" />
            <button type="button" onClick={sendLinkQuote} disabled={detecting} className="rounded-xl bg-[#422006] px-4 text-sm font-bold text-white disabled:opacity-60">
              {detecting ? "Leyendo..." : "Cotizar"}
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">Se enviará el link, nombre y precio detectados a WhatsApp.</p>
        </section>
      </div>

      {selected && (
        <div role="dialog" aria-modal="true" aria-labelledby="quote-title" className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
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
              <input aria-label="Color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color (obligatorio)" className="rounded-xl border p-3" />
              <select aria-label="Cantidad" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl border p-3">
                {["1", "2", "3", "4", "5"].map((n) => <option key={n} value={n}>Cantidad: {n}</option>)}
              </select>
              <textarea aria-label="Nota" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional" className="rounded-xl border p-3" rows={3} />
              <button type="button" onClick={sendProductQuote} className="rounded-xl bg-[#422006] p-3 font-bold text-white">Enviar Cotización</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
