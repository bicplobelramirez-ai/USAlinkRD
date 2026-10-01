export type StoreModel = {
  id: string
  name: string
  category: string
  usd: number
  image: string
}

export type StoreConfig = {
  slug: string
  name: string
  tagline: string
  facade: string
  sizeLabel: string | null
  sizes: string[]
  categories: string[]
  models: StoreModel[]
}

export const RD_RATE = 65

export const stores: Record<string, StoreConfig> = {
  'coach-outlet': {
    slug: 'coach-outlet',
    name: 'Coach Outlet',
    tagline: 'Carteras premium a precio outlet',
    facade: '/storefronts/coach-outlet.png',
    sizeLabel: null,
    sizes: [],
    categories: ['Todos', 'Hombro', 'Tote', 'Crossbody'],
    models: [
      { id: 'tabby-26', name: 'Tabby 26', category: 'Hombro', usd: 295, image: '/coach/tabby-26.png' },
      { id: 'empire-26', name: 'Empire Carryall 26', category: 'Tote', usd: 248, image: '/coach/empire-26.png' },
      { id: 'city-tote', name: 'City Tote', category: 'Tote', usd: 159, image: '/coach/city-tote.png' },
      { id: 'lana-23', name: 'Lana Shoulder 23', category: 'Hombro', usd: 189, image: '/coach/lana-23.png' },
      { id: 'willow-24', name: 'Willow Bucket 24', category: 'Crossbody', usd: 219, image: '/coach/willow-24.png' },
      { id: 'rowan-file', name: 'Rowan File Bag', category: 'Crossbody', usd: 139, image: '/coach/rowan-file.png' },
    ],
  },
  'foot-locker': {
    slug: 'foot-locker',
    name: 'Foot Locker',
    tagline: 'Sneakers originales de todas las marcas',
    facade: '/storefronts/foot-locker.png',
    sizeLabel: 'Talla US',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    categories: ['Todos', 'Lifestyle', 'Retro', 'Botas'],
    models: [
      { id: 'jordan-4', name: 'Air Jordan 4 Retro', category: 'Retro', usd: 215, image: '/foot-locker/jordan-4.png' },
      { id: 'air-max-90', name: 'Nike Air Max 90', category: 'Lifestyle', usd: 135, image: '/foot-locker/air-max-90.png' },
      { id: 'samba', name: 'Adidas Samba OG', category: 'Retro', usd: 100, image: '/foot-locker/samba.png' },
      { id: 'nb-550', name: 'New Balance 550', category: 'Lifestyle', usd: 110, image: '/foot-locker/nb-550.png' },
      { id: 'timberland', name: 'Timberland 6" Premium', category: 'Botas', usd: 198, image: '/foot-locker/timberland.png' },
      { id: 'crocs', name: 'Crocs Classic Clog', category: 'Lifestyle', usd: 50, image: '/foot-locker/crocs.png' },
    ],
  },
}

export const toRD = (usd: number) => `RD$ ${Math.round(usd * RD_RATE).toLocaleString('en-US')}`
