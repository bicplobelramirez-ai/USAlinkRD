'use client'

import { useState } from 'react'
import {
  Bell,
  CircleUserRound,
  House,
  Link2,
  MapPin,
  Package,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Tag,
  Cpu,
} from 'lucide-react'

const categories = [
  { label: 'Outlets', icon: Tag },
  { label: 'Moda', icon: Shirt },
  { label: 'Tech', icon: Cpu },
  { label: 'Belleza', icon: Sparkles },
]

const featuredStores = [
  ['TikTok Shop', 'Viral', '/tiktok.html'],
  ['Nike', 'Sneakers', '/nike.html'],
  ['Coach Outlet', 'Premium', '/coach.html'],
  ['Sephora', 'Belleza', '/sephora.html'],
  ['Uniqlo', 'Moda', '/uniqlo.html'],
  ['Etsy', 'Únicos', '/etsy.html'],
]

const moreStores = [
  ['Target', '/target.html'],
  ['Bath & Body', '/bath.html'],
  ['Lululemon', '/lululemon.html'],
  ['Foot Locker', '/footlocker.html'],
  ['Shop', '/shop'],
  ["Carter's", '/carters'],
  ["Macy's", '/macys'],
]

const deals = [
  { name: 'AirPods Pro (2ª Gen)', price: '$199.99', oldPrice: '$249.99', discount: '-20%', icon: '🎧', rating: '4.8 · 1.2k' },
  { name: 'Termo Stanley 1.2L', price: '$35.50', oldPrice: '$42.00', discount: '-15%', icon: '🥤', rating: '4.9 · 856' },
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
    <main className="min-h-screen bg-[#f3f4f6] pb-24 text-[#101820]">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-5 py-5 shadow-[0_5px_18px_rgba(16,24,32,0.08)]">
        <div className="flex items-center gap-2.5 text-[#0a8a43]">
          <Link2 className="size-10" strokeWidth={3} />
          <span className="text-[29px] font-black tracking-[-0.06em]">USALINK</span>
        </div>
        <div className="flex items-center gap-3 text-[#17202b]">
          <button aria-label="Notificaciones" className="rounded-full p-1 transition hover:bg-[#e9f7eb]"><Bell className="size-7" strokeWidth={2.4} /></button>
          <button aria-label="Cuenta" className="rounded-full p-1 transition hover:bg-[#e9f7eb]"><CircleUserRound className="size-8" strokeWidth={2.2} /></button>
        </div>
      </header>

      <section className="bg-white px-7 pb-7 pt-12">
        <h1 className="max-w-[520px] text-[42px] font-black leading-[1.02] tracking-[-0.055em] sm:text-5xl">Pega el link. Nosotros compramos.</h1>
        <p className="mt-4 text-[19px] font-semibold text-[#656a72]">Copia la URL de cualquier producto USA</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <label className="flex min-w-0 flex-1 items-center rounded-full border border-[#cfd1d4] bg-white px-5 shadow-[0_2px_5px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-[#79c795]">
            <Link2 className="mr-3 size-7 shrink-0 text-[#0a8a43]" strokeWidth={2.5} />
            <input value={link} onChange={(event) => setLink(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) handleQuote() }} placeholder="Pega tu link de USA aquí" className="min-w-0 flex-1 bg-transparent py-5 text-lg outline-none placeholder:text-[#777c82]" aria-label="Enlace del producto" />
          </label>
          <button onClick={handleQuote} className="rounded-full bg-[#0aa052] px-8 py-4 text-lg font-extrabold text-white shadow-[0_4px_10px_rgba(10,160,82,0.25)] transition active:scale-[0.98] hover:bg-[#078643]">Cotizar ahora →</button>
        </div>
        <p className="mt-5 text-center text-[15px] font-semibold text-[#7a7d83]">Stripe&nbsp;&nbsp; PayPal&nbsp;&nbsp; VISA</p>
        <p className="mt-1 text-center text-[14px] text-[#7a7d83]">Pago seguro y protegido</p>
        {message && <p role="status" className="mt-3 text-center text-sm font-bold text-[#0a8a43]">{message}</p>}
      </section>

      <section className="bg-[#f3f4f6] px-7 py-7">
        <SectionHeading title="Categorías" />
        <div className="mt-5 grid grid-cols-4 gap-3">
          {categories.map(({ label, icon: Icon }) => <button key={label} onClick={() => setActiveCategory(label)} className={`flex flex-col items-center gap-3 rounded-2xl px-1 py-4 transition ${activeCategory === label ? 'bg-[#c7ead2]' : 'bg-[#dff2e4]'} hover:scale-[1.02]`}><Icon className="size-10 text-[#0a8a43]" strokeWidth={1.9} /><span className="text-sm font-semibold">{label}</span></button>)}
        </div>
      </section>

      <section className="bg-[#f7f8fa] px-7 py-6">
        <SectionHeading title="Tiendas destacadas" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {featuredStores.map(([name, description, href]) => <button key={name} onClick={() => { window.location.href = href }} className="flex min-h-[82px] flex-col items-center justify-center rounded-2xl bg-white px-2 py-3 shadow-[0_3px_10px_rgba(16,24,32,0.12)] transition active:scale-[0.98] hover:-translate-y-0.5"><span className="text-sm font-black tracking-tight">{name}</span><span className="mt-2 text-xs text-[#4c5158]">{description}</span></button>)}
        </div>
      </section>

      <section className="bg-[#f3f4f6] px-7 py-6">
        <SectionHeading title="Más tiendas" />
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {moreStores.map(([store, href]) => <button key={store} onClick={() => { window.location.href = href }} className="flex min-w-[92px] flex-col items-center gap-2 rounded-2xl bg-white px-2 py-4 text-center text-xs font-semibold shadow-[0_2px_8px_rgba(16,24,32,0.09)] transition hover:text-[#0a8a43]"><ShoppingBag className="size-6 text-[#0a8a43]" strokeWidth={1.8} />{store}</button>)}
        </div>
      </section>

      <section className="bg-[#f7f8fa] px-7 py-6">
        <SectionHeading title="Ofertas del día" />
        <div className="mt-5 grid grid-cols-2 gap-4">
          {deals.map((deal) => <article key={deal.name} className="overflow-hidden rounded-3xl bg-white shadow-[0_3px_12px_rgba(16,24,32,0.1)]"><div className="relative flex h-36 items-center justify-center bg-white text-6xl"><span className="absolute left-3 top-3 rounded-lg bg-[#0a9b50] px-2 py-1 text-xs font-extrabold text-white">{deal.discount}</span>{deal.icon}</div><div className="px-4 pb-4"><b className="text-sm leading-tight">{deal.name}</b><p className="mt-2 text-lg font-extrabold text-[#0a8a43]">{deal.price}</p><s className="text-xs text-[#85898e]">{deal.oldPrice}</s><p className="mt-1 text-xs text-[#51565d]">★ {deal.rating}</p></div></article>)}
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-3xl justify-around rounded-t-[28px] border border-[#dedfe1] bg-white/95 px-2 py-4 shadow-[0_-4px_18px_rgba(16,24,32,0.12)] backdrop-blur" aria-label="Navegación principal">
        {[['Inicio', House], ['Tiendas', ShoppingBag], ['IA', Sparkles], ['Rastreo', MapPin], ['Cuenta', CircleUserRound]].map(([label, Icon]) => <button key={label as string} onClick={() => setActiveTab(label as string)} className={`flex min-w-14 flex-col items-center gap-1 text-xs transition ${activeTab === label ? 'font-extrabold text-[#0a8a43]' : 'text-[#777c82]'}`}><Icon className="size-7" strokeWidth={activeTab === label ? 2.7 : 1.8} />{label as string}</button>)}
      </nav>
    </main>
  )
}

function SectionHeading({ title }: { title: string }) {
  return <div className="flex items-center justify-between"><h2 className="text-[21px] font-extrabold tracking-[-0.04em]">{title}</h2><button className="text-[17px] font-bold text-[#0a8a43]">Ver todo</button></div>
}
