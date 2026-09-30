'use client'

import { useState } from 'react'
import { ArrowRight, Bell, CircleUserRound, Home, Link2, MapPin, Package, Plane, Search, ShoppingBag, Sparkles, Tag, Truck } from 'lucide-react'

const categories = [
  ['Moda', '/macys/satin-dress.png', '/hub/moda'],
  ['Tecnología', '/target/airpods.png', '/hub/tech'],
  ['Calzado', '/foot-locker/air-max-90.png', '/hub/sneakers'],
  ['Belleza', '/sephora/rare-beauty-blush.png', '/hub/belleza'],
  ['Hogar', '/target/lamp.png', '/hub/outlets'],
]

const stores = [
  ['NIKE', 'Sneakers', '/nike', '/storefronts/nike.png'],
  ['SEPHORA', 'Belleza', '/sephora', '/storefronts/sephora.png'],
  ['COACH OUTLET', 'Premium', '/coach', '/storefronts/coach-outlet.png'],
  ['TIKTOK SHOP', 'Lo más viral', '/tiktok-shop', '/storefronts/nike.png'],
  ['UNIQLO', 'Moda casual', '/uniqlo', '/storefronts/lululemon.png'],
  ['ETSY', 'Productos únicos', '/etsy', '/storefronts/apple-store.png'],
]

const offers = [
  ['Nike Air Force 1', 'US$ 80', 'RD$ 5,200', '-30%', '/foot-locker/air-max-90.png'],
  ['Apple AirPods 4', 'US$ 119', 'RD$ 7,800', '-20%', '/target/airpods.png'],
  ['Perfume YSL Libre', 'US$ 110', 'RD$ 7,400', '-25%', '/sephora/dior-lip-oil.png'],
]

const moreStores = ['Target', 'Best Buy', 'Ulta', 'Apple', 'Lululemon', 'Foot Locker']

