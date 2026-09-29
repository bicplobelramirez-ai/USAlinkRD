export type Storefront = {
  name: string
  file: string
  href: string
  tagline: string
  color: string
  textColor: string
}

export const storefronts: Storefront[] = [
  { name: "Coach Outlet", file: "coach-outlet.png", href: "/coach", tagline: "Carteras premium", color: "#6B4A33", textColor: "#F3E7D8" },
  { name: "Michael Kors", file: "michael-kors.png", href: "/tienda/michael-kors", tagline: "Bolsos y relojes", color: "#111111", textColor: "#FFFFFF" },
  { name: "Target", file: "target.png", href: "/target", tagline: "De todo para la casa", color: "#CC0000", textColor: "#FFFFFF" },
  { name: "Sephora", file: "sephora.png", href: "/sephora", tagline: "Belleza original", color: "#000000", textColor: "#FFFFFF" },
  { name: "Nike", file: "nike.png", href: "/nike", tagline: "Tenis y ropa", color: "#111111", textColor: "#FFFFFF" },
  { name: "Best Buy", file: "best-buy.png", href: "/tienda/best-buy", tagline: "Electrónica", color: "#003B64", textColor: "#FFE000" },
  { name: "Ulta Beauty", file: "ulta-beauty.png", href: "/tienda/ulta-beauty", tagline: "Maquillaje y skincare", color: "#FF6600", textColor: "#FFFFFF" },
  { name: "Bath & Body Works", file: "bath-body-works.png", href: "/bath-and-body-works", tagline: "Velas y fragancias", color: "#F4F4F4", textColor: "#071B45" },
  { name: "Apple Store", file: "apple-store.png", href: "/tienda/apple-store", tagline: "iPhone, AirPods, Watch", color: "#E8E8ED", textColor: "#1D1D1F" },
  { name: "B&H Photo", file: "bh-photo.png", href: "/tienda/bh-photo", tagline: "Cámaras y audio", color: "#1A1A1A", textColor: "#F5C400" },
  { name: "Lululemon", file: "lululemon.png", href: "/lululemon", tagline: "Ropa deportiva", color: "#D9C3A5", textColor: "#C8102E" },
  { name: "Foot Locker", file: "foot-locker.png", href: "/foot-locker", tagline: "Sneakers", color: "#111111", textColor: "#FFD100" },
]
