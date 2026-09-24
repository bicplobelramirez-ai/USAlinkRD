'use client'

import { useState } from 'react'
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  Crown,
  ExternalLink,
  Headphones,
  House,
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Target,
  Tag,
  Shirt,
  Smartphone,
} from 'lucide-react'

const categories = [
  { label: 'Outlets', icon: Tag },
  { label: 'Moda', icon: Shirt },
  { label: 'Tech', icon: Smartphone },
  { label: 'Belleza', icon: Sparkles },
]

const featuredStores = [
  ['TikTok Shop', 'Viral y descubrimiento'],
  ['Nike', 'Sneakers y deportes'],
  ['Coach Outlet', 'Premium y outlet'],
  ['Sephora', 'Belleza'],
  ['Uniqlo', 'Moda'],
  ['Etsy', 'Únicos y personalizados'],
]

const moreStores = ['Target', 'Lululemon', 'Foot Locker', 'SHEIN', 'Apple', 'Amazon']

const deals = [
  { name: 'AirPods Pro 2da', price: '$199', oldPrice: '$249', icon: Headphones },
  { name: 'Termo Stanley 1.2L', price: '$35.50', oldPrice: '$42', icon: ShoppingBag },
]

export default function Home() {
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')
  const [activeCategory, setActiveCategory] = useState('Outlets')
  const [activeTab, setActiveTab] = useState('Inicio')

  function handleQuote() {
    if (!link.trim()) {
      setMessage('Pega primero el enlace del producto que quieres comprar.')
      return
    }
    setMessage('¡Listo! Revisaremos tu enlace y prepararemos tu cotización.')
  }

  return (
    <main className="min-h-screen bg-white pb-24 text-[#111]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f0f0f0] bg-white/95 px-4 py-4 backdrop-blur">
        <div className="text-[27px] font-black tracking-[-0.06em] text-[#0a8a43]">USALINK</div>
        <div className="flex items-center gap-3 text-[#3e4541]" aria-label="Acciones de cuenta">
          <button aria-label="Notificaciones" className="rounded-full p-1 transition hover:bg-[#e9f7eb]"><Bell className="size-5" /></button>
          <button aria-label="Cuenta" className="rounded-full p-1 transition hover:bg-[#e9f7eb]"><CircleUserRound className="size-5" /></button>
        </div>
      </header>

      <section className="mx-3 mt-3 rounded-[20px] bg-[#e9f7eb] p-5">
        <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0a8a43]"><Crown className="size-3.5" /> Compras USA, sin complicaciones</p>
        <h1 className="text-[29px] font-black leading-[1.08] tracking-[-0.04em]">Pega el link.<br />Nosotros compramos.</h1>
        <p className="mt-2 text-sm text-[#5d665f]">Copia la URL de cualquier producto de Estados Unidos.</p>
        <div className="mt-4 flex gap-2">
          <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#d8e5da] bg-white px-3 focus-within:ring-2 focus-within:ring-[#93cf9d]">
            <ExternalLink className="mr-2 size-4 shrink-0 text-[#0a8a43]" />
            <input value={link} onChange={(event) => setLink(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) handleQuote() }} placeholder="Pega tu link de USA aquí" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#9ca39e]" aria-label="Enlace del producto" />
          </div>
          <button onClick={handleQuote} className="rounded-xl bg-[#0a8a43] px-4 text-sm font-bold text-white transition hover:bg-[#087238]">Cotizar</button>
        </div>
        <p className="mt-3 text-center text-[11px] font-medium text-[#49524c]">PayPal · VISA · Pago seguro y protegido</p>
        {message && <p role="status" className="mt-2 text-center text-xs font-semibold text-[#0a8a43]">{message}</p>}
      </section>

      <SectionHeading title="Categorías" />
      <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
        {categories.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveCategory(label)} className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition ${activeCategory === label ? 'border-[#c8eacb] bg-[#c8eacb] font-bold text-[#0a8a43]' : 'border-[#e8e8e8] bg-[#f6f6f6] text-[#4c514d]'}`}><Icon className="size-3.5" />{label}</button>)}
      </div>

      <SectionHeading title="Tiendas destacadas" />
      <div className="grid grid-cols-2 gap-3 px-4 py-3 sm:grid-cols-3">
        {featuredStores.map(([name, description]) => <button key={name} onClick={() => { if (name === 'TikTok Shop') window.location.href = '/tiktok.html'; if (name === 'Nike') window.location.href = '/nike.html'; if (name === 'Coach Outlet') window.location.href = '/coach.html'; if (name === 'Sephora') window.location.href = '/sephora.html'; if (name === 'Uniqlo') window.location.href = '/uniqlo.html'; if (name === 'Etsy') window.location.href = '/etsy.html'; if (name === 'Target') window.location.href = '/target.html'; }} className="rounded-2xl border border-[#eeeeee] bg-white p-4 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:-translate-y-0.5 hover:border-[#b9dfbd]"><b className="text-sm">{name}</b><span className="mt-2 inline-block rounded-full bg-[#e9f7eb] px-2 py-1 text-[10px] font-semibold text-[#0a8a43]">{description}</span></button>)}
      </div>

      <SectionHeading title="Más tiendas" />
      <div className="flex gap-2.5 overflow-x-auto px-4 py-3 [scrollbar-width:none]">{moreStores.map((store) => <button key={store} className="min-w-[78px] rounded-2xl border border-[#eeeeee] px-2 py-3 text-center text-[11px] font-semibold text-[#4c514d] transition hover:border-[#b9dfbd] hover:text-[#0a8a43]"><span className="mb-1.5 block text-[#0a8a43]"><Target className="mx-auto size-4" /></span>{store}</button>)}</div>

      <SectionHeading title="Ofertas del día" />
      <div className="grid grid-cols-2 gap-3 px-4 py-3">{deals.map(({ name, price, oldPrice, icon: Icon }) => <article key={name} className="overflow-hidden rounded-2xl border border-[#eeeeee] bg-white"><div className="flex h-28 items-center justify-center bg-[#f7f7f7] text-[#0a8a43]"><Icon className="size-10" strokeWidth={1.5} /></div><div className="p-3"><b className="text-[13px]">{name}</b><p className="mt-1 text-sm font-semibold">{price} <s className="ml-1 text-xs font-normal text-[#999]">{oldPrice}</s></p></div></article>)}</div>

      <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-[#eeeeee] bg-white/95 px-2 py-3 backdrop-blur" aria-label="Navegación principal">
        {[['Cuenta', CircleUserRound], ['Inicio', House], ['Tiendas', ShoppingBag], ['Rastreo', MapPin]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveTab(label as string)} className={`flex min-w-16 flex-col items-center gap-1 text-[10px] transition ${activeTab === label ? 'font-extrabold text-[#0a8a43]' : 'text-[#999]'}`}><Icon className="size-4" />{label as string}</button>)}
      </nav>
    </main>
  )
}

function SectionHeading({ title }: { title: string }) {
  return <div className="flex items-center justify-between px-4 pt-5"><h2 className="text-sm font-bold">{title}</h2><button className="flex items-center text-[13px] font-medium text-[#0a8a43]">Ver todo <ChevronRight className="size-3.5" /></button></div>
}
