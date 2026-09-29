"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import type { Storefront } from "./storefrontData"

export function StorefrontCard({ store }: { store: Storefront }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [hasPhoto, setHasPhoto] = useState(true)

  useEffect(() => {
    const img = imgRef.current
    if (img?.complete && img.naturalWidth === 0) setHasPhoto(false)
  }, [])

  return (
    <Link
      href={store.href}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(7,27,69,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hub-pink"
      style={{ backgroundColor: store.color }}
    >
      {hasPhoto ? (
        <img
          ref={imgRef}
          src={`/storefronts/${store.file}`}
          alt={`Entrada de la tienda ${store.name}`}
          loading="lazy"
          onError={() => setHasPhoto(false)}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/3 px-3 text-center font-display text-2xl font-extrabold leading-tight text-balance"
          style={{ color: store.textColor }}
        >
          {store.name}
        </span>
      )}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-hub-navy/90 to-transparent" />
      <span className="relative flex items-end justify-between gap-2 p-3 text-background">
        <span className="flex flex-col">
          <span className="text-sm font-bold leading-tight">{store.name}</span>
          <span className="text-xs leading-relaxed text-background/75">{store.tagline}</span>
        </span>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-hub-pink">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </span>
    </Link>
  )
}
