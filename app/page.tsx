'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cotizarHref } from '@/lib/quote'
import { Bell, ChevronRight, Home, MapPin, Search, ShoppingBag, Sparkles, UserRound } from 'lucide-react'


const categories = [
  ['Moda', '/macys/satin-dress.png', '/macys'],
  ['Tecnología', '/target/airpods.png', '/tienda/best-buy'],
  ['Calzado', '/foot-locker/samba.png', '/foot-locker'],
  ['Belleza', '/sephora/rare-beauty-blush.png', '/sephora'],
  ['Hogar', '/target/lamp.png', '/target'],
]

const stores = [
  ['NIKE', 'Sneakers', '/storefronts/nike.png', '/nike'],
  ['SEPHORA', 'Belleza', '/storefronts/sephora.png', '/sephora'],
  ['COACH OUTLET', 'Premium', '/storefronts/coach-outlet.png', '/coach'],
  ['TIKTOK SHOP', 'Lo más viral', '/storefronts/nike.png', '/tiktok-shop'],
  ['UNIQLO', 'Moda casual', '/storefronts/lululemon.png', '/uniqlo'],
  ['ETSY', 'Productos únicos', '/storefronts/apple-store.png', '/etsy'],
]

const offers = [
  ['-30%', 'Nike Air Force 1', 'US$ 80', 'RD$ 5,200', '/foot-locker/air-max-90.png', '/foot-locker'],
  ['-20%', 'Apple AirPods 4', 'US$ 119', 'RD$ 7,800', '/target/airpods.png', '/target'],
  ['-25%', 'Perfume YSL Libre', 'US$ 110', 'RD$ 7,400', '/sephora/dior-lip-oil.png', '/sephora'],
]

const moreStores = [
  ['Macy’s', '/macys'],
  ['Target', '/target'],
  ['Ulta', '/tienda/ulta-beauty'],
  ['Apple', '/tienda/apple-store'],
  ['Best Buy', '/tienda/best-buy'],
  ['Lululemon', '/lululemon'],
  ['Bath & Body', '/bath-and-body-works'],
  ['Carter’s', '/carters'],
  ['Michael Kors', '/tienda/michael-kors'],
  ['Shop', '/shop'],
]

