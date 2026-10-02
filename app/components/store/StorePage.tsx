'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ExternalLink, Home, Link2, MapPin, ShieldCheck, ShoppingBag, Sparkles, Truck, UserRound, X } from 'lucide-react'
import { formatUSD, modelUrl, toRD, type StoreConfig, type StoreModel } from './storeData'

import { cotizarHref } from '@/lib/quote'

const WHATSAPP = 'https://wa.me/18565622190?text='

export default function StorePage({ store }: { store: StoreConfig }) {
  const [filter, setFilter] = useState('Todos')
  const [link, setLink] = useState('')
  const [selected, setSelected] = useState<StoreModel | null>(null)
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [quantity, setQuantity] = useState(1)

  const models = filter === 'Todos' ? store.models : store.models.filter((m) => m.category === filter)

  const openQuote = (model: StoreModel) => {
    setSelected(model)
    setSize('')
    setColor('')
    setQuantity(1)
  }

  const sendModelQuote = () => {
    if (!selected) return
    if (store.sizeLabel && !size) {
      window.alert(`Elige tu ${store.sizeLabel.toLowerCase()}`)
      return
    }
    const lines = [
      `Hola USALINK, quiero cotizar en ${store.name}:`,
      `Modelo: ${selected.name}`,
      `Precio de referencia: ${formatUSD(selected.usd)}`,
      store.sizeLabel ? `${store.sizeLabel}: ${size}` : null,
      color ? `${store.colorLabel}: ${color}` : null,
      `Cantidad: ${quantity}`,
      `Ver en tienda: ${modelUrl(store, selected)}`,
    ].filter(Boolean)
    window.open(WHATSAPP + encodeURIComponent(lines.join('\n')), '_blank')
  }

  const sendLinkQuote = () => {
    if (!/^https?:\/\//.test(link.trim())) {
      window.alert('Pega un enlace válido que empiece con https://')
      return
    }
    window.location.assign(cotizarHref(link.trim(), store.name))
  }

  return (
    <div className="min-h-dvh bg-[#e9eef5] sm:py-6">
      <main className="relative mx-auto flex min-h-dvh max-w-[430px] flex-col bg-[#f5f8fc] pb-24 font-sans text-[#071b45] sm:min-h-[860px] sm:overflow-hidden sm:rounded-[2.5rem] sm:border-8 sm:border-[#071b45] sm:shadow-2xl">
        <header className="sticky top-0 z-20 flex items-center justify-between bg-[#f5f8fc]/95 px-4 py-3 backdrop-blur">
          <Link href="/" aria-label="Volver al inicio" className="flex size-9 items-center justify-center rounded-full bg-[#ffffff] shadow-sm">
            <ChevronLeft className="size-5" />
          </Link>
          <p className="text-sm font-bold">{store.name}</p>
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir la web oficial de ${store.name}`}
            className="flex size-9 items-center justify-center rounded-full bg-[#ffffff] shadow-sm"
          >
            <ExternalLink className="size-4" />
          </a>
        </header>

        <section className="px-4">
          <div className="relative h-44 overflow-hidden rounded-3xl bg-[#071b45]">
            {store.facade ? (
              <img src={store.facade} alt={`Entrada de ${store.name}`} className="size-full object-cover" />
            ) : (
              <div className="flex h-full items-start justify-end gap-2 p-3">
                {store.models.slice(0, 3).map((model) => (
                  <img key={model.id} src={model.image} alt="" className="h-24 w-20 rounded-2xl bg-[#ffffff] object-contain p-2" />
                ))}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071b45] via-[#071b45]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-[#ffffff]">
              <span className="w-fit rounded-full bg-[#ffffff]/20 px-2 py-0.5 text-[11px] font-semibold backdrop-blur">Tienda oficial USA</span>
              <h1 className="text-2xl font-extrabold leading-tight text-balance">{store.name}</h1>
              <p className="text-sm text-[#d6e4f5]">{store.tagline}</p>
            </div>
          </div>
          <ul className="mt-3 flex justify-between gap-2 text-[11px] font-medium text-[#5a6b85]">
            <li className="flex items-center gap-1"><ShieldCheck className="size-3.5 text-[#2473b8]" />100% original</li>
            <li className="flex items-center gap-1"><Truck className="size-3.5 text-[#2473b8]" />Envío a RD</li>
            <li className="flex items-center gap-1"><ShoppingBag className="size-3.5 text-[#2473b8]" />Compramos por ti</li>
          </ul>
        </section>

        <nav aria-label="Filtrar modelos" className="mt-5 flex gap-2 overflow-x-auto px-4 pb-1">
          {store.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === cat ? 'bg-[#071b45] text-[#ffffff]' : 'bg-[#ffffff] text-[#5a6b85] shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <section aria-labelledby="modelos" className="mt-4 px-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="modelos" className="text-base font-bold">Modelos populares</h2>
            <span className="text-xs text-[#8b98aa]">{models.length} modelos</span>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {models.map((model) => (
              <li key={model.id} className="flex flex-col overflow-hidden rounded-2xl bg-[#ffffff] shadow-[0_2px_12px_rgba(7,27,69,0.06)]">
                <div className="aspect-square bg-[#f7f9fb] p-3">
                  <img src={model.image} alt={model.name} className="size-full object-contain" />
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">{model.name}</p>
                  <p className="text-xs text-[#8b98aa]">{formatUSD(model.usd)}</p>
                  <p className="text-base font-extrabold text-[#2473b8]">{toRD(model.usd)}</p>
                  <button
                    type="button"
                    onClick={() => openQuote(model)}
                    className="mt-auto rounded-xl bg-[#071b45] py-2 text-sm font-semibold text-[#ffffff]"
                  >
                    Cotizar
                  </button>
                  <a
                    href={modelUrl(store, model)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1 text-xs font-medium text-[#2473b8]"
                  >
                    {`Ver en ${store.name}`}
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-[#8b98aa]">Precios en RD$ aproximados. La cotización final llega por WhatsApp.</p>
        </section>

        <section className="mx-4 mt-6 flex flex-col gap-3 rounded-3xl bg-[#071b45] p-4 text-[#ffffff]">
          <div>
            <h2 className="text-base font-bold text-balance">{`¿No ves tu modelo? Pega el link de ${store.name}`}</h2>
            <p className="text-sm text-[#b9c8dc]">Cualquier producto de la tienda, nosotros lo compramos.</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-[#ffffff] p-1.5">
            <Link2 className="ml-2 size-4 shrink-0 text-[#8b98aa]" />
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              aria-label={`Enlace del producto de ${store.name}`}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#071b45] outline-none placeholder:text-[#8b98aa]"
            />
            <button type="button" onClick={sendLinkQuote} className="shrink-0 rounded-xl bg-[#2473b8] px-3 py-2 text-sm font-semibold text-[#ffffff]">
              Cotizar
            </button>
          </div>
        </section>

        <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[430px] items-end justify-around border-t border-[#e3e9f1] bg-[#ffffff] px-2 pb-3 pt-2 text-[11px] text-[#8b98aa] sm:absolute">
          <Link href="/" className="flex flex-col items-center gap-0.5"><Home className="size-5" />Inicio</Link>
          <Link href="/tiendas" className="flex flex-col items-center gap-0.5 text-[#071b45]"><ShoppingBag className="size-5" />Tiendas</Link>
          <Link href="/concepto" className="-mt-6 flex flex-col items-center gap-0.5 text-[#8b5cf6]">
            <span className="flex size-12 items-center justify-center rounded-full bg-[#8b5cf6] text-[#ffffff] shadow-[0_6px_18px_rgba(139,92,246,0.45)]"><Sparkles className="size-5" /></span>
            Afrodita
          </Link>
          <Link href="/concepto#rastreo" className="flex flex-col items-center gap-0.5"><MapPin className="size-5" />Rastreo</Link>
          <span className="flex flex-col items-center gap-0.5"><UserRound className="size-5" />Cuenta</span>
        </nav>

        {selected && (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#071b45]/50 sm:absolute" onClick={() => setSelected(null)}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quote-title"
              className="flex w-full max-w-[430px] flex-col gap-4 rounded-t-3xl bg-[#ffffff] p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <img src={selected.image} alt="" className="size-16 rounded-xl bg-[#f7f9fb] object-contain p-1" />
                <div className="flex-1">
                  <p id="quote-title" className="font-bold">{selected.name}</p>
                  <p className="text-sm font-extrabold text-[#2473b8]">{toRD(selected.usd)} <span className="font-normal text-[#8b98aa]">· {formatUSD(selected.usd)}</span></p>
                </div>
                <button type="button" onClick={() => setSelected(null)} aria-label="Cerrar" className="flex size-8 items-center justify-center rounded-full bg-[#f5f8fc]">
                  <X className="size-4" />
                </button>
              </div>

              {store.sizeLabel && (
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-semibold">{store.sizeLabel}</legend>
                  <div className="flex flex-wrap gap-2">
                    {store.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={`h-10 min-w-10 rounded-xl px-2 text-sm font-semibold ${size === s ? 'bg-[#071b45] text-[#ffffff]' : 'bg-[#f5f8fc] text-[#071b45]'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="flex gap-3">
                <label className="flex flex-1 flex-col gap-1 text-sm font-semibold">
                  {store.colorLabel}
                  <input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ej: negro"
                    className="rounded-xl bg-[#f5f8fc] px-3 py-2.5 font-normal outline-none placeholder:text-[#8b98aa]"
                  />
                </label>
                <div className="flex flex-col gap-1 text-sm font-semibold">
                  <span>Cantidad</span>
                  <div className="flex items-center gap-2 rounded-xl bg-[#f5f8fc] p-1">
                    <button type="button" aria-label="Menos" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="size-8 rounded-lg bg-[#ffffff]">-</button>
                    <span className="w-5 text-center">{quantity}</span>
                    <button type="button" aria-label="Más" onClick={() => setQuantity((q) => Math.min(5, q + 1))} className="size-8 rounded-lg bg-[#ffffff]">+</button>
                  </div>
                </div>
              </div>

              <button type="button" onClick={sendModelQuote} className="rounded-2xl bg-[#2473b8] py-3.5 font-bold text-[#ffffff]">
                Pedir cotización por WhatsApp
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
