import { NextResponse, type NextRequest } from 'next/server'

import { quoteProductUrl } from '@/lib/scrape'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')?.trim() ?? ''
  const result = await quoteProductUrl(url)
  return NextResponse.json(result, { status: result.found || result.product ? 200 : 422 })
}
