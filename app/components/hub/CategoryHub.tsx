"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Bell, ChevronLeft, Mic, Search } from "lucide-react"
import type { Hub, HubItem } from "./hubData"
import { BottomNav } from "./BottomNav"

const surfaceClass: Record<Hub["surface"], string> = {
  plain: "bg-background",
  sky: "bg-hub-sky",
  blush: "bg-hub-blush",
}

export function CategoryHub({ hub }: { hub: Hub }) {
  const [filter, setFilter] = useState("Todos")
  const [query, setQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const visibleItems = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return hub.items.filter((entry) => {
      const text = `${entry.brand} ${entry.model}`.toLowerCase()
      const matchesFilter = filter === "Todos" || entry.category === filter
      const matchesQuery = words.every((word) => text.includes(word))
      return matchesFilter && matchesQuery
    })
  }, [hub.items, filter, query])

  return (
    <div className={`min-h-dvh pb-20 text-hub-navy ${surfaceClass[hub.surface]}`}>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-hub-navy/10 bg-background/95 px-3 py-2 backdrop-blur">
        <div className="flex min-w-0 items-center gap-1">
          <Link href="/hub" aria-label="Volver a categorías" className="flex size-9 items-center justify-center rounded-full hover:bg-hub-navy/5">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </Link>
          <p className="truncate text-sm font-bold">
            {hub.name} <span className="font-medium text-hub-navy/50">/ USALINK</span>
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => searchRef.current?.focus()}
            className="flex size-9 items-center justify-center rounded-full hover:bg-hub-navy/5"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
          <Link href="/concepto#rastreo" aria-label="Avisos de tu pedido" className="flex size-9 items-center justify-center rounded-full hover:bg-hub-navy/5">
            <Bell className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 pt-5">
        <section className="flex flex-col gap-3" aria-labelledby="hub-title">
          <div className="flex flex-col gap-1">
            <h1 id="hub-title" className="font-display text-2xl font-extrabold leading-tight text-balance">
              {hub.title}
            </h1>
            <p className="text-sm leading-relaxed text-hub-navy/70 text-pretty">{hub.subtitle}</p>
          </div>
          <label className="flex items-center gap-2 rounded-full border border-hub-navy/15 bg-background px-4 py-3 shadow-sm focus-within:border-hub-pink">
            <Search className="size-4 shrink-0 text-hub-navy/50" aria-hidden="true" />
            <span className="sr-only">Buscar en {hub.name}</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={hub.searchPlaceholder}
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-hub-navy/40"
            />
          </label>
        </section>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtrar por categoría">
          {hub.filters.map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                filter === name ? "bg-hub-pink text-background" : "bg-hub-navy/5 text-hub-navy/70 hover:bg-hub-navy/10"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-hub-pink">Trending ahora</p>
          <div className="flex flex-wrap gap-2">
            {hub.trending.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setFilter("Todos")
                  setQuery(name)
                }}
                className="rounded-full border border-hub-pink/30 bg-background px-3 py-1.5 text-xs font-semibold hover:border-hub-pink"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {visibleItems.length > 0 ? (
          <ul className="grid grid-cols-2 gap-3">
            {visibleItems.map((entry) => (
              <li key={entry.slug}>
                <ProductCard entry={entry} badge={entry.badge ?? hub.badge} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-background p-5 text-center text-sm leading-relaxed text-hub-navy/70">
            {`No tenemos "${query}" en vitrina. Pega el link abajo y te lo cotizamos igual.`}
          </p>
        )}
      </main>

      <LinkQuoteBlock missingWord={hub.missingWord} />
      <BottomNav />
    </div>
  )
}

function ProductCard({ entry, badge }: { entry: HubItem; badge: string }) {
  const isPodcast = badge === "Kit Podcast"
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-background shadow-[0_4px_16px_rgba(7,27,69,0.08)]">
      <div className="relative aspect-square bg-hub-navy/5">
        {entry.image ? (
          <img src={entry.image} alt={`${entry.brand} ${entry.model}`} className="size-full object-cover" loading="lazy" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-1 p-3 text-center" aria-hidden="true">
            <span className="font-display text-lg font-extrabold leading-tight text-hub-navy text-balance">{entry.brand}</span>
            <span className="text-xs leading-snug text-hub-navy/60 text-balance">{entry.model}</span>
          </div>
        )}
        <span
          className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
            isPodcast ? "bg-hub-pink text-background" : "bg-background/90 text-hub-navy"
          }`}
        >
          {isPodcast && <Mic className="size-3" aria-hidden="true" />}
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-3 p-3">
        <h2 className="text-sm font-semibold leading-snug text-pretty">
          {entry.brand} {entry.model}
        </h2>
        <Link
          href={`/tienda/${entry.slug}`}
          className="flex items-center justify-center gap-1 rounded-full bg-hub-pink py-2 text-sm font-bold text-background hover:opacity-90"
        >
          Cotizar <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">
            {entry.brand} {entry.model}
          </span>
        </Link>
      </div>
    </article>
  )
}

function LinkQuoteBlock({ missingWord }: { missingWord: string }) {
  const router = useRouter()
  const [link, setLink] = useState("")

  return (
    <section className="mt-8 rounded-t-3xl bg-hub-navy px-4 py-8 text-background" aria-labelledby="link-quote-title">
      <form
        className="mx-auto flex max-w-xl flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          if (!link.trim()) return
          router.push(`/tienda/link?url=${encodeURIComponent(link.trim())}`)
        }}
      >
        <h2 id="link-quote-title" className="font-display text-lg font-extrabold leading-snug text-balance">
          {`¿No encuentras tu ${missingWord}? Pega el link de USA`}
        </h2>
        <label className="sr-only" htmlFor="hub-link">
          Link del producto
        </label>
        <div className="flex gap-2">
          <input
            id="hub-link"
            type="url"
            required
            inputMode="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://..."
            className="w-full min-w-0 rounded-full bg-background px-4 py-3 text-sm text-hub-navy outline-none placeholder:text-hub-navy/40"
          />
          <button type="submit" className="shrink-0 rounded-full bg-hub-pink px-4 py-3 text-sm font-bold text-background hover:opacity-90">
            Cotizar
          </button>
        </div>
      </form>
    </section>
  )
}
