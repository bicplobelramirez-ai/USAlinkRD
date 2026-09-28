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

  const cotizarProducto = (nombre: string) => {
    setLink(nombre)
    document.getElementById("cajita-cotizar")?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const enviarCotizacion = () => {
    if (!link.trim()) {
      window.alert("Pega un link o selecciona un producto")
      return
    }

    const mensaje = `Hola USALINK, quiero cotizar: ${link}`
    window.open(`https://wa.me/18565622190?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer")
  }

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-5 pb-8 text-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-5 rounded-3xl bg-black p-5 text-white shadow-lg">
          <a href="/" className="mb-5 inline-block text-sm text-white/70 hover:text-white">
            Volver a USALINK
          </a>
          <h1 className="text-2xl font-bold tracking-tight">TikTok Shop - Viral Hoy</h1>
          <p className="mt-1 text-sm text-white/65">124 productos en tendencia</p>
        </header>

        <label htmlFor="busqueda" className="sr-only">Buscar productos</label>
        <input
          id="busqueda"
          placeholder="Qué buscas: lip oil, projector..."
          className="mb-4 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
        />

        <section aria-label="Productos virales" className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <article key={producto.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="mb-3 h-28 overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h2 className="text-sm font-bold leading-tight">{producto.nombre}</h2>
              <p className="mt-1 text-xs text-slate-500">Llega a RD por {producto.precio}</p>
              <button
                type="button"
                onClick={() => cotizarProducto(producto.nombre)}
                className="mt-3 w-full rounded-xl bg-black px-2 py-2.5 text-xs font-bold text-white transition active:scale-[.98]"
              >
                Cotizar con USALINK
              </button>
              <p className="mt-2 text-center text-[10px] font-semibold text-pink-600">{producto.viral}</p>
            </article>
          ))}
        </section>

        <section id="cajita-cotizar" aria-label="Cotizar producto" className="sticky bottom-4 mt-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <label htmlFor="link-tiktok" className="mb-2 block text-xs font-bold text-slate-700">Link o producto para cotizar</label>
          <div className="flex gap-2">
            <input
              id="link-tiktok"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Pega tu link de TikTok aquí"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
            <button type="button" onClick={enviarCotizacion} className="rounded-xl bg-black px-4 text-sm font-bold text-white transition active:scale-[.98]">
              Cotizar
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">Envío estimado a RD en 7 días</p>
        </section>
      </div>
    </main>
  )
}
