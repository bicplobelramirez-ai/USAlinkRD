"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, ChevronDown, Link2, Bookmark, ShieldCheck, ShoppingBag, Truck, MessageCircle } from "lucide-react"

const demoProduct = {
  name: "HOKA Clifton 10",
  store: "HOKA",
  price: 150,
  size: "10",
  color: "Black / White",
  quantity: 1,
  image: "/hoka-clifton-10.png",
}

const money = (value: number) => `$${value.toFixed(2)}`

export default function CotizarPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f6f8fb]" />}><CotizarContent /></Suspense>
}

function CotizarContent() {
  const router = useRouter()
  const params = useSearchParams()
  const incomingLink = params.get("url") || ""
  const [link, setLink] = useState(incomingLink || "https://www.hoka.com/en/us/mens-everyday-running-shoes/clifton-10")
  const [submitted, setSubmitted] = useState(true)
  const [saved, setSaved] = useState(false)

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#10213f] pb-8">
      <header className="sticky top-0 z-20 border-b border-[#e4eaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button type="button" onClick={() => router.back()} aria-label="Volver" className="rounded-full p-2 text-[#10213f] hover:bg-[#f0f4f9]"><ArrowLeft size={20} /></button>
          <div className="text-sm font-black tracking-tight">Cotización</div>
          <div className="size-9" />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4">
        <section className="pt-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2473b8]">Compra fácil en USA</p>
          <h1 className="mt-2 text-[29px] font-black leading-[1.05] tracking-[-0.045em] text-balance">Cotiza cualquier producto de USA</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">Pega el link del producto y descubre cuánto te cuesta comprarlo con UsaLink.</p>

          <div className="mt-5 rounded-2xl border border-[#dce5ef] bg-white p-2 shadow-[0_8px_24px_rgba(16,33,63,0.06)]">
            <div className="flex items-center gap-2 rounded-xl bg-[#f6f8fb] px-3">
              <Link2 size={17} className="shrink-0 text-[#2473b8]" />
              <input value={link} onChange={(event) => { setLink(event.target.value); setSubmitted(false) }} aria-label="Link del producto" placeholder="Pega aquí el link del producto" className="min-w-0 flex-1 bg-transparent py-3.5 text-xs text-[#334155] outline-none placeholder:text-[#94a3b8]" />
            </div>
            <button type="button" onClick={() => setSubmitted(true)} className="mt-2 w-full rounded-xl bg-[#10213f] py-3.5 text-sm font-black text-white transition-transform active:scale-[0.98]">Obtener cotización</button>
          </div>
        </section>

        {submitted && <>
          <section className="mt-7">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-black tracking-tight">Producto detectado</h2><span className="flex items-center gap-1 text-xs font-bold text-[#15915a]"><Check size={15} /> Disponible</span></div>
            <div className="overflow-hidden rounded-3xl border border-[#dce5ef] bg-white shadow-[0_8px_24px_rgba(16,33,63,0.06)]">
              <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#eef4f8] p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={demoProduct.image} alt="HOKA Clifton 10" className="size-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#2473b8]">HOKA</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-black tracking-tight">HOKA Clifton 10</h3><p className="mt-1 text-sm text-[#64748b]">HOKA · Precio original</p></div><span className="text-lg font-black">$150.00</span></div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[['Talla', '10'], ['Color', 'Black / White'], ['Cantidad', '1']].map(([label, value]) => <button key={label} type="button" className="flex min-w-0 items-center justify-between gap-1 rounded-xl border border-[#dce5ef] px-2.5 py-2 text-left"><span className="min-w-0"><span className="block text-[9px] font-bold uppercase text-[#94a3b8]">{label}</span><span className="mt-1 block truncate text-[11px] font-black">{value}</span></span><ChevronDown size={13} className="shrink-0 text-[#94a3b8]" /></button>)}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-[#dce5ef] bg-white p-5 shadow-[0_8px_24px_rgba(16,33,63,0.05)]">
            <h2 className="text-lg font-black tracking-tight">Descuentos aplicados</h2>
            <div className="mt-4 space-y-3 text-sm"><div className="flex justify-between text-[#94a3b8]"><span>Precio original</span><span className="line-through">/$150.00/</span></div><div className="flex justify-between"><span>Descuento de la tienda — 25%</span><span className="font-bold text-[#15915a]">−$37.50</span></div><div className="flex justify-between border-b border-[#edf1f5] pb-3 font-bold"><span>Subtotal</span><span>$112.50</span></div><div className="flex justify-between"><span>Descuento adicional — 10%</span><span className="font-bold text-[#15915a]">−$11.25</span></div></div>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#e9f8f0] px-3 py-1.5 text-[11px] font-black text-[#15915a]"><Check size={13} /> EXTRA10 aplicado</div>
            <div className="mt-5 flex items-end justify-between border-t border-[#edf1f5] pt-4"><span className="text-sm font-bold">Precio después de descuentos</span><span className="text-2xl font-black text-[#2473b8]">$101.25</span></div>
          </section>

          <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#10213f] p-6 text-white shadow-[0_12px_30px_rgba(16,33,63,0.2)]"><div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#2473b8]/40 blur-2xl" /><p className="relative text-sm font-bold text-[#8dd5ff]">🎉 Estás ahorrando</p><p className="relative mt-2 text-5xl font-black tracking-[-0.06em]">$48.75</p><p className="relative mt-2 text-sm text-white/70">32.5% menos que el precio original</p><div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[32.5%] rounded-full bg-[#55d187]" /></div></section>

          <section className="mt-5 rounded-3xl border border-[#dce5ef] bg-white p-5 shadow-[0_8px_24px_rgba(16,33,63,0.05)]"><h2 className="text-lg font-black tracking-tight">Tu cotización UsaLink</h2><div className="mt-4 space-y-3 text-sm"><div className="flex justify-between"><span>Producto después de descuentos</span><span>$101.25</span></div><div className="flex justify-between"><span>Envío dentro de USA</span><span>$0.00</span></div><div className="flex justify-between"><span>Sales tax</span><span>$6.63</span></div><div className="flex justify-between"><span>Fee UsaLink</span><span>$10.00</span></div></div><div className="mt-5 flex items-end justify-between border-t border-[#dce5ef] pt-4"><span className="text-base font-black">Total a pagar</span><span className="text-3xl font-black tracking-[-0.05em] text-[#2473b8]">$117.88</span></div><p className="mt-4 text-[11px] leading-5 text-[#94a3b8]">El envío internacional de tu courier no está incluido. Se paga directamente al courier.</p></section>

          <section className="mt-5"><button type="button" onClick={() => alert("Mockup visual: aquí continuará el flujo de compra.")} className="w-full rounded-2xl bg-[#2473b8] py-4 text-base font-black text-white shadow-[0_10px_22px_rgba(36,115,184,0.25)] transition-transform active:scale-[0.98]">Comprar ahora</button><p className="mt-3 text-center text-[11px] leading-5 text-[#94a3b8]">Antes de cobrarte verificaremos nuevamente precio, disponibilidad, talla, color y descuentos.</p><div className="mt-3 flex items-center justify-center gap-3"><button type="button" onClick={() => setSaved(!saved)} className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-white"><Bookmark size={15} fill={saved ? "currentColor" : "none"} /> {saved ? "Cotización guardada" : "Guardar cotización"}</button><button type="button" onClick={() => window.open(`https://wa.me/18565622190?text=${encodeURIComponent(`Hola UsaLink, quiero ayuda con esta cotización: ${link}`)}`, "_blank", "noopener,noreferrer")} className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#15915a]"><MessageCircle size={15} /> WhatsApp</button></div></section>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#e4eaf2] pt-5 text-center text-[10px] font-bold text-[#64748b]"><div><ShieldCheck size={20} className="mx-auto mb-1 text-[#2473b8]" />Compra segura</div><div><ShoppingBag size={20} className="mx-auto mb-1 text-[#2473b8]" />Precio claro</div><div><Truck size={20} className="mx-auto mb-1 text-[#2473b8]" />Entrega en RD</div></div>
        </>}
      </div>
    </main>
  )
}
