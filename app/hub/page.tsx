import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { hubs } from "@/app/components/hub/hubData"
import { BottomNav } from "@/app/components/hub/BottomNav"

export const metadata: Metadata = {
  title: "Categorías | USALINK",
  description: "Outlets, moda, sneakers, belleza y tech desde USA hasta RD.",
}

export default function HubIndexPage() {
  return (
    <div className="min-h-dvh bg-background pb-20 text-hub-navy">
      <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 pt-6">
        <h1 className="font-display text-2xl font-extrabold">¿Qué quieres traer de USA?</h1>
        <ul className="flex flex-col gap-3">
          {hubs.map((hub) => (
            <li key={hub.id}>
              <Link
                href={`/hub/${hub.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-background p-4 shadow-[0_4px_16px_rgba(7,27,69,0.08)] hover:ring-2 hover:ring-hub-pink"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="font-bold">{hub.title}</span>
                  <span className="text-sm leading-relaxed text-hub-navy/60">{hub.subtitle}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-hub-pink" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  )
}