export default function HomeMockup() {
  const router = useRouter()
  const [link, setLink] = useState('')
  const [error, setError] = useState('')

  function quote() {
    const value = link.trim()
    if (!/^https?:\/\/\S+\.\S+/i.test(value)) {
      setError('Pega un enlace válido (https://...)')
      return
    }
    setError('')
    router.push(cotizarHref(value))
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#f5f8fc] pb-24 text-[#071b45] shadow-[0_0_50px_rgba(7,27,69,0.14)] sm:my-6 sm:min-h-[calc(100vh-3rem)] sm:rounded-[2.5rem] sm:border-[10px] sm:border-[#071b45]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#071b45] via-[#0c3471] to-[#2473b8] px-4 pb-4 pt-3 text-white">
        <div className="relative z-10 mx-auto max-w-md">
          <header className="flex items-center justify-between">
            <Link href="/" className="text-lg font-black tracking-[-0.08em]"><span className="text-white">USA</span><span className="text-[#8dd5ff]">LINK</span></Link>
            <div className="flex items-center gap-4 text-white/85">
              <Link href="/tiendas" aria-label="Buscar tiendas"><Search size={18} /></Link>
              <Link href="/concepto#rastreo" aria-label="Notificaciones"><Bell size={18} /></Link>
            </div>
          </header>
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8dd5ff]">Compra en USA · Recibe en RD</p>
            <h1 className="mt-1 text-[22px] font-black leading-tight tracking-[-0.04em] text-balance">Pega el link. Nosotros compramos.</h1>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              quote()
            }}
            className="relative mt-3 flex rounded-2xl bg-white p-1 shadow-xl"
          >
            <input
              value={link}
              onChange={(event) => setLink(event.target.value)}
              placeholder="Pega aquí el enlace del producto"
              inputMode="url"
              className="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#071b45] outline-none placeholder:text-[#8b98aa]"
              aria-label="Enlace del producto"
            />
            <button type="submit" className="shrink-0 rounded-xl bg-[#2473b8] px-3 py-3 text-xs font-black text-white">Cotizar ahora →</button>
          </form>
          {error && <p role="alert" className="mt-2 text-[11px] font-bold text-[#ffd0d0]">{error}</p>}
          <div className="mt-2 flex items-center justify-between text-[10px] text-white/70"><span>Stripe · PayPal · VISA · Mastercard</span><span>Pago seguro</span></div>
        </div>
      </section>

      <section className="mx-4 mt-3 rounded-2xl border border-[#e8edf4] bg-white px-3 py-3 shadow-[0_8px_28px_rgba(7,27,69,0.08)]">
        <div className="mb-2 flex items-center justify-between"><h2 className="text-sm font-black">Así funciona</h2><Link href="/concepto" className="text-xs font-bold text-[#2473b8]">Ver más</Link></div>
        <div className="flex justify-between gap-2 text-center">
          {[['1', 'Cotiza', 'Pega el link', '🔗'], ['2', 'Recibe', 'Tu cotización', '📄'], ['3', 'Paga', 'Seguro', '💳'], ['4', 'Recíbelo', 'En RD', '📦']].map(([number, title, sub, icon]) => <div key={number} className="min-w-0 flex-1"><div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f4ff] text-sm">{icon}</div><p className="text-[11px] font-black">{number}. {title}</p><p className="text-[10px] text-[#7d8898]">{sub}</p></div>)}
        </div>
      </section>

      <Link href="/afrodita" className="mx-4 mt-3 flex items-center gap-3 rounded-2xl bg-[#071b45] p-3 text-white shadow-[0_8px_24px_rgba(7,27,69,0.18)] transition-transform active:scale-[0.98]">
        <div className="relative shrink-0">
          <img src="/afrodita-avatar.png" alt="Afrodita" className="size-14 rounded-2xl object-cover ring-2 ring-[#8dd5ff] animate-[pulse_3s_ease-in-out_infinite]" />
          <span className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#071b45] bg-[#55d187]" aria-label="Afrodita está disponible" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8dd5ff]">Tu asistente USALINK</p>
          <p className="mt-0.5 text-base font-black">Pregunta a Afrodita</p>
          <p className="truncate text-[11px] text-white/70">Encuentra, compara y cotiza tus productos.</p>
        </div>
        <ChevronRight className="size-5 shrink-0 text-[#8dd5ff]" />
      </Link>

      <Section title="Categorías" href="/hub"> 
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map(([name, image, href]) => (
            <Link key={name} href={href} className="w-20 shrink-0">
              <div className="aspect-square overflow-hidden rounded-2xl border border-[#e5ebf3] bg-white p-1 shadow-sm"><img src={image} alt="" className="h-full w-full rounded-xl object-cover" /></div>
              <p className="mt-2 text-center text-[11px] font-bold">{name}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Tiendas destacadas" href="/tiendas">
        <div className="grid grid-cols-2 gap-3">
          {stores.map(([name, type, image, href]) => (
            <Link key={name} href={href} className="relative h-32 overflow-hidden rounded-2xl bg-[#071b45] transition active:scale-[0.98]">
              <img src={image} alt="" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071b45] p-3 pt-8"><p className="text-[12px] font-black text-white">{name}</p><p className="text-[10px] text-white/70">{type}</p></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Ofertas del día" href="/tiendas">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {offers.map(([discount, name, usd, rd, image, href]) => (
            <Link key={name} href={href} className="relative w-36 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
              <span className="absolute left-2 top-2 z-10 rounded-md bg-[#e53935] px-2 py-1 text-[10px] font-black text-white">{discount}</span>
              <div className="h-28 bg-[#f7f9fb]"><img src={image} alt={name} className="h-full w-full object-contain" /></div>
              <div className="p-3"><p className="text-[11px] font-bold leading-tight">{name}</p><p className="mt-2 text-[10px] text-[#8b98aa]">{usd}</p><p className="text-sm font-black text-[#071b45]">{rd}</p></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Más tiendas">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {moreStores.map(([name, href]) => <Link key={name} href={href} className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-sm">{name}</Link>)}
        </div>
      </Section>

      <nav aria-label="Navegación principal" className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-[430px] items-end justify-around border-t border-[#e3e9f1] bg-white/95 px-3 pb-3 pt-2 shadow-[0_-5px_20px_rgba(7,27,69,0.08)] backdrop-blur">
        <NavItem href="/" icon={<Home size={18} />} label="Inicio" active />
        <NavItem href="/tiendas" icon={<ShoppingBag size={18} />} label="Tiendas" />
        <Link href="/afrodita" className="-mt-7 flex flex-col items-center gap-1"><div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#8b5cf6] text-white shadow-lg shadow-violet-200"><img src="/afrodita-avatar.png" alt="" className="size-full object-cover" /></div><span className="text-[10px] font-bold text-[#8b5cf6]">Afrodita</span></Link>
        <NavItem href="/concepto#rastreo" icon={<MapPin size={18} />} label="Rastreo" />
        <NavItem href="/cuenta" icon={<UserRound size={18} />} label="Cuenta" />
      </nav>
    </main>
  )
}

function Section({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-md px-4 pb-1 pt-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-[-0.03em]">{title}</h2>
        {href && <Link href={href} className="flex items-center gap-1 text-xs font-bold text-[#2473b8]">Ver todas<ChevronRight size={14} /></Link>}
      </div>
      {children}
    </section>
  )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return <Link href={href} aria-current={active ? 'page' : undefined} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${active ? 'text-[#2473b8]' : 'text-[#8995a8]'}`}>{icon}<span>{label}</span></Link>
}
