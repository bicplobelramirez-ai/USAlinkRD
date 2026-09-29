'use client'

import { useEffect, useState } from 'react'
import { Check, Link2, Lock, MessageCircle, Pause, Play, Plane, Store } from 'lucide-react'

type Visual = 'storefronts' | 'link' | 'whatsapp' | 'secure' | 'delivery'

const scenes: { label: string; caption: string; voice: string; visual: Visual; seconds: number }[] = [
  { label: 'Descubre', caption: 'Miles de tiendas. Un solo lugar.', voice: '¿Quieres comprar en tus tiendas favoritas de Estados Unidos?', visual: 'storefronts', seconds: 3 },
  { label: 'Elige', caption: '1. Elige tu producto', voice: 'Encuentra lo que quieres y envíanos el link.', visual: 'link', seconds: 4 },
  { label: 'Cotiza', caption: '2. Recibe tu cotización', voice: 'Con un toque, solicita tu cotización por WhatsApp.', visual: 'whatsapp', seconds: 4 },
  { label: 'Paga', caption: '3. Paga seguro', voice: 'Aprueba tu cotización y paga de forma segura.', visual: 'secure', seconds: 4 },
  { label: 'Recibe', caption: 'Tú eliges. USALINK lo hace posible.', voice: 'Nosotros compramos en Estados Unidos y llevamos tu compra hasta tu courier.', visual: 'delivery', seconds: 5 },
]

const storefronts = [
  ['Coach Outlet', '/storefronts/coach-outlet.png'],
  ['Nike', '/storefronts/nike.png'],
  ['Sephora', '/storefronts/sephora.png'],
  ['Target', '/storefronts/target.png'],
]

function SceneVisual({ type }: { type: Visual }) {
  if (type === 'storefronts') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {storefronts.map(([name, src]) => (
          <div key={name} className="relative h-24 overflow-hidden rounded-xl">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#101820] to-transparent px-2 pb-1.5 pt-4 text-xs font-bold text-[#f7faf8]">{name}</span>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'link') {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-[#f7faf8] p-4 text-[#101820]">
        <div className="flex gap-3">
          <img src="/foot-locker/air-max-90.png" alt="" className="size-20 rounded-xl bg-[#e6ebe7] object-cover" />
          <div className="flex flex-col justify-center">
            <b className="text-sm">Nike Air Max 90</b>
            <span className="text-xs text-[#51565d]">nike.com</span>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#cfd1d4] px-3 py-2 text-xs text-[#51565d]">
          <Link2 className="size-4 shrink-0 text-[#0a8a43]" aria-hidden="true" />
          <span className="truncate">https://www.nike.com/t/air-max-90</span>
        </div>
        <span className="flex items-center justify-center gap-2 rounded-full bg-[#0a9b50] py-2 text-sm font-bold text-[#f7faf8]">
          <Check className="size-4" aria-hidden="true" /> Link copiado
        </span>
      </div>
    )
  }

  if (type === 'whatsapp') {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-[#f7faf8] p-4 text-[#101820]">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#0a9b50] text-[#f7faf8]">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <div>
            <b className="block text-sm">USALINK</b>
            <span className="text-xs text-[#51565d]">en línea</span>
          </div>
        </div>
        <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#d7f1df] p-3 text-xs leading-relaxed">
          Hola USALINK, quiero cotizar este producto: nike.com/t/air-max-90
        </p>
        <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#e6ebe7] p-3 text-xs leading-relaxed">
          Recibido. Te enviamos tu cotización en minutos.
        </p>
      </div>
    )
  }

  if (type === 'secure') {
    return (
      <div className="flex flex-col gap-2 rounded-2xl bg-[#f7faf8] p-4 text-sm text-[#101820]">
        <b className="mb-1">Tu cotización</b>
        {[['Nike Air Max 90 · Talla 9 · Blanco', '$130.00'], ['Descuento', '-$19.50'], ['Tax + envío USA', '$14.20'], ['Gestión USALINK', '$12.00']].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2 text-xs text-[#51565d]">
            <span>{k}</span>
            <span className={v.startsWith('-') ? 'font-bold text-[#0a8a43]' : ''}>{v}</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between border-t border-[#cfd1d4] pt-2 font-black">
          <span>Total</span>
          <span>RD$8,190</span>
        </div>
        <span className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#0a9b50] py-2 font-bold text-[#f7faf8]">
          <Lock className="size-4" aria-hidden="true" /> Pagar seguro
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#f7faf8] p-4 text-[#101820]">
      <div className="flex items-center justify-between text-xs font-bold">
        {['Miami', 'Courier', 'RD'].map((stop, i) => (
          <span key={stop} className="flex flex-col items-center gap-1">
            <span className={`grid size-8 place-items-center rounded-full ${i < 2 ? 'bg-[#0a9b50] text-[#f7faf8]' : 'bg-[#101820] text-[#f7faf8]'}`}>
              {i === 0 ? <Store className="size-4" aria-hidden="true" /> : i === 1 ? <Plane className="size-4" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}
            </span>
            {stop}
          </span>
        ))}
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-[#cfd1d4]">
        <span className="promo-progress absolute inset-y-0 left-0 rounded-full bg-[#0a9b50]" />
      </div>
      <img src="/concepto/caja-usalink.png" alt="" className="h-24 w-full rounded-xl object-cover" />
    </div>
  )
}

export function PromoVideo() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const scene = scenes[active]

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setActive((i) => (i + 1) % scenes.length), scene.seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [active, playing, scene.seconds])

  function goToQuote() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    document.querySelector<HTMLInputElement>('input[aria-label="Enlace del producto"]')?.focus({ preventScroll: true })
  }

  return (
    <section aria-label="Cómo funciona USALINK en 20 segundos" className="bg-[#18252c] px-7 py-7">
      <div className="flex items-center justify-between">
        <h2 className="text-[21px] font-extrabold tracking-[-0.04em]">Así funciona</h2>
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pausar video' : 'Reproducir video'}
          className="grid size-9 place-items-center rounded-full bg-[#202e35] text-[#51d98b] transition hover:bg-[#2a3b43]"
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl bg-[#101820] shadow-[0_5px_18px_rgba(0,0,0,0.3)]">
        <div className="flex gap-1 p-3" role="tablist" aria-label="Escenas">
          {scenes.map((s, i) => (
            <button
              key={s.label}
              role="tab"
              aria-selected={i === active}
              aria-label={`Escena ${i + 1}: ${s.label}`}
              onClick={() => setActive(i)}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#38515a]"
            >
              {i < active && <span className="block h-full w-full bg-[#51d98b]" />}
              {i === active && (
                <span
                  key={`${active}-${playing}`}
                  className="promo-bar block h-full bg-[#51d98b]"
                  style={{ animationDuration: `${scene.seconds}s`, animationPlayState: playing ? 'running' : 'paused' }}
                />
              )}
            </button>
          ))}
        </div>

        <div key={active} className="promo-scene flex flex-col gap-4 px-5 pb-6 pt-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#51d98b]">{scene.label}</span>
          <p className="text-balance text-[28px] font-black leading-[1.05] tracking-[-0.05em] text-[#f7faf8]">{scene.caption}</p>
          <SceneVisual type={scene.visual} />
          <p className="text-pretty text-sm leading-relaxed text-[#b7c2c0]">{scene.voice}</p>
          {scene.visual === 'delivery' && (
            <button onClick={goToQuote} className="rounded-full bg-[#0aa052] py-4 text-lg font-extrabold text-[#f7faf8] transition hover:bg-[#078643] active:scale-[0.98]">
              Comprar ahora
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

export default PromoVideo
