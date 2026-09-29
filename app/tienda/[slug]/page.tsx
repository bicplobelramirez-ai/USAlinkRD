import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { findItem } from "@/app/components/hub/hubData"
import { BottomNav } from "@/app/components/hub/BottomNav"
import { LinkOnlyQuote } from "@/app/components/hub/LinkOnlyQuote"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const found = findItem((await params).slug)
  return { title: found ? `Cotizar ${found.item.brand} ${found.item.model} | USALINK` : "Cotizar por link | USALINK" }
}

export default async function TiendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ url?: string }>
}) {
  const found = findItem((await params).slug)
  const initialUrl = (await searchParams).url ?? ""
  const productName = found ? `${found.item.brand} ${found.item.model}` : undefined

  return (
    <div className="min-h-dvh bg-background pb-20 text-hub-navy">
      <header className="flex items-center gap-1 border-b border-hub-navy/10 px-3 py-2">
        <Link
          href={found ? `/hub/${found.hub.id}` : "/hub"}
          aria-label="Volver"
          className="flex size-9 items-center justify-center rounded-full hover:bg-hub-navy/5"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
        <p className="truncate text-sm font-bold">
          {found?.hub.name ?? "Cotizar"} <span className="font-medium text-hub-navy/50">/ USALINK</span>
        </p>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 pt-5">
        {found?.item.image && (
          <img
            src={found.item.image}
            alt={productName}
            className="aspect-square w-full max-w-xs self-center rounded-2xl object-cover shadow-[0_4px_16px_rgba(7,27,69,0.08)]"
          />
        )}
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-balance">
            {productName ?? "Cotiza cualquier producto de USA"}
          </h1>
          <p className="text-sm leading-relaxed text-hub-navy/70 text-pretty">
            Busca este producto en la tienda oficial, copia el link y pégalo aquí. Te respondemos por WhatsApp con el precio final puesto en RD.
          </p>
        </div>
        <LinkOnlyQuote productName={productName} initialUrl={initialUrl} />
      </main>
      <BottomNav />
    </div>
  )
}
