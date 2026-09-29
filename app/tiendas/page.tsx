import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, LayoutGrid } from "lucide-react"
import { BottomNav } from "@/app/components/hub/BottomNav"
import { StorefrontCard } from "@/app/components/storefronts/StorefrontCard"
import { storefronts } from "@/app/components/storefronts/storefrontData"

export const metadata: Metadata = {
  title: "Tiendas USA | USALINK",
  description: "Entra a tus tiendas favoritas de USA y cotiza el envío a República Dominicana.",
}

export default function TiendasPage() {
  return (
    <div className="min-h-dvh bg-background pb-20 text-hub-navy">
      <header className="flex items-center gap-1 border-b border-hub-navy/10 px-3 py-2">
        <Link href="/" aria-label="Volver al inicio" className="flex size-9 items-center justify-center rounded-full hover:bg-hub-navy/5">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
        <p className="text-sm font-bold">
          Tiendas <span className="font-medium text-hub-navy/50">/ USALINK</span>
        </p>
      </header>

      <main className="mx-auto flex max-w-xl flex-col gap-5 px-4 pt-5">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-extrabold leading-tight text-balance">Tiendas USA</h1>
          <p className="text-sm leading-relaxed text-hub-navy/70 text-pretty">
            Entra a la tienda, escoge lo que te gusta y te lo llevamos a RD.
          </p>
        </div>

        <Link
          href="/hub"
          className="flex items-center gap-2 self-start rounded-full bg-hub-navy/5 px-4 py-2 text-sm font-semibold hover:bg-hub-navy/10"
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          Ver por categoría
        </Link>

        <ul className="grid grid-cols-2 gap-3">
          {storefronts.map((store) => (
            <li key={store.file}>
              <StorefrontCard store={store} />
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  )
}
