import { ExtractionError } from "./nike"

export type Json = Record<string, unknown>
export const asObject = (value: unknown): Json | null => (value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : null)
export const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])
export const asString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : null)

/** Acepta 83.95, "83.95" o "$1,083.95". Devuelve null si no es un monto positivo claro. */
export const asPrice = (value: unknown) => {
  const parsed = typeof value === "string" ? Number(value.replace(/[$,\s]/g, "")) : value
  return typeof parsed === "number" && Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) / 100 : null
}

export const samePrice = (a: number | null, b: number | null) => a !== null && b !== null && Math.round(a * 100) === Math.round(b * 100)

export function safeUrl(value: unknown, allowedHosts: string[]) {
  const raw = asString(value)
  if (!raw) return null
  try {
    const url = new URL(raw)
    return url.protocol === "https:" && allowedHosts.includes(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

const FETCH_TIMEOUT_MS = 15000

export async function fetchStorePage(url: URL, allowedHosts: string[]) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })
    if (response.status === 404) throw new ExtractionError("product_not_found")
    if (!response.ok || !allowedHosts.includes(new URL(response.url).hostname)) throw new ExtractionError("store_unavailable")
    return await response.text()
  } catch (error) {
    if (error instanceof ExtractionError) throw error
    throw new ExtractionError("store_unavailable")
  }
}

export function readJsonLd(html: string): Json[] {
  const nodes: Json[] = []
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const parsed: unknown = JSON.parse(match[1].trim())
      const list = Array.isArray(parsed) ? parsed : asArray(asObject(parsed)?.["@graph"]).length ? asArray(asObject(parsed)?.["@graph"]) : [parsed]
      for (const node of list) {
        const object = asObject(node)
        if (object) nodes.push(object)
      }
    } catch {
      continue
    }
  }
  return nodes
}

export function readSchemaAvailability(value: unknown): "available" | "unavailable" | null {
  const raw = asString(value)
  if (!raw) return null
  if (/InStock|LimitedAvailability|OnlineOnly/i.test(raw)) return "available"
  if (/OutOfStock|SoldOut|Discontinued/i.test(raw)) return "unavailable"
  return null
}

/** Extrae el objeto JSON completo que contiene `marker`, empezando en la `{` más cercana anterior con `startToken`. */
export function readEnclosingObject(text: string, marker: string, startToken: string): Json | null {
  const at = text.indexOf(marker)
  if (at < 0) return null
  const start = text.lastIndexOf(startToken, at)
  if (start < 0) return null
  let depth = 0
  let inString = false
  for (let index = start; index < text.length; index++) {
    const char = text[index]
    if (inString) {
      if (char === "\\") index++
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === "{") depth++
    else if (char === "}" && --depth === 0) {
      try {
        return asObject(JSON.parse(text.slice(start, index + 1)))
      } catch {
        return null
      }
    }
  }
  return null
}
