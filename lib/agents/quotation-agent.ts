import { generateText, isStepCount, Output, tool } from "ai"
import { z } from "zod"
import type { AgentMissingField, AgentNextStep, ProductSnapshot, QuoteAgentResult, QuoteSelectionInput } from "@/lib/quote-agent"
import { allowedAmounts, buildAgentInput, checkMissingSelections, listPendingItems, type QuotationAgentInput } from "./quote-tools"

export const QUOTATION_AGENT_MODEL = "openai/gpt-4.1-mini"
const AGENT_TIMEOUT_MS = 12000

const QUESTIONS: Record<AgentMissingField, string> = {
  size: "¿Qué talla necesitas?",
  color: "Selecciona el color que deseas.",
}

const INSTRUCTIONS = `Eres el Agente de Cotización de UsaLink, un servicio que compra productos en tiendas de USA para clientes en República Dominicana.
Respondes siempre en español neutro, en frases cortas y claras.

Reglas obligatorias:
- Llama primero a getVerifiedProduct y luego a checkMissingSelections. Solo usa los datos que devuelven esas herramientas.
- Nunca inventes ni modifiques precios, descuentos, cupones, códigos promocionales, disponibilidad, tallas, colores, envío, sales tax, fee UsaLink ni totales.
- No hagas cálculos monetarios. No multipliques por la cantidad ni sumes montos. Los totales los calcula el backend en una fase posterior.
- Si mencionas un precio o descuento, copia exactamente el valor de getVerifiedProduct con formato $0.00.
- Si un dato es null o no está verificado, di que está "pendiente de verificación".
- Solo existen códigos promocionales si getVerifiedProduct los devuelve. Hoy nunca los devuelve: no menciones cupones.
- nextStep debe coincidir con checkMissingSelections: si falta "size" usa ask_size; si falta "color" usa ask_color; si el producto no está disponible usa unavailable; si falta el precio usa needs_review; si no falta nada usa ready_for_pricing.
- question solo cuando nextStep pide un dato al cliente; si no, null.
- summary: 1 o 2 frases que resuman lo verificado y el siguiente paso.
- discountExplanation: solo si verifiedDiscounts tiene elementos; explica la rebaja real de la tienda. Si no, null.`

const outputSchema = z.object({
  nextStep: z.enum(["ask_size", "ask_color", "ready_for_pricing", "unavailable", "needs_review"]),
  question: z.string().nullable().describe("Pregunta corta al cliente, o null"),
  summary: z.string().describe("Resumen breve en español"),
  discountExplanation: z.string().nullable().describe("Explicación de la rebaja real de la tienda, o null"),
})

/** El siguiente paso lo decide el backend; el modelo solo redacta. */
function expectedNextStep(input: QuotationAgentInput, missing: AgentMissingField[]): AgentNextStep {
  if (input.currentPrice === null) return "needs_review"
  if (input.availability === "unavailable") return "unavailable"
  if (missing.includes("size")) return "ask_size"
  if (missing.includes("color")) return "ask_color"
  return "ready_for_pricing"
}

/** Rechaza cualquier texto que mencione un monto o porcentaje que no venga de la tienda. */
function mentionsOnlyVerifiedNumbers(text: string, input: QuotationAgentInput) {
  const { cents, percentages } = allowedAmounts(input)
  for (const match of text.matchAll(/(?:US)?\$\s?(\d[\d,]*(?:\.\d{1,2})?)/g)) {
    if (!cents.has(Math.round(Number(match[1].replace(/,/g, "")) * 100))) return false
  }
  for (const match of text.matchAll(/(\d+(?:[.,]\d+)?)\s?%/g)) {
    if (!percentages.has(Math.round(Number(match[1].replace(",", ".")) * 10))) return false
  }
  return true
}

const money = (value: number) => `$${value.toFixed(2)}`

function fallbackMessages(input: QuotationAgentInput, nextStep: AgentNextStep) {
  const name = input.productName ?? "este producto"
  const price = input.currentPrice !== null ? ` a ${money(input.currentPrice)}` : ""
  const summary = {
    needs_review: `Encontramos ${name} en ${input.storeName}, pero el precio está pendiente de verificación.`,
    unavailable: `${input.storeName} marca ${name} como no disponible en este momento.`,
    ask_size: `Verificamos ${name} en ${input.storeName}${price}. Elige tu talla para continuar.`,
    ask_color: `Verificamos ${name} en ${input.storeName}${price}. Elige el color para continuar.`,
    ready_for_pricing: `Verificamos ${name} en ${input.storeName}${price}. El envío, el sales tax y el fee UsaLink están pendientes.`,
  }[nextStep]
  const discount = input.verifiedDiscounts[0]
  const discountExplanation = discount && input.originalPrice !== null && input.currentPrice !== null
    ? `${input.storeName} lo tiene rebajado de ${money(input.originalPrice)} a ${money(input.currentPrice)}.`
    : null
  return { summary, discountExplanation }
}

export async function runQuotationAgent(product: ProductSnapshot, selection: QuoteSelectionInput): Promise<QuoteAgentResult> {
  const input = buildAgentInput(product, selection)
  const missing = checkMissingSelections(input)
  const pending = listPendingItems(input)
  const nextStep = expectedNextStep(input, missing)
  const deterministicQuestion = nextStep === "ask_size" ? QUESTIONS.size : nextStep === "ask_color" ? QUESTIONS.color : null
  const fallback = fallbackMessages(input, nextStep)
  const base = { nextStep, question: deterministicQuestion, missing, pending, model: QUOTATION_AGENT_MODEL }

  try {
    const { output } = await generateText({
      model: QUOTATION_AGENT_MODEL,
      instructions: INSTRUCTIONS,
      prompt: "Organiza esta cotización para el cliente.",
      tools: {
        getVerifiedProduct: tool({
          description: "Devuelve los datos verificados del producto obtenidos por el extractor de la tienda. Es la única fuente de precios, disponibilidad y descuentos.",
          inputSchema: z.object({}),
          execute: async () => input,
        }),
        checkMissingSelections: tool({
          description: "Devuelve los datos que el cliente todavía debe elegir y los datos pendientes de verificación.",
          inputSchema: z.object({}),
          execute: async () => ({ missing, pending }),
        }),
      },
      output: Output.object({ schema: outputSchema }),
      stopWhen: isStepCount(4),
      abortSignal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
    })

    const texts = [output.summary, output.question ?? "", output.discountExplanation ?? ""]
    const trustworthy = output.nextStep === nextStep && texts.every((text) => mentionsOnlyVerifiedNumbers(text, input))
    if (!trustworthy) return { ...base, ...fallback, source: "rules", rejectedModelOutput: true }

    return {
      ...base,
      question: deterministicQuestion ? output.question || deterministicQuestion : null,
      summary: output.summary,
      discountExplanation: input.verifiedDiscounts.length > 0 ? output.discountExplanation : null,
      source: "openai",
      rejectedModelOutput: false,
    }
  } catch (error) {
    console.error("[quotation-agent] fallback:", error instanceof Error ? error.message : error)
    return { ...base, ...fallback, source: "rules", rejectedModelOutput: false }
  }
}
