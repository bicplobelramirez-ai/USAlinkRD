"use client"

import { Suspense, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Link2 } from "lucide-react"
import { ANALYSIS_STEPS, requestQuote, whatsappQuoteUrl, type QuoteRequest, type VerifiedQuote } from "@/lib/quote-agent"
import { MAX_QUANTITY, findCatalogModel, isValidProductUrl } from "@/lib/quote"
import { AnalyzingSteps, DiscountsCard, ProductCard, QuoteActions, QuoteSummary, SavingsCard, TrustRow, UnverifiedCard, WhatsAppHelp, type Selection } from "./QuoteSections"

type Phase = "idle" | "analyzing" | "ready" | "unverified"

const STEP_DELAY_MS = 650
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function CotizarPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f6f8fb]" />}><CotizarContent /></Suspense>
}

function useEntryContext() {
  const params = useSearchParams()
  const catalog = findCatalogModel(params.get("tienda") ?? "", params.get("modelo") ?? "")
  return {
    url: params.get("url") ?? "",
    store: params.get("store") ?? catalog?.store.name ?? "",
    product: params.get("producto") ?? catalog?.model.name ?? "",
    size: params.get("talla") ?? "",
    color: params.get("color") ?? "",
    quantity: Math.min(MAX_QUANTITY, Math.max(1, Number(params.get("cantidad")) || 1)),
  }
}

function CotizarContent() {
  const router = useRouter()
  const entry = useEntryContext()
  const [link, setLink] = useState(entry.url)
  const [error, setError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>("idle")
  const [step, setStep] = useState(0)
  const [quote, setQuote] = useState<VerifiedQuote | null>(null)
  const [selection, setSelection] = useState<Selection>({ size: entry.size, color: entry.color, quantity: entry.quantity })
  const [saved, setSaved] = useState(false)
  const [buyNote, setBuyNote] = useState<string | null>(null)
  const runId = useRef(0)

  const request: QuoteRequest = {
    productUrl: link.trim(),
    storeHint: entry.store || undefined,
    productHint: entry.product || undefined,
    size: selection.size || undefined,
    color: selection.color || undefined,
    quantity: selection.quantity,
  }

  async function startQuote() {
    const url = link.trim()
    if (!isValidProductUrl(url)) {
      setError("Pega un link válido que empiece con https://")
      return
    }
    const currentRun = ++runId.current
    setError(null)
    setQuote(null)
    setSaved(false)
    setBuyNote(null)
    setPhase("analyzing")

    const responsePromise = requestQuote({ ...request, productUrl: url })
    for (let index = 0; index < ANALYSIS_STEPS.length; index++) {
      setStep(index)
      await wait(STEP_DELAY_MS)
      if (currentRun !== runId.current) return
    }
    const response = await responsePromise
    if (currentRun !== runId.current) return

    if (response.status === "verified") {
      setQuote(response.quote)
      setSelection({ size: response.quote.selectedSize ?? selection.size, color: response.quote.selectedColor ?? selection.color, quantity: response.quote.quantity })
      setPhase("ready")
    } else {
      setPhase("unverified")
    }
  }

  function updateLink(value: string) {
    runId.current++
    setLink(value)
    setError(null)
    if (phase !== "idle") setPhase("idle")
  }

  const whatsappHref = whatsappQuoteUrl(request)
  const contextLabel = [entry.store, entry.product].filter(Boolean).join(" · ")

  return (
    <main className="min-h-screen bg-[#f6f8fb] pb-8 text-[#10213f]">
      <header className="sticky top-0 z-20 border-b border-[#e4eaf2] bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button type="button" onClick={() => router.back()} aria-label="Volver" className="rounded-full p-2 text-[#10213f] hover:bg-[#f0f4f9]"><ArrowLeft size={20} /></button>
          <div className="text-sm font-black tracking-tight">Cotización</div>
          <div className="size-9" />
        </div>
      </header>

      <div className="mx-auto max-w-md px-4">
        <section className="pt-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#2473b8]">Compra fácil en USA</p>
          <h1 className="mt-2 text-[29px] font-black leading-[1.05] tracking-[-0.045em] text-balance">Cotiza cualquier producto de USA</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">Pega el link del producto y descubre cuánto te cuesta comprarlo con UsaLink.</p>
          {contextLabel && <p className="mt-3 inline-flex max-w-full rounded-full bg-[#e8f4ff] px-3 py-1 text-[11px] font-bold text-[#2473b8]"><span className="truncate">Desde {contextLabel}</span></p>}

          <form className="mt-5 rounded-2xl border border-[#dce5ef] bg-white p-2 shadow-[0_8px_24px_rgba(16,33,63,0.06)]" onSubmit={(event) => { event.preventDefault(); startQuote() }}>
            <div className="flex items-center gap-2 rounded-xl bg-[#f6f8fb] px-3">
              <Link2 size={17} className="shrink-0 text-[#2473b8]" />
              <input type="url" inputMode="url" value={link} onChange={(event) => updateLink(event.target.value)} aria-label="Link del producto" aria-invalid={Boolean(error)} aria-describedby={error ? "link-error" : undefined} placeholder="Pega el link del producto" className="min-w-0 flex-1 bg-transparent py-3.5 text-xs text-[#334155] outline-none placeholder:text-[#94a3b8]" />
            </div>
            {error && <p id="link-error" role="alert" className="px-2 pt-2 text-xs font-bold text-[#c2410c]">{error}</p>}
            <button type="submit" disabled={phase === "analyzing"} className="mt-2 w-full rounded-xl bg-[#10213f] py-3.5 text-sm font-black text-white transition-transform active:scale-[0.98] disabled:opacity-60">Obtener cotización</button>
          </form>
          {phase === "idle" && <WhatsAppHelp href={whatsappHref} />}
        </section>

        {phase === "analyzing" && <AnalyzingSteps steps={ANALYSIS_STEPS} current={step} />}

        {phase === "unverified" && <UnverifiedCard reviewHref={whatsappQuoteUrl({ ...request, intent: "review" })} whatsappHref={whatsappHref} />}

        {phase === "ready" && quote && <>
          <ProductCard quote={quote} selection={selection} maxQuantity={MAX_QUANTITY} onChange={setSelection} />
          <DiscountsCard quote={quote} />
          <SavingsCard quote={quote} />
          <QuoteSummary quote={quote} />
          <QuoteActions
            canBuy={quote.availability !== "unavailable"}
            saved={saved}
            buyNote={buyNote}
            onBuy={() => setBuyNote("El pago se habilitará cuando el sistema de cotización esté conectado.")}
            onSave={() => setSaved((value) => !value)}
            whatsappHref={whatsappHref}
          />
        </>}

        <TrustRow />
      </div>
    </main>
  )
}
