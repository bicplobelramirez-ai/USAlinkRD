"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import QuoteCheckout from "@/app/components/QuoteCheckout"
import { getQuote, isValidProductUrl } from "@/lib/quote"

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

  const [step, setStep] = useState<"analyzing" | "result">("analyzing")
  const [progress, setProgress] = useState(10)

  const [showCheckout, setShowCheckout] = useState(false)
  const product = { ...getQuote(), image: "👟" }
  const { total, totalRD } = product
  const canPay = isValidProductUrl(url)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval)
          setStep("result")
          return 100
        }
        return currentProgress + 15
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  if (step === "analyzing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 text-black">
        <div className="w-full max-w-sm text-center">
          <div className="mb-8 animate-spin text-5xl">⚙️</div>
          <h1 className="text-2xl font-black">Analizando tu<br />link de {store}...</h1>

          <div className="mt-6 h-3 w-full overflow-hidden rounded-full bg-neutral-200">
            <div className="h-full bg-black transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <p className="mt-6 text-sm text-neutral-500">Estamos obteniendo precio,<br />impuestos y envío...</p>
          <p className="mt-8 text-xs text-neutral-400">Esto puede demorar unos segundos</p>
          <p className="mt-20 text-[10px] text-neutral-300">USALINK • Cotiza en segundos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-32 text-black">
      <div className="sticky top-0 flex items-center justify-between border-b bg-white px-4 py-3">
        <button type="button" onClick={() => router.back()} aria-label="Volver">‹</button>
        <div className="font-bold">Cotización</div>
        <button type="button" className="text-sm" aria-label="Compartir">↗</button>
      </div>

      <div className="mx-auto max-w-md p-4">
        <div className="mt-4 flex gap-4 rounded-2xl bg-neutral-50 p-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white text-3xl">{product.image}</div>
          <div>
            <div className="font-bold">{product.name}</div>
            <div className="text-sm text-neutral-600">US${product.price}</div>
            <div className="mt-1 w-48 truncate text-[11px] text-neutral-400">{url}</div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold">Desglose</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span>Precio producto</span><span>US${product.price}</span></div>
            <div className="flex justify-between"><span>Impuestos USA</span><span>${product.tax}</span></div>
            <div className="flex justify-between"><span>Envío USA a Miami</span><span>${product.shipUSA}</span></div>
            <div className="flex justify-between"><span>Servicio USALINK</span><span>${product.service}</span></div>
            <div className="flex justify-between"><span>Envío Miami a RD</span><span>${product.shipRD}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t pt-3 text-lg font-bold">
            <span>Total:</span>
            <div className="text-right">
              <div>US${total}</div>
              <div className="text-xs font-normal text-neutral-500">convertido a RD${totalRD.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {showCheckout ? (
            <QuoteCheckout url={url} store={store} />
          ) : (
            <button
              type="button"
              disabled={!canPay}
              onClick={() => setShowCheckout(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-4 font-bold text-white disabled:opacity-40"
            >
              💳 Pagar con tarjeta
            </button>
          )}
          {!canPay && <p className="text-center text-xs text-red-600">Pega un enlace válido del producto para poder pagar.</p>}
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border border-black py-4 font-bold"><span className="font-black text-blue-600">P</span> Pagar con PayPal</button>
          <button type="button" className="w-full rounded-xl bg-neutral-100 py-3 text-sm">🔖 Guardar cotización</button>
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
