import { NextRequest, NextResponse } from "next/server"

function readMeta(html: string, names: string[]) {
  for (const name of names) {
    const pattern = new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i")
    const reversePattern = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`, "i")
    const match = html.match(pattern) || html.match(reversePattern)
    if (match?.[1]) return match[1].trim()
  }
  return "No detectado"
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ title: "No detectado", price: "No detectado" }, { status: 400 })
  }

  try {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) })
    const html = await response.text()
    const title = readMeta(html, ["og:title", "twitter:title"]) || "No detectado"
    const price = readMeta(html, ["product:price:amount", "og:price:amount", "twitter:data1"]) || "No detectado"
    return NextResponse.json({ title, price })
  } catch {
    return NextResponse.json({ title: "No detectado", price: "No detectado" })
  }
}
