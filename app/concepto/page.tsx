import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import QuoteLabel from '../components/concepto/QuoteLabel'
import { HowItWorks, StoreTags, TrackingPreview } from '../components/concepto/Sections'

export default function ConceptoPage() {
  return (
    <main>
      <header className="flex items-center justify-between border-b-2 border-ink px-5 py-4 md:px-10">
        <Link href="/concepto" className="flex items-center gap-2 text-2xl font-black tracking-tighter">
          <span aria-hidden="true" className="h-5 w-8 -rotate-6 bg-tape" />
          USALINK
        </Link>
        <a
          href="https://wa.me/18565622190"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-2 border-ink px-3 py-2 text-sm font-bold transition-colors hover:bg-tape"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          WhatsApp
        </a>
      </header>

      <section className="px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-5">
            <span className="w-fit bg-tape px-2 py-1 font-label text-xs font-semibold">MIAMI → SANTO DOMINGO</span>
            <h1 className="text-5xl font-black leading-none tracking-tighter text-balance md:text-6xl">
              Lo que ves en USA, en tu puerta en RD.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-fog text-pretty">
              Pega el link, mira el total en pesos antes de pagar y nosotros hacemos la compra, el envío y la aduana.
            </p>
            <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink">
              <Image
                src="/concepto/caja-usalink.png"
                alt="Cajas de envío con cinta amarilla en la puerta de una casa en República Dominicana"
                fill
                priority
                sizes="(min-width: 768px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <QuoteLabel />
        </div>
      </section>

      <StoreTags />
      <HowItWorks />
      <TrackingPreview />

      <footer className="flex flex-col gap-2 border-t-2 border-ink px-5 py-8 font-label text-xs text-fog md:flex-row md:justify-between md:px-10">
        <span>USALINK · Compras USA → República Dominicana</span>
        <span>Total estimado con tasa RD$61 por dólar. Envío local se confirma aparte.</span>
      </footer>
    </main>
  )
}
