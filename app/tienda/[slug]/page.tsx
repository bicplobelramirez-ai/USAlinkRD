import { redirect } from "next/navigation"
import { findItem } from "@/app/components/hub/hubData"
import { cotizarProductHref } from "@/lib/quote"

export default async function TiendaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ url?: string }>
}) {
  const found = findItem((await params).slug)
  const url = (await searchParams).url
  redirect(cotizarProductHref({
    url,
    store: found?.item.brand,
    product: found ? `${found.item.brand} ${found.item.model}` : undefined,
  }))
}