export default function Home() {
  const [link, setLink] = useState('')
  const [message, setMessage] = useState('')

  function quote() {
    if (!link.trim()) return setMessage('Pega primero el enlace del producto.')
    window.location.assign(`https://wa.me/18565622190?text=${encodeURIComponent(`Hola USALINK, quiero cotizar: ${link.trim()}`)}`)
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] pb-24 text-[#071b45]">
      <section className="relative isolate overflow-hidden rounded-b-[32px] bg-gradient-to-br from-[#071b45] via-[#0b3970] to-[#1879b8] px-5 pb-7 pt-5 text-white shadow-[0_12px_30px_rgba(7,27,69,.2)]">
        <div className="absolute -right-5 top-8 opacity-25"><Plane className="size-32 rotate-12" strokeWidth={1} /></div>
        <div className="absolute bottom-4 right-3 opacity-80"><img src="/concepto/caja-usalink.png" alt="Caja de envío USALINK" className="h-24 w-28 object-cover object-left rounded-xl" /></div>
        <header className="relative z-10 flex items-center justify-between">
          <a href="/" className="text-[23px] font-black tracking-[-.07em]"><span>USA</span><span className="text-[#9bd9ff]">LINK</span></a>
          <div className="flex items-center gap-1"><button aria-label="Buscar" className="rounded-full p-2 hover:bg-white/10"><Search className="size-5" /></button><button aria-label="Notificaciones" className="rounded-full p-2 hover:bg-white/10"><Bell className="size-5" /></button></div>
        </header>
        <div className="relative z-10 mt-8 max-w-[340px]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#9bd9ff]">Compras desde USA</p>
          <h1 className="text-[35px] font-black leading-[.98] tracking-[-.06em]">Pega el link.<br />Nosotros compramos.</h1>
          <p className="mt-3 text-sm font-medium text-blue-100">De tus tiendas favoritas a República Dominicana</p>
        </div>
        <div className="relative z-10 mt-6 flex rounded-2xl bg-white p-1.5 shadow-xl">
          <Link2 className="ml-3 mt-3 size-5 shrink-0 text-[#1879b8]" />
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Pega aquí el enlace del producto" aria-label="Enlace del producto" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#071b45] outline-none placeholder:text-slate-400" />
          <button onClick={quote} className="rounded-xl bg-[#1879b8] px-3 text-xs font-extrabold text-white">Cotizar ahora <ArrowRight className="ml-1 inline size-3" /></button>
        </div>
        {message && <p role="status" className="relative z-10 mt-2 text-xs font-bold text-yellow-200">{message}</p>}
        <p className="relative z-10 mt-4 text-center text-[10px] font-semibold tracking-wide text-blue-100">Stripe · PayPal · VISA · Mastercard</p>
        <p className="relative z-10 mt-1 text-center text-[10px] text-blue-100">Pago seguro y protegido</p>
      </section>

      <section className="mx-4 -mt-1 rounded-3xl bg-white px-4 py-5 shadow-[0_5px_24px_rgba(7,27,69,.08)]">
        <div className="flex items-center justify-between"><h2 className="text-lg font-extrabold">Así funciona</h2><button className="text-xs font-bold text-[#1879b8]">Ver más</button></div>
        <div className="mt-5 grid grid-cols-4 gap-2 text-center">
          {[[Link2, '1. Cotiza', 'Pega el link', 'bg-blue-100 text-blue-700'], [Tag, '2. Recibe', 'Tu cotización', 'bg-sky-100 text-sky-700'], [ShoppingBag, '3. Paga', 'Seguro', 'bg-violet-100 text-violet-700'], [Package, '4. Recíbelo', 'En RD', 'bg-emerald-100 text-emerald-700']].map(([Icon, title, caption, color]) => <div key={title as string}><div className={`mx-auto flex size-10 items-center justify-center rounded-full ${color}`}><Icon className="size-5" /></div><b className="mt-2 block text-[10px] leading-tight">{title as string}</b><span className="mt-1 block text-[9px] text-slate-500">{caption as string}</span></div>)}
        </div>
      </section>

      <Section title="Categorías" action="Ver todas"><div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">{categories.map(([name, image, href]) => <a key={name} href={href} className="min-w-[82px] text-center"><div className="h-[78px] overflow-hidden rounded-2xl bg-slate-100"><img src={image} alt={name} className="h-full w-full object-cover" /></div><span className="mt-2 block text-xs font-bold">{name}</span></a>)}</div></Section>

      <Section title="Tiendas destacadas" action="Ver todas"><div className="grid grid-cols-2 gap-3">{stores.map(([name, caption, href, image]) => <a key={name} href={href} className="relative h-[134px] overflow-hidden rounded-2xl bg-slate-200"><img src={image} alt={`${name} storefront`} className="h-full w-full object-cover" /><span className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#071b45] to-transparent" /><span className="absolute bottom-3 left-3 text-white"><b className="block text-xs">{name}</b><small className="text-[10px] text-white/75">{caption}</small></span></a>)}</div></Section>

      <Section title="Ofertas del día" action="Ver todas"><div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none]">{offers.map(([name, usd, rd, discount, image]) => <article key={name} className="min-w-[154px] overflow-hidden rounded-2xl bg-white shadow-sm"><div className="relative h-28 bg-slate-100"><span className="absolute left-2 top-2 z-10 rounded-md bg-[#e5484d] px-2 py-1 text-[10px] font-black text-white">{discount}</span><img src={image} alt={name} className="h-full w-full object-contain" /></div><div className="p-3"><b className="block text-xs">{name}</b><span className="text-[10px] text-slate-400">{usd}</span><strong className="mt-1 block text-sm text-[#1879b8]">{rd}</strong></div></article>)}</div></Section>

      <Section title="Más tiendas"><div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{moreStores.map((name) => <a href="/tiendas" key={name} className="flex min-w-[92px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-3 text-[10px] font-bold shadow-sm"><ShoppingBag className="mr-1.5 size-4 text-[#1879b8]" />{name}</a>)}</div></Section>

      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-[430px] items-end justify-around border-t border-slate-200 bg-white/95 px-2 py-3 shadow-[0_-8px_24px_rgba(7,27,69,.1)] backdrop-blur" aria-label="Navegación principal">
        {[[Home, 'Inicio'], [ShoppingBag, 'Tiendas'], [Sparkles, 'Afrodita'], [MapPin, 'Rastreo'], [CircleUserRound, 'Cuenta']].map(([Icon, label], index) => <a href={label === 'Tiendas' ? '/tiendas' : '#'} key={label as string} className={`flex min-w-14 flex-col items-center gap-1 text-[10px] font-semibold ${label === 'Afrodita' ? '-mt-7' : ''} ${index === 0 ? 'text-[#1879b8]' : 'text-slate-500'}`}><span className={label === 'Afrodita' ? 'flex size-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-200' : ''}><Icon className="size-5" /></span>{label as string}</a>)}
      </nav>
    </main>
  )
}

function Section({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return <section className="px-4 py-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold tracking-tight">{title}</h2>{action && <button className="text-xs font-bold text-[#1879b8]">{action}</button>}</div>{children}</section>
}
