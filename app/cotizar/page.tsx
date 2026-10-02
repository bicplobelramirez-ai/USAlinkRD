"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import useSWR from "swr"
import QuoteCheckout from "@/app/components/QuoteCheckout"
import { isValidProductUrl } from "@/lib/quote"
import type { QuoteResult } from "@/lib/scrape"

const WHATSAPP = "https://wa.me/18565622190?text="

const fetcher = (path: string) => fetch(path).then((res) => res.json() as Promise<QuoteResult>)

const usd = (value: number) =>
  `US$${value.toLocaleString("en-US", { minimumFractionDigits: value % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

export default function CotizarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CotizarContent />
    </Suspense>
  )
}

function CotizarContent() {
  const params = useSearchParams()
  const router = useRouter()
  const url = params.get("url") || ""
  const store = params.get("store") || "tienda"
  const validUrl = isValidProductUrl(url)

  const { data, error } = useSWR(validUrl ? `/api/scrape?url=${encodeURIComponent(url)}` : null, fetcher, {
    revalidateOnFocus: false,
  })

  const [progress, setProgress] = useState(10)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => Math.min(currentProgress + 15, 100))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  const loading = validUrl && !data && !error
  const analyzing = progress < 100 || loading

  if (analyzing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 text-black">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8 animate-spin text-5xl">⚙️</div>
          <h1 className="text-2xl font-black">Analizando tu<br />link de {store}...</h1>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full bg-black transition-all duration-500 ${progress >= 100 ? "animate-pulse" : ""}`}
              style={{ width: `${Math.min(progress, 95)}%` }}
            />
          </div>

          <p className="mt-6 text-sm text-neutral-500">Estamos obteniendo precio,<br />impuestos y envío...</p>
          <p className="mt-8 text-xs text-neutral-400">Esto puede demorar unos segundos</p>
          <p className="mt-20 text-[10px] text-neutral-300">USALINK • Cotiza en segundos</p>
        </div>
      </div>
    )
  }

  const header = (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
      <button type="button" onClick={() => router.back()} aria-label="Volver">‹</button>
      <div className="font-bold">Cotización</div>
      <button
        type="button"
        className="text-sm"
        aria-label="Compartir"
        onClick={() => navigator.share?.({ title: "Mi cotización USALINK", url: window.location.href })}
      >
        ↗
      </button>
    </div>
  )

  const whatsappHref =
    WHATSAPP + encodeURIComponent(`Hola USALINK, quiero cotizar este producto de ${store}:\n${url}`)

  if (!validUrl || error || !data || !data.found) {
    const reason = !validUrl
      ? "Pega un enlace válido del producto (https://...)."
      : (data && !data.found && data.reason) || "No pudimos leer el producto."
    const product = data?.product ?? null

    return (
      <div className="min-h-screen bg-white pb-32 text-black">
        {header}
        <div className="mx-auto max-w-md p-4">
          {product && (
            <div className="mt-4 flex gap-4 rounded-2xl bg-neutral-50 p-4">
              <ProductThumb image={product.image} name={product.name} />
              <div className="min-w-0">
                <div className="font-bold">{product.name}</div>
                <div className="mt-1 truncate text-[11px] text-neutral-400">{url}</div>
              </div>
            </div>
          )}
          <div className="mt-6 rounded-2xl border p-5 text-center">
            <div className="text-3xl">💬</div>
            <h1 className="mt-3 text-lg font-black text-balance">Te cotizamos manualmente</h1>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">{reason} Un asesor te envía el precio final por WhatsApp en minutos.</p>
            {validUrl && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white"
              >
                Cotizar por WhatsApp
              </a>
            )}
            <button type="button" onClick={() => router.push("/")} className="mt-3 w-full rounded-xl bg-neutral-100 py-3 text-sm">
              Probar otro link
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { product, quote } = data

  return (
    <div className="min-h-screen bg-white pb-32 text-black">
      {header}

      <div className="mx-auto max-w-md p-4">
        <div className="mt-4 flex gap-4 rounded-2xl bg-neutral-50 p-4">
          <ProductThumb image={product.image} name={product.name} />
          <div className="min-w-0">
            <div className="line-clamp-2 font-bold">{product.name}</div>
            <div className="text-sm text-neutral-600">{usd(quote.price)}</div>
            <div className="mt-1 truncate text-[11px] text-neutral-400">{url}</div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold">Desglose</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Precio producto</span><span>{usd(quote.price)}</span></div>
            <div className="flex justify-between"><span>Impuestos USA</span><span>{usd(quote.tax)}</span></div>
            <div className="flex justify-between"><span>Envío USA a Miami</span><span>{usd(quote.shipUSA)}</span></div>
            <div className="flex justify-between"><span>Servicio USALINK</span><span>{usd(quote.service)}</span></div>
            <div className="flex justify-between"><span>Envío Miami a RD</span><span>{usd(quote.shipRD)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total:</span>
            <div className="text-right">
              <div>{usd(quote.total)}</div>
              <div className="text-xs font-normal text-neutral-500">convertido a RD${quote.totalRD.toLocaleString("en-US")}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {showCheckout ? (
            <QuoteCheckout url={url} store={store} />
          ) : (
            <button
              type="button"
              onClick={() => setShowCheckout(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white"
            >
              💳 Pagar con tarjeta
            </button>
          )}
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-black py-4 font-bold"><span className="font-black text-blue-600">P</span> Pagar con PayPal</button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-neutral-100 py-3 text-center text-sm">
            ¿Talla o color? Escríbenos por WhatsApp
          </a>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-[11px]">
          <div><div className="text-xl">🛡️</div>Compra<br />100% original</div>
          <div><div className="text-xl">🚚</div>Entrega<br />7-14 días</div>
          <div><div className="text-xl">💬</div>Soporte<br />WhatsApp</div>
        </div>

        <div className="mt-8 text-center text-[11px] text-neutral-400">Al pagar autorizas a USALINK a comprar por ti en {store}. Recibirás factura y tracking por WhatsApp.</div>
      </div>
    </div>
  )
}

function ProductThumb({ image, name }: { image: string | null; name: string }) {
  return (
    <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-3xl">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="size-full object-contain" referrerPolicy="no-referrer" />
      ) : (
        "🛍️"
      )}
    </div>
  )
}
