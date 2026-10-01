import { notFound } from 'next/navigation'
import StorePage from '@/app/components/store/StorePage'
import { stores } from '@/app/components/store/storeData'

export function generateStaticParams() {
  return Object.keys(stores).map((slug) => ({ slug }))
}

export default async function MockupStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const store = stores[slug]
  if (!store) notFound()
  return <StorePage store={store} />
}
