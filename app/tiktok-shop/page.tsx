"use client"

import { useState } from "react"

const productos = [
  { id: 1, nombre: "Mini Projector 4K", precio: "$38.50", viral: "1.2k VIRAL", imagen: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80" },
  { id: 2, nombre: "Sunset Lamp 16 Colors", precio: "$24.90", viral: "890 VIRAL", imagen: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80" },
  { id: 3, nombre: "Lip Oil Dior Dupe", precio: "$18.00", viral: "2.1k VIRAL", imagen: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" },
  { id: 4, nombre: "LED Strip 100ft", precio: "$28.00", viral: "756 VIRAL", imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 5, nombre: "Hair Wax Stick", precio: "$12.50", viral: "540 VIRAL", imagen: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=80" },
  { id: 6, nombre: "Cloud Slippers", precio: "$22.00", viral: "1.1k VIRAL", imagen: "https://images.unsplash.com/photo-1525598912003-663126343e1f?w=600&q=80" },
]

export default function TikTokShop() {
  const [link, setLink] = useState("")
  const [selected, setSelected] = useState<(typeof productos)[number] | null>(null)
  const [size, setSize] = useState("")
  const [color, setColor] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [note, setNote] = useState("")
  const [detecting, setDetecting] = useState(false)

  const openProductQuote = (producto: (typeof productos)[number]) => {
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
    const message = `NUEVA COTIZACION DE VITRINA:\nProducto: ${selected.nombre}\nPrecio: ${selected.precio}\nTalla: ${size}\nColor: ${color}\nCantidad: ${quantity}\nNota: ${note || "Sin nota"}`
    window.open(`https://wa.me/18565622190?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
    setSelected(null)
  }

  const sendLinkQuote = async () => {
    const value = link.trim()
    if (!value) {
      window.alert("Pega un link de TikTok Shop")
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
    const message = `NUEVA COTIZACION POR LINK:\nLink: ${value}\nProducto detectado: ${details.title}\nPrecio detectado: ${details.price}`
    window.open(`https://wa.me/18565622190?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 pb-8 text-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-3xl bg-black p-5 text-white shadow-lg">
          <a href="/" className="mb-5 inline-block text-sm text-white/70 hover:text-white">Volver a USALINK</a>
          <h1 className="text-2xl font-bold tracking-tight">TikTok Shop - Viral Hoy</h1>
          <p className="mt-1 text-sm text-white/65">124 productos en tendencia</p>
        </header>
        <input aria-label="Buscar productos" placeholder="Qué buscas: lip oil, projector..." className="mb-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm outline-none" />
        <a
          href="https://shop.tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-[.98]"
        >
          Ver más en TikTok Shop ↗
        </a>
        <section aria-label="Productos virales" className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <article key={producto.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 h-28 overflow-hidden rounded-xl bg-slate-100"><img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" loading="lazy" /></div>
              <h2 className="text-sm font-bold leading-tight">{producto.nombre}</h2>
              <p className="mt-1 text-xs text-slate-500">Llega a RD por {producto.precio}</p>
              <button type="button" onClick={() => openProductQuote(producto)} className="mt-3 w-full rounded-xl bg-black px-2 py-2.5 text-xs font-bold text-white active:scale-[.98]">Cotizar con USALINK</button>
              <p className="mt-2 text-center text-[10px] font-semibold text-pink-600">{producto.viral}</p>
            </article>
          ))}
        </section>
        <section aria-label="Cotizar por link" className="sticky bottom-4 mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <label htmlFor="link-tiktok" className="mb-2 block text-xs font-bold text-slate-700">Pega tu link de TikTok Shop</label>
          <div className="flex gap-2"><input id="link-tiktok" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://shop.tiktok.com/..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none" /><button type="button" onClick={sendLinkQuote} disabled={detecting} className="rounded-xl bg-black px-4 text-sm font-bold text-white disabled:opacity-60">{detecting ? "Leyendo..." : "Cotizar"}</button></div>
          <p className="mt-3 text-center text-xs text-slate-500">Se enviará el link, nombre y precio detectados a WhatsApp.</p>
        </section>
      </div>
      {selected && <div role="dialog" aria-modal="true" aria-labelledby="quote-title" className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"><div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><h2 id="quote-title" className="text-lg font-bold">Cotizar {selected.nombre}</h2><p className="text-sm text-slate-500">Precio: {selected.precio}</p></div><button type="button" onClick={() => setSelected(null)} aria-label="Cerrar">×</button></div><div className="mt-4 flex flex-col gap-3"><input aria-label="Talla" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Talla (obligatorio)" className="rounded-xl border p-3" /><input aria-label="Color" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Color (obligatorio)" className="rounded-xl border p-3" /><select aria-label="Cantidad" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="rounded-xl border p-3"><option value="1">Cantidad: 1</option><option value="2">Cantidad: 2</option><option value="3">Cantidad: 3</option><option value="4">Cantidad: 4</option><option value="5">Cantidad: 5</option></select><textarea aria-label="Nota" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional" className="rounded-xl border p-3" rows={3} /><button type="button" onClick={sendProductQuote} className="rounded-xl bg-black p-3 font-bold text-white">Enviar Cotización</button></div></div></div>}
    </main>
  )
}
