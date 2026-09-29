import Link from "next/link"
import { Home, PackageSearch, Sparkles, Store } from "lucide-react"

const links = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/tiendas", label: "Tiendas", icon: Store },
  { href: "/concepto", label: "IA", icon: Sparkles, highlight: true },
  { href: "/concepto#rastreo", label: "Rastreo", icon: PackageSearch },
]

export function BottomNav() {
  return (
    <nav aria-label="Principal" className="fixed inset-x-0 bottom-0 z-30 border-t border-hub-navy/10 bg-background pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-xl items-center justify-around">
        {links.map(({ href, label, icon: Icon, highlight }) => (
          <li key={label}>
            <Link
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 text-[11px] font-semibold ${
                highlight ? "text-hub-pink" : "text-hub-navy/60 hover:text-hub-navy"
              }`}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
