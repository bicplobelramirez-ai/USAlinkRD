"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Heart,
  LockKeyhole,
  LogOut,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  UserRound,
  X,
} from "lucide-react"

type OrderStatus = "Cotización recibida" | "Esperando pago" | "Compra realizada" | "Recibido en Miami" | "Entregado al courier" | "Completado"

type Order = {
  id: string
  product: string
  store: string
  image: string
  total: string
  status: OrderStatus
  date: string
  size: string
  color: string
  quantity: number
  courier: string
}

const orders: Order[] = [
  {
    id: "UL-10284",
    product: "Air Force 1 '07",
    store: "Nike",
    image: "/nike/air-force-1.png",
    total: "US$156",
    status: "Esperando pago",
    date: "12 oct 2026",
    size: "9 US",
    color: "Blanco",
    quantity: 1,
    courier: "BM Cargo",
  },
  {
    id: "UL-10271",
    product: "Tabby Shoulder Bag 26",
    store: "Coach Outlet",
    image: "/coach/tabby-26.png",
    total: "US$338",
    status: "Recibido en Miami",
    date: "08 oct 2026",
    size: "Único",
    color: "Tan",
    quantity: 1,
    courier: "EPS",
  },
]

const statusStyles: Record<OrderStatus, string> = {
  "Cotización recibida": "bg-amber-50 text-amber-700",
  "Esperando pago": "bg-sky-50 text-sky-700",
  "Compra realizada": "bg-violet-50 text-violet-700",
  "Recibido en Miami": "bg-orange-50 text-orange-700",
  "Entregado al courier": "bg-indigo-50 text-indigo-700",
  Completado: "bg-emerald-50 text-emerald-700",
}

const statusIcon: Record<OrderStatus, typeof Clock3> = {
  "Cotización recibida": Clock3,
  "Esperando pago": Clock3,
  "Compra realizada": ShoppingBag,
  "Recibido en Miami": Package,
  "Entregado al courier": Truck,
  Completado: Check,
}

const progress = ["Cotizado", "Pagado", "Comprado", "Miami", "Courier", "Completado"]

