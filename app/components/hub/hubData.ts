export type HubId = "outlets" | "moda" | "sneakers" | "belleza" | "tech"

export type HubItem = {
  slug: string
  brand: string
  model: string
  category: string
  image?: string
  badge?: string
}

export type Hub = {
  id: HubId
  name: string
  title: string
  subtitle: string
  searchPlaceholder: string
  badge: string
  missingWord: string
  surface: "plain" | "sky" | "blush"
  filters: string[]
  trending: string[]
  items: HubItem[]
}

const item = (brand: string, model: string, category: string, image?: string, badge?: string): HubItem => ({
  slug: `${brand}-${model}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  brand,
  model,
  category,
  image,
  badge,
})

export const hubs: Hub[] = [
  {
    id: "outlets",
    name: "Outlets",
    title: "Outlets - Marcas Premium",
    subtitle: "Carteras y accesorios premium a precio outlet • +10 marcas oficiales",
    searchPlaceholder: "Buscar Coach, Michael Kors...",
    badge: "Premium Outlet",
    missingWord: "cartera",
    surface: "plain",
    filters: ["Todos", "Carteras", "Crossbody", "Tote", "Accesorios"],
    trending: ["Coach Tabby", "MK Jet Set", "Kate Spade Knott"],
    items: [
      item("Coach", "Tabby 26 - Piel", "Carteras", "/coach/tabby-26.png"),
      item("Michael Kors", "Jet Set Crossbody", "Crossbody", "/macys/mk-crossbody.png"),
      item("Coach", "Willow Tote 24", "Tote", "/coach/willow-24.png"),
      item("Coach", "Lana 23", "Carteras", "/coach/lana-23.png"),
      item("Coach", "Empire Carryall 26", "Tote", "/coach/empire-26.png"),
      item("Kate Spade", "Knott", "Carteras"),
      item("Tory Burch", "Fleming", "Carteras"),
      item("Coach", "Brooklyn 28", "Tote"),
      item("Karl Lagerfeld", "Maybelle Crossbody", "Crossbody"),
      item("Guess", "Noelle Tote", "Tote"),
      item("Fossil", "Billetera de piel", "Accesorios"),
      item("Steve Madden", "Bvital Tote", "Tote"),
    ],
  },
  {
    id: "moda",
    name: "Moda",
    title: "Moda - Últimas tendencias",
    subtitle: "Estilos modernos desde USA",
    searchPlaceholder: "Buscar Zara, SHEIN, H&M...",
    badge: "Moda USA",
    missingWord: "outfit",
    surface: "plain",
    filters: ["Todos", "Mujer", "Hombre", "Vestidos", "Streetwear"],
    trending: ["Zara Satin Dress", "SHEIN Cargo", "Fashion Nova Jeans"],
    items: [
      item("Zara", "Satin Dress", "Vestidos", "/macys/satin-dress.png"),
      item("Uniqlo", "U Tee", "Hombre", "/uniqlo/u-crew-tee.png"),
      item("Uniqlo", "Wide Fit Jeans", "Mujer", "/uniqlo/wide-fit-jeans.png"),
      item("Fashion Nova", "Jeans", "Mujer"),
      item("SHEIN", "Cargo Set", "Streetwear"),
      item("H&M", "Basics", "Hombre"),
      item("Abercrombie", "Hoodie", "Streetwear"),
      item("Mango", "Blazer", "Mujer"),
      item("ASOS", "Set", "Streetwear"),
    ],
  },
  {
    id: "sneakers",
    name: "Zapatillas",
    title: "Zapatillas - SNEAKERS",
    subtitle: "Running · Lifestyle · Casual · +20 marcas oficiales",
    searchPlaceholder: "Buscar New Balance, HOKA...",
    badge: "Sneakers",
    missingWord: "modelo",
    surface: "sky",
    filters: ["Todos", "Running", "Lifestyle", "Casual", "Basketball", "Trail"],
    trending: ["NB 9060", "HOKA Clifton 9", "Adidas Samba", "ON Cloud 5"],
    items: [
      item("New Balance", "550", "Lifestyle", "/foot-locker/nb-550.png"),
      item("Adidas", "Samba", "Casual", "/foot-locker/samba.png"),
      item("Nike", "Air Max 90", "Lifestyle", "/foot-locker/air-max-90.png"),
      item("Jordan", "4 Retro", "Basketball", "/foot-locker/jordan-4.png"),
      item("New Balance", "9060", "Lifestyle"),
      item("HOKA", "Clifton 9", "Running"),
      item("HOKA", "Bondi 8", "Running"),
      item("Brooks", "Ghost 15", "Running"),
      item("ASICS", "Gel Kayano", "Running"),
      item("Vans", "Knu Skool", "Casual"),
      item("ON", "Cloud 5", "Running"),
      item("Puma", "Suede", "Casual"),
      item("Converse", "Chuck Taylor", "Casual"),
      item("HOKA", "Speedgoat", "Trail"),
    ],
  },
  {
    id: "belleza",
    name: "Belleza",
    title: "Belleza - Todo para ti",
    subtitle: "Skincare • maquillaje • fragancias",
    searchPlaceholder: "Buscar Fenty, CeraVe, Dior...",
    badge: "Belleza Original",
    missingWord: "producto",
    surface: "blush",
    filters: ["Todos", "Skincare", "Maquillaje", "Fragancias", "Hair"],
    trending: ["Fenty Lip", "CeraVe Cleanser", "Rare Beauty Blush"],
    items: [
      item("Fenty Beauty", "Gloss Bomb", "Maquillaje", "/sephora/gloss-bomb.png"),
      item("Rare Beauty", "Soft Pinch Blush", "Maquillaje", "/sephora/rare-beauty-blush.png"),
      item("Dior", "Lip Oil", "Maquillaje", "/sephora/dior-lip-oil.png"),
      item("Charlotte Tilbury", "Flawless Filter", "Maquillaje", "/sephora/flawless-filter.png"),
      item("Bath & Body Works", "Fragrance Mist", "Fragancias", "/bath-and-body-works/fragrance-mist.png"),
      item("Sol de Janeiro", "Bum Bum Cream", "Skincare", "/sephora/bum-bum-cream.png"),
      item("Supergoop!", "Unseen Sunscreen", "Skincare", "/sephora/unseen-sunscreen.png"),
      item("Ulta", "Eyeshadow Palette", "Maquillaje"),
      item("MAC", "Ruby Woo", "Maquillaje"),
      item("Victoria's Secret", "Body Lotion", "Fragancias"),
      item("CeraVe", "Cleanser", "Skincare"),
      item("The Ordinary", "Niacinamide", "Skincare"),
      item("La Roche-Posay", "Anthelios", "Skincare"),
      item("Olaplex", "No. 3", "Hair"),
    ],
  },
  {
    id: "tech",
    name: "Tech",
    title: "Tech - Gadgets desde USA",
    subtitle: "Lo último en tecnología",
    searchPlaceholder: "Buscar AirPods, Hollyland...",
    badge: "Tech Original",
    missingWord: "gadget",
    surface: "plain",
    filters: ["Todos", "Audio", "Smart", "Gaming", "Accesorios", "Podcast"],
    trending: ["AirPods Pro", "Hollyland Lark M2", "Apple Watch"],
    items: [
      item("Apple", "AirPods Pro 2ª Gen", "Audio", "/target/airpods.png"),
      item("Apple", "Watch Series 9", "Smart"),
      item("Sony", "WH-1000XM5", "Audio"),
      item("B&H", "Cámara 24MP", "Accesorios"),
      item("Samsung", "Buds FE", "Audio"),
      item("Apple", "iPhone MagSafe Case", "Accesorios"),
      item("Anker", "PowerBank", "Accesorios"),
      item("Logitech", "MX Mouse", "Gaming"),
      item("Hollyland", "Lark M2 Wireless Mic", "Podcast", undefined, "Kit Podcast"),
      item("Hollyland", "Lark C1 Mobile Mic", "Podcast", undefined, "Kit Podcast"),
      item("Hollyland", "VenusLiv V2 Streaming Camera", "Podcast", undefined, "Kit Podcast"),
      item("Hollyland", "Solidcom C1 Intercom", "Podcast", undefined, "Kit Podcast"),
    ],
  },
]

export const getHub = (id: string) => hubs.find((hub) => hub.id === id)

export const findItem = (slug: string) => {
  for (const hub of hubs) {
    const found = hub.items.find((entry) => entry.slug === slug)
    if (found) return { hub, item: found }
  }
  return undefined
}
