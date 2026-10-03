import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import StorePage from '../../components/store/StorePage'
import { stores } from '../../components/store/storeData'

const aliases: Record<string, string> = {
  coach: 'coach-outlet',
  footlocker: 'foot-locker',
  'bath-body-works': 'bath-and-body-works',
  bbw: 'bath-and-body-works',
  macy: 'macys',
  carter: 'carters',
}

function resolveStore(id: string) {
  const slug = id.toLowerCase()
  return stores[aliases[slug] ?? slug]
}

export function generateStaticParams() {
  return Object.keys(stores).map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const store = resolveStore(id)
  if (!store) return { title: 'Tienda | USALINK' }
  return {
    title: `${store.name} | USALINK`,
    description: `Compra en ${store.name} desde República Dominicana con USALINK.`,
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slug = id.toLowerCase()
  if (slug === 'tiktok' || slug === 'tiktok-shop') redirect('/tiktok-shop')

  const store = resolveStore(slug)
  if (!store) notFound()

  return <StorePage store={store} />
}
