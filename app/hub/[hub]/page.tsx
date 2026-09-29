import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CategoryHub } from "@/app/components/hub/CategoryHub"
import { getHub, hubs } from "@/app/components/hub/hubData"

export function generateStaticParams() {
  return hubs.map((hub) => ({ hub: hub.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ hub: string }> }): Promise<Metadata> {
  const hub = getHub((await params).hub)
  return hub ? { title: `${hub.title} | USALINK`, description: hub.subtitle } : {}
}

export default async function HubPage({ params }: { params: Promise<{ hub: string }> }) {
  const hub = getHub((await params).hub)
  if (!hub) notFound()
  return <CategoryHub hub={hub} />
}
