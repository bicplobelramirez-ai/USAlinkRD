import type { Metadata } from 'next'
import { Archivo, IBM_Plex_Mono } from 'next/font/google'

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo' })
const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-mono' })

export const metadata: Metadata = {
  title: 'USALINK | Tu dirección en USA, tu puerta en RD',
  description: 'Pega el link de cualquier tienda de Estados Unidos, ve tu total en pesos al instante y recíbelo en República Dominicana.',
}

export default function ConceptoLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${archivo.variable} ${plexMono.variable} min-h-screen bg-label font-display text-ink`}>{children}</div>
}
