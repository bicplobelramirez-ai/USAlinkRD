"use client"

import { useState } from "react"

const IMG = "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply"

const productos = [
  { id: 1, nombre: "Nike Air Force 1 '07", precio: "$115", imagen: `${IMG}/a42a5d53-2f99-4e78-a081-9d07a2d0774a/AIR+FORCE+1+%2707.png` },
  { id: 2, nombre: "Nike Dunk Low Retro", precio: "$125", imagen: `${IMG}/2990f85d-8844-4e5b-a222-31ed53a5a9d4/NIKE+DUNK+LOW+RETRO.png` },
  { id: 3, nombre: "Nike Air Max 270", precio: "$160", imagen: `${IMG}/s6dp2gck3oukxj9csz5y/AIR+MAX+270.png` },
  { id: 4, nombre: "Nike Pegasus 42", precio: "$130", imagen: `${IMG}/5e69cf31-a91c-4465-9330-9d86e2f821fd/AIR+ZOOM+PEGASUS+42.png` },
  { id: 5, nombre: "Nike Vomero Plus", precio: "$180", imagen: `${IMG}/ab581537-fbd1-41c8-bded-200fa4f49db0/NIKE+VOMERO+PLUS.png` },
  { id: 6, nombre: "Nike Metcon 10", precio: "$155", imagen: `${IMG}/07e9d15a-d767-42b0-b383-fd97c3197aa8/M+NIKE+METCON+10.png` },
]

type Producto = (typeof productos)[number]

const WHATSAPP = "https://wa.me/18565622190?text="

export default function NikePage() {
  const [link, setLink] = useState("")
  const [selected, setSelected] = useState<Producto | null>(null)
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [note, setNote] = useState("")
  const [detecting, setDetecting] = useState(false)

  const openProductQuote = (producto: Producto) => {
    setSelected(producto)
    setSize("")
    setColor("")
    setQuantity("1")
    setNote("")
  }

  const sendProductQuote = () => {
    if (!selected || !size.trim() || !color.trim()) {
      window.alert("Escribe la talla y el color")
      return
    }
    const message = `NUEVA COTIZACION DE VITRINA (NIKE):\nProducto: ${selected.nombre}\nPrecio: ${selected.precio}\nTalla: ${size}\nColor: ${color}\nCantidad: ${quantity}\nNota: ${note || "Sin nota"}`
    window.open(WHATSAPP + encodeURIComponent(message), "_blank", "noopener,noreferrer")
    setSelected(null)
  }

  const sendLinkQuote = async () => {
    const value = link.trim()
    if (!value) {
      window.alert("Pega un link de nike.com")
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
    const message = `NUEVA COTIZACION POR LINK (NIKE):\nLink: ${value}\nProducto detectado: ${details.title}\nPrecio detectado: ${details.price}`
    window.open(WHATSAPP + encodeURIComponent(message), "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 pb-8 text-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-3xl bg-[#111111] p-5 text-white shadow-lg">
          <a href="/" className="mb-5 inline-block text-sm text-white/70 hover:text-white">Volver a USALINK</a>
          <h1 className="text-2xl font-bold tracking-tight">Nike</h1>
          <p className="mt-1 text-sm text-white/65">Just Do It - Sneakers originales desde USA</p>
        </header>

        <a
          href="https://www.nike.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[.98]"
        >
          Ver más en Nike ↗
        </a>

        <section aria-label="Productos Nike" className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <article key={producto.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 aspect-square overflow-hidden rounded-xl bg-[#f5f5f5]">
                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-contain" loading="lazy" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-sm font-bold leading-tight text-pretty">{producto.nombre}</h2>
              <p className="mt-1 text-xs text-slate-500">Llega a RD por {producto.precio}</p>
              <button type="button" onClick={() => openProductQuote(producto)} className="mt-3 w-full rounded-xl bg-black px-2 py-2.5 text-xs font-bold text-white active:scale-[.98]">
                Cotizar con USALINK
              </button>
            </article>
          ))}
        </section>

        <section aria-label="Cotizar por link" className="sticky bottom-4 mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <label htmlFor="link-nike" className="mb-2 block text-xs font-bold text-slate-700">Pega tu link de Nike</label>
          <div className="flex gap-2">
            <input id="link-nike" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://www.nike.com/t/..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none" />
            <button type="button" onClick={sendLinkQuote} disabled={detecting} className="rounded-xl bg-black px-4 text-sm font-bold text-white disabled:opacity-60">
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
                <img src={selected.imagen} alt="" className="size-14 rounded-xl bg-[#f5f5f5] object-contain" referrerPolicy="no-referrer" />
                <div>
                  <h2 id="quote-title" className="text-lg font-bold leading-tight">{selected.nombre}</h2>
                  <p className="text-sm text-slate-500">Precio: {selected.precio}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar" className="text-2xl leading-none text-slate-500">×</button>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <input aria-label="Talla" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Talla US (obligatorio) Ej: 10" className="rounded-xl border p-3" />
              <input aria-label="Color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color (obligatorio)" className="rounded-xl border p-3" />
              <select aria-label="Cantidad" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl border p-3">
                {["1", "2", "3", "4", "5"].map((n) => <option key={n} value={n}>Cantidad: {n}</option>)}
              </select>
              <textarea aria-label="Nota" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional" className="rounded-xl border p-3" rows={3} />
              <button type="button" onClick={sendProductQuote} className="rounded-xl bg-black p-3 font-bold text-white">Enviar Cotización</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
