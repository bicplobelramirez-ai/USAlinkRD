import Link from 'next/link'
import { Check } from 'lucide-react'

const stores = [
  ['TikTok Shop', 'Virales', '/tiktok-shop'],
  ['Nike', 'Tenis', '/nike'],
  ['Coach Outlet', 'Carteras', '/coach'],
  ['Sephora', 'Belleza', '/sephora'],
  ['Uniqlo', 'Básicos', '/uniqlo'],
  ['Etsy', 'Hecho a mano', '/etsy'],
  ["Macy's", 'Todo', '/macys'],
  ['Target', 'Hogar', '/target'],
  ['Bath & Body Works', 'Velas', '/bath-and-body-works'],
  ['Lululemon', 'Deporte', '/lululemon'],
  ['Foot Locker', 'Sneakers', '/foot-locker'],
  ["Carter's", 'Bebés', '/carters'],
  ['Shop', 'Marcas', '/shop'],
]

export function StoreTags() {
  return (
    <section aria-labelledby="tiendas" className="border-t-2 border-ink px-5 py-12 md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 id="tiendas" className="text-3xl font-black tracking-tight text-balance">Elige la tienda. Ya tenemos la ruta.</h2>
          <p className="leading-relaxed text-fog">Cada tienda tiene su vitrina con productos listos para cotizar.</p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {stores.map(([name, tag, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-3 border-2 border-ink bg-label py-2 pl-3 pr-4 transition-colors hover:bg-tape"
              >
                <span aria-hidden="true" className="size-3 rounded-full border-2 border-ink bg-label" />
                <span className="font-bold">{name}</span>
                <span className="font-label text-xs text-fog group-hover:text-ink">{tag}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const steps = [
  ['Pega el link', 'Copia el enlace del producto en la tienda de USA y pégalo en la guía.'],
  ['Ve tu total en pesos', 'Tax, envío y gestión ya sumados. Sin sorpresas al llegar.'],
  ['Confirma por WhatsApp', 'Te respondemos, pagas, y nosotros compramos por ti.'],
  ['Recíbelo en RD', 'Llega a nuestro almacén en Miami y en unos 7 días está contigo.'],
]

export function HowItWorks() {
  return (
    <section aria-labelledby="como" className="border-t-2 border-ink bg-ink px-5 py-12 text-label md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <h2 id="como" className="text-3xl font-black tracking-tight text-balance">Así viaja tu paquete</h2>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map(([title, body], index) => (
            <li key={title} className="flex flex-col gap-2 border-t-2 border-tape pt-4">
              <span className="font-label text-sm text-tape">PASO {index + 1}</span>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="leading-relaxed text-label/75">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const tracking = [
  ['Comprado en Nike.com', 'Lun 21 sep', true],
  ['Recibido en almacén Miami', 'Mié 23 sep', true],
  ['En vuelo MIA → SDQ', 'Vie 25 sep', true],
  ['En aduana RD', 'Sáb 26 sep', false],
  ['Entregado en tu casa', 'Estimado lun 28 sep', false],
] as const

export function TrackingPreview() {
  return (
    <section aria-labelledby="rastreo" className="border-t-2 border-ink px-5 py-12 md:px-10">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-3">
          <h2 id="rastreo" className="text-3xl font-black tracking-tight text-balance">Sabes dónde está en cada momento</h2>
          <p className="leading-relaxed text-fog">
            Te avisamos por WhatsApp en cada parada: compra, Miami, vuelo, aduana y entrega.
          </p>
        </div>
        <div className="border-2 border-ink bg-label">
          <div className="flex items-center justify-between border-b-2 border-ink px-4 py-3 font-label text-xs">
            <span className="font-semibold">GUÍA USL-48213</span>
            <span className="text-fog">Nike Air Force 1 &apos;07</span>
          </div>
          <ol className="flex flex-col px-4 py-2">
            {tracking.map(([label, date, done]) => (
              <li key={label} className="flex items-center gap-3 border-b border-dashed border-ink/30 py-3 last:border-b-0">
                <span
                  aria-hidden="true"
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-ink ${done ? 'bg-stamp text-label' : 'bg-label'}`}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                </span>
                <span className={`flex-1 ${done ? 'font-semibold' : 'text-fog'}`}>{label}</span>
                <span className="font-label text-xs text-fog">{date}</span>
                <span className="sr-only">{done ? 'completado' : 'pendiente'}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