function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return <div className="mb-3 flex items-center justify-between"><h2 className="text-[15px] font-black text-[#071b45]">{children}</h2>{action && <button type="button" className="text-xs font-bold text-[#2473b8]">{action}</button>}</div>
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  const Icon = statusIcon[order.status]
  return (
    <article className="rounded-2xl border border-[#e4ebf3] bg-white p-3 shadow-[0_6px_20px_rgba(7,27,69,0.05)]">
      <div className="flex gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f4f7fb]"><img src={order.image} alt="" className="size-full object-contain" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><div><h3 className="truncate text-sm font-black text-[#071b45]">{order.product}</h3><p className="mt-0.5 text-xs text-[#7d8898]">{order.store} · {order.id}</p></div><span className="shrink-0 text-sm font-black text-[#071b45]">{order.total}</span></div>
          <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${statusStyles[order.status]}`}><Icon className="size-3" aria-hidden="true" />{order.status}</div>
        </div>
      </div>
      <button type="button" onClick={onOpen} className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-[#f2f7fc] py-2.5 text-xs font-black text-[#2473b8]">Ver pedido <ChevronRight className="size-3.5" /></button>
    </article>
  )
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#071b45]/45 p-0 sm:items-center sm:p-4"><section role="dialog" aria-modal="true" aria-labelledby="order-detail-title" className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2473b8]">Detalle del pedido</p><h2 id="order-detail-title" className="mt-1 text-xl font-black text-[#071b45]">{order.id}</h2></div><button type="button" onClick={onClose} aria-label="Cerrar detalle" className="rounded-full bg-[#f2f5f8] p-2"><X className="size-5" /></button></div>
    <div className="flex gap-3 rounded-2xl bg-[#f7f9fc] p-3"><img src={order.image} alt="" className="size-20 rounded-xl object-contain" /><div><h3 className="font-black text-[#071b45]">{order.product}</h3><p className="mt-1 text-xs text-[#7d8898]">{order.store}</p><p className="mt-2 text-lg font-black text-[#071b45]">{order.total}</p></div></div>
    <div className="mt-5 rounded-2xl border border-[#e4ebf3] p-3"><div className="flex items-center justify-between text-xs font-bold text-[#071b45]"><span>Estado del pedido</span><span className="text-[#2473b8]">{order.status}</span></div><div className="mt-5 flex items-start justify-between">{progress.map((item, index) => <div key={item} className="relative flex w-1/6 flex-col items-center text-center"><div className={`z-10 flex size-5 items-center justify-center rounded-full ${index <= 3 ? "bg-[#2473b8] text-white" : "bg-[#e9eff5] text-[#9aa8b8]"}`}>{index <= 3 ? <Check className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}</div>{index < progress.length - 1 && <div className={`absolute left-1/2 top-2.5 h-0.5 w-full ${index < 3 ? "bg-[#2473b8]" : "bg-[#e9eff5]"}`} />}<span className="mt-2 text-[8px] leading-3 text-[#7d8898]">{item}</span></div>)}</div></div>
    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-xs"><Info label="Talla" value={order.size} /><Info label="Color" value={order.color} /><Info label="Cantidad" value={String(order.quantity)} /><Info label="Fecha de compra" value={order.date} /><Info label="Courier / casillero" value={order.courier} /><Info label="Método de pago" value="Tarjeta · Stripe" /></dl>
    <div className="mt-5 border-t border-[#e4ebf3] pt-4"><p className="text-xs font-bold text-[#071b45]">Costos incluidos</p><div className="mt-2 space-y-2 text-xs text-[#607087]"><div className="flex justify-between"><span>Producto</span><span>US$115</span></div><div className="flex justify-between"><span>Envío e impuestos</span><span>US$26</span></div><div className="flex justify-between font-black text-[#071b45]"><span>Total pagado</span><span>{order.total}</span></div></div></div>
    <button type="button" onClick={() => navigator.clipboard?.writeText(order.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#071b45] py-3 text-sm font-black text-white"><Copy className="size-4" />Copiar número de pedido</button>
  </section></div>
}

function Info({ label, value }: { label: string; value: string }) { return <div><dt className="text-[#8a98a9]">{label}</dt><dd className="mt-1 font-bold text-[#071b45]">{value}</dd></div> }

export default function CuentaPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [guest, setGuest] = useState(false)
  const [activeFilter, setActiveFilter] = useState("Todos")
  const filters = ["Todos", "Cotizaciones", "Pendientes", "En camino", "Completados"]
  const visibleOrders = activeFilter === "Todos" ? orders : orders.filter((order) => activeFilter === "Pendientes" ? order.status === "Esperando pago" : activeFilter === "En camino" ? ["Recibido en Miami", "Entregado al courier"].includes(order.status) : activeFilter === "Completados" ? order.status === "Completado" : order.status === "Cotización recibida")

  return <main className="min-h-screen bg-[#f7f9fc] pb-28 text-[#071b45]"><header className="mx-auto flex max-w-md items-center justify-between px-5 pb-3 pt-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2473b8]">USALINK</p><h1 className="mt-1 text-2xl font-black tracking-[-0.04em]">Mi UsaLink</h1></div><div className="flex items-center gap-2"><button type="button" aria-label="Notificaciones" className="rounded-full bg-white p-2.5 shadow-sm"><Bell className="size-5" /></button><button type="button" aria-label="Editar perfil" className="rounded-full bg-[#e8f4ff] p-2.5 text-[#2473b8]"><Pencil className="size-4" /></button></div></header>
    <div className="mx-auto max-w-md space-y-4 px-4">
      {guest ? <section className="rounded-3xl bg-[#071b45] p-5 text-white shadow-[0_10px_28px_rgba(7,27,69,0.18)]"><div className="flex items-start gap-3"><div className="rounded-2xl bg-white/10 p-3"><ShieldCheck className="size-6 text-[#8dd5ff]" /></div><div><h2 className="font-black">Tu compra está segura con UsaLink</h2><p className="mt-1 text-xs leading-5 text-white/70">Activa tu cuenta para guardar tus pedidos, cotizaciones y datos de courier.</p></div></div><button type="button" onClick={() => setGuest(false)} className="mt-4 w-full rounded-xl bg-[#2473b8] py-3 text-sm font-black text-white">Activar mi cuenta</button></section> : <section className="flex items-center gap-3 rounded-3xl border border-[#e4ebf3] bg-white p-4 shadow-[0_6px_20px_rgba(7,27,69,0.05)]"><div className="flex size-14 items-center justify-center rounded-full bg-[#e8f4ff] text-[#2473b8]"><UserRound className="size-7" /></div><div className="min-w-0 flex-1"><h2 className="font-black">María Rodríguez</h2><p className="truncate text-xs text-[#7d8898]">maria@ejemplo.com</p><p className="text-xs text-[#7d8898]">+1 856 562 2190</p></div><button type="button" className="rounded-xl bg-[#f2f7fc] px-3 py-2 text-[10px] font-black text-[#2473b8]">Editar perfil</button></section>}
      <section className="rounded-3xl bg-white p-4 shadow-[0_6px_20px_rgba(7,27,69,0.05)]"><SectionTitle>Mis compras</SectionTitle><div className="grid grid-cols-5 gap-1">{[["2","Cotiza", "Cotizaciones"],["1","Pago", "Pendientes"],["0","Compras", "Comprados"],["1","En camino", "En camino"],["0","Listas", "Completados"]].map(([count, label, filter]) => <button type="button" key={label} onClick={() => setActiveFilter(filter)} className={`rounded-2xl p-2 text-center transition ${activeFilter === filter ? "bg-[#e8f4ff]" : "hover:bg-[#f7f9fc]"}`}><span className="block text-lg font-black text-[#2473b8]">{count}</span><span className="text-[9px] font-bold leading-3 text-[#7d8898]">{label}</span></button>)}</div></section>
      <section><SectionTitle action="Ver todo">Mis pedidos</SectionTitle><div className="space-y-3">{visibleOrders.length ? visibleOrders.map((order) => <OrderCard key={order.id} order={order} onOpen={() => setSelectedOrder(order)} />) : <div className="rounded-2xl border border-dashed border-[#cfdbe8] bg-white p-6 text-center text-sm text-[#7d8898]">No tienes pedidos en esta categoría.</div>}</div></section>
      <section className="rounded-3xl border border-[#e4ebf3] bg-white p-4"><SectionTitle action="Ver historial">Mis cotizaciones</SectionTitle><div className="flex gap-3"><div className="flex size-12 items-center justify-center rounded-xl bg-[#fff4d8] text-xl">⌁</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-black">Air Force 1 '07 · Nike</p><p className="mt-1 text-xs text-[#7d8898]">US$156 · 12 oct 2026</p><span className="mt-2 inline-block rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">Válida por 48 horas</span></div><button type="button" className="self-center text-xs font-black text-[#2473b8]">Ver</button></div><button type="button" className="mt-4 w-full rounded-xl bg-[#071b45] py-3 text-xs font-black text-white">Comprar ahora</button></section>
      <section className="rounded-3xl border border-[#e4ebf3] bg-white p-4"><SectionTitle>Mi courier</SectionTitle><div className="rounded-2xl bg-[#f7f9fc] p-3"><div className="flex items-center gap-3"><div className="rounded-xl bg-[#e8f4ff] p-2 text-[#2473b8]"><Truck className="size-5" /></div><div className="flex-1"><p className="text-sm font-black">BM Cargo</p><p className="text-xs text-[#7d8898]">Titular: María Rodríguez</p><p className="text-xs text-[#7d8898]">Casillero: MR-8492</p></div><button type="button" aria-label="Editar courier" className="rounded-lg p-2 text-[#2473b8]"><Pencil className="size-4" /></button></div></div><button type="button" className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#a9c9e5] py-3 text-xs font-black text-[#2473b8]"><Plus className="size-4" />Agregar otro courier</button></section>
      <section className="grid grid-cols-2 gap-3"><MiniLink icon={<Heart className="size-4" />} label="Favoritos" /><MiniLink icon={<MessageCircle className="size-4" />} label="Ayuda y soporte" /><MiniLink icon={<LockKeyhole className="size-4" />} label="Seguridad" /><MiniLink icon={<MapPin className="size-4" />} label="Mis datos" /></section>
      <button type="button" onClick={() => setGuest(true)} className="mx-auto flex items-center gap-2 text-xs font-bold text-[#8a98a9]"><LogOut className="size-4" />Cerrar sesión</button>
    </div>
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e3e9f1] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_20px_rgba(7,27,69,0.08)] backdrop-blur"><div className="mx-auto flex max-w-md items-end justify-around px-3 pt-2"><NavItem href="/" icon={<Search className="size-5" />} label="Inicio" /><NavItem href="/tiendas" icon={<ShoppingBag className="size-5" />} label="Explorar" /><Link href="/" className="-mt-6 flex flex-col items-center gap-1"><span className="flex size-12 items-center justify-center rounded-full bg-[#2473b8] text-xs font-black text-white shadow-lg shadow-[#2473b8]/30">Cotizar</span></Link><NavItem href="/concepto#rastreo" icon={<Truck className="size-5" />} label="Pedidos" /><NavItem href="/cuenta" icon={<UserRound className="size-5" />} label="Cuenta" active /></div></nav>
    {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
  </main>
}

function MiniLink({ icon, label }: { icon: React.ReactNode; label: string }) { return <button type="button" className="flex items-center gap-2 rounded-2xl border border-[#e4ebf3] bg-white p-3 text-left text-xs font-black text-[#071b45]"><span className="text-[#2473b8]">{icon}</span>{label}<ChevronRight className="ml-auto size-4 text-[#a7b4c3]" /></button> }
function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) { return <Link href={href} className={`flex flex-col items-center gap-1 px-2 py-1 text-[10px] font-bold ${active ? "text-[#2473b8]" : "text-[#7d8898]"}`}>{icon}{label}</Link> }
