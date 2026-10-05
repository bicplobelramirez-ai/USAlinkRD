"use client"

import { AlertCircle, Bookmark, Check, ChevronDown, Loader2, MessageCircle, ShieldCheck, ShoppingBag, Truck } from "lucide-react"
import type { QuoteDiscount, VerifiedQuote } from "@/lib/quote-agent"

const money = (value: number) => `$${value.toFixed(2)}`
const card = "rounded-3xl border border-[#dce5ef] bg-white shadow-[0_8px_24px_rgba(16,33,63,0.06)]"
const availabilityLabel = { available: "Disponible", limited: "Pocas unidades", unavailable: "No disponible" }

export interface Selection {
  size: string
  color: string
  quantity: number
}

export function AnalyzingSteps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <section aria-live="polite" className={`mt-7 p-5 ${card}`}>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          return (
            <li key={step} className={`flex items-center gap-3 text-sm transition-opacity ${index > current ? "opacity-35" : "opacity-100"}`}>
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-[#e9f8f0] text-[#15915a]" : active ? "bg-[#e8f4ff] text-[#2473b8]" : "bg-[#f0f4f9] text-[#94a3b8]"}`}>
                {done ? <Check size={13} /> : active ? <Loader2 size={13} className="animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
              </span>
              <span className={active ? "font-bold" : "text-[#64748b]"}>{step}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function OptionSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative flex min-w-0 items-center justify-between gap-1 rounded-xl border border-[#dce5ef] px-2.5 py-2">
      <span className="min-w-0">
        <span className="block text-[9px] font-bold uppercase text-[#94a3b8]">{label}</span>
        <span className="mt-1 block truncate text-[11px] font-black">{value || "Elegir"}</span>
      </span>
      <ChevronDown size={13} className="shrink-0 text-[#94a3b8]" />
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} className="absolute inset-0 cursor-pointer opacity-0">
        <option value="">Elegir</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

export function ProductCard({ quote, selection, maxQuantity, onChange }: { quote: VerifiedQuote; selection: Selection; maxQuantity: number; onChange: (selection: Selection) => void }) {
  const available = quote.availability !== "unavailable"
  return (
    <section className="mt-7">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">Producto detectado</h2>
        <span className={`flex items-center gap-1 text-xs font-bold ${available ? "text-[#15915a]" : "text-[#c2410c]"}`}>
          {available ? <Check size={15} /> : <AlertCircle size={15} />} {availabilityLabel[quote.availability]}
        </span>
      </div>
      <div className={`overflow-hidden ${card}`}>
        {quote.productImage && (
          <div className="relative flex h-56 items-center justify-center overflow-hidden bg-[#eef4f8] p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={quote.productImage} alt={quote.productName} className="size-full object-contain mix-blend-multiply" referrerPolicy="no-referrer" />
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#2473b8]">{quote.storeName}</span>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-xl font-black tracking-tight text-pretty">{quote.productName}</h3>
              <p className="mt-1 text-sm text-[#64748b]">{quote.storeName} · {quote.originalPrice > quote.currentPrice ? "Precio original" : "Precio"}</p>
            </div>
            <span className="text-lg font-black">{money(quote.originalPrice)}</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {quote.sizes.length > 0 ? <OptionSelect label="Talla" value={selection.size} options={quote.sizes} onChange={(size) => onChange({ ...selection, size })} /> : <div />}
            {quote.colors.length > 0 ? <OptionSelect label="Color" value={selection.color} options={quote.colors} onChange={(color) => onChange({ ...selection, color })} /> : <div />}
            <OptionSelect label="Cantidad" value={String(selection.quantity)} options={Array.from({ length: maxQuantity }, (_, index) => String(index + 1))} onChange={(quantity) => onChange({ ...selection, quantity: Number(quantity) || 1 })} />
          </div>
        </div>
      </div>
    </section>
  )
}

function discountLabel(discount: QuoteDiscount) {
  return discount.percent ? `${discount.label} — ${discount.percent}%` : discount.label
}

export function DiscountsCard({ quote }: { quote: VerifiedQuote }) {
  const storeDiscounts = quote.verifiedDiscounts.filter((discount) => !discount.code)
  const promoDiscounts = quote.verifiedDiscounts.filter((discount) => discount.code)
  if (storeDiscounts.length + promoDiscounts.length === 0) return null
  const subtotal = quote.originalPrice - storeDiscounts.reduce((sum, discount) => sum + discount.amount, 0)

  return (
    <section className={`mt-5 p-5 ${card}`}>
      <h2 className="text-lg font-black tracking-tight">Descuentos aplicados</h2>
      <div className="mt-4 flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-[#94a3b8]"><span>Precio original</span><span className="line-through">{money(quote.originalPrice)}</span></div>
        {storeDiscounts.map((discount) => <div key={discount.label} className="flex justify-between gap-3"><span>{discountLabel(discount)}</span><span className="font-bold text-[#15915a]">−{money(discount.amount)}</span></div>)}
        {storeDiscounts.length > 0 && promoDiscounts.length > 0 && <div className="flex justify-between border-b border-[#edf1f5] pb-3 font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div>}
        {promoDiscounts.map((discount) => <div key={discount.code} className="flex justify-between gap-3"><span>{discountLabel(discount)}</span><span className="font-bold text-[#15915a]">−{money(discount.amount)}</span></div>)}
      </div>
      {promoDiscounts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {promoDiscounts.map((discount) => <span key={discount.code} className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f8f0] px-3 py-1.5 text-[11px] font-black text-[#15915a]"><Check size={13} /> {discount.code} aplicado</span>)}
        </div>
      )}
      <div className="mt-5 flex items-end justify-between border-t border-[#edf1f5] pt-4"><span className="text-sm font-bold">Precio después de descuentos</span><span className="text-2xl font-black text-[#2473b8]">{money(quote.currentPrice)}</span></div>
    </section>
  )
}

export function SavingsCard({ quote }: { quote: VerifiedQuote }) {
  if (quote.savingsAmount <= 0) return null
  const percent = Math.min(100, Math.max(0, quote.savingsPercentage))
  return (
    <section className="relative mt-5 overflow-hidden rounded-3xl bg-[#10213f] p-6 text-white shadow-[0_12px_30px_rgba(16,33,63,0.2)]">
      <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#2473b8]/40 blur-2xl" />
      <p className="relative text-sm font-bold text-[#8dd5ff]">🎉 Estás ahorrando</p>
      <p className="relative mt-2 text-5xl font-black tracking-[-0.06em]">{money(quote.savingsAmount)}</p>
      <p className="relative mt-2 text-sm text-white/70">{`${percent.toLocaleString("es-DO", { maximumFractionDigits: 1 })}% menos que el precio original`}</p>
      <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#55d187]" style={{ width: `${percent}%` }} /></div>
    </section>
  )
}

export function QuoteSummary({ quote }: { quote: VerifiedQuote }) {
  const rows: [string, number][] = [
    ["Producto después de descuentos", quote.currentPrice],
    ["Envío dentro de USA", quote.usaShipping],
    ["Sales tax", quote.salesTax],
    ["Fee UsaLink", quote.usaLinkFee],
  ]
  return (
    <section className={`mt-5 p-5 ${card}`}>
      <h2 className="text-lg font-black tracking-tight">Tu cotización UsaLink</h2>
      <div className="mt-4 flex flex-col gap-3 text-sm">{rows.map(([label, value]) => <div key={label} className="flex justify-between"><span>{label}</span><span>{money(value)}</span></div>)}</div>
      <div className="mt-5 flex items-end justify-between border-t border-[#dce5ef] pt-4"><span className="text-base font-black">Total a pagar</span><span className="text-3xl font-black tracking-[-0.05em] text-[#2473b8]">{money(quote.finalTotal)}</span></div>
      <p className="mt-4 text-[11px] leading-5 text-[#94a3b8]">El envío internacional de tu courier no está incluido. Se paga directamente al courier.</p>
    </section>
  )
}

export function QuoteActions({ canBuy, saved, buyNote, onBuy, onSave, whatsappHref }: { canBuy: boolean; saved: boolean; buyNote: string | null; onBuy: () => void; onSave: () => void; whatsappHref: string }) {
  return (
    <section className="mt-5">
      <button type="button" disabled={!canBuy} onClick={onBuy} className="w-full rounded-2xl bg-[#2473b8] py-4 text-base font-black text-white shadow-[0_10px_22px_rgba(36,115,184,0.25)] transition-transform active:scale-[0.98] disabled:opacity-50">Comprar ahora</button>
      <p aria-live="polite" className="mt-3 text-center text-[11px] leading-5 text-[#94a3b8]">{buyNote ?? "Antes de cobrarte verificaremos nuevamente precio, disponibilidad, talla, color y descuentos."}</p>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button type="button" onClick={onSave} className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-[#64748b] hover:bg-white"><Bookmark size={15} fill={saved ? "currentColor" : "none"} /> {saved ? "Cotización guardada" : "Guardar cotización"}</button>
      </div>
      <WhatsAppHelp href={whatsappHref} />
    </section>
  )
}

export function WhatsAppHelp({ href }: { href: string }) {
  return (
    <p className="mt-2 text-center text-xs text-[#64748b]">
      ¿Prefieres ayuda?{" "}
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-[#15915a]"><MessageCircle size={14} /> Cotizar por WhatsApp</a>
    </p>
  )
}

export function UnverifiedCard({ reviewHref, whatsappHref }: { reviewHref: string; whatsappHref: string }) {
  return (
    <section aria-live="polite" className={`mt-7 p-5 ${card}`}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4e5] text-[#c2410c]"><AlertCircle size={20} /></span>
        <p className="text-sm font-bold leading-6 text-pretty">No pudimos verificar automáticamente toda la información de este producto.</p>
      </div>
      <div className="mt-5 flex flex-col gap-2">
        <a href={reviewHref} target="_blank" rel="noopener noreferrer" className="w-full rounded-2xl bg-[#2473b8] py-3.5 text-center text-sm font-black text-white">Solicitar revisión</a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#dce5ef] bg-white py-3.5 text-sm font-black text-[#15915a]"><MessageCircle size={16} /> Continuar por WhatsApp</a>
      </div>
    </section>
  )
}

export function TrustRow() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#e4eaf2] pt-5 text-center text-[10px] font-bold text-[#64748b]">
      <div><ShieldCheck size={20} className="mx-auto mb-1 text-[#2473b8]" />Compra segura</div>
      <div><ShoppingBag size={20} className="mx-auto mb-1 text-[#2473b8]" />Precio claro</div>
      <div><Truck size={20} className="mx-auto mb-1 text-[#2473b8]" />Entrega en RD</div>
    </div>
  )
}
