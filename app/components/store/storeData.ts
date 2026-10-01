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
  website: string
  searchUrl: string
  facade: string | null
  sizeLabel: string | null
  sizes: string[]
  colorLabel: string
  categories: string[]
  models: StoreModel[]
}

export const RD_RATE = 65

const m = (id: string, name: string, category: string, usd: number, image: string): StoreModel => ({
  id,
  name,
  category,
  usd,
  image,
})

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12']
const NIKE_IMG =
  'https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply'

export const stores: Record<string, StoreConfig> = {
  'coach-outlet': {
    slug: 'coach-outlet',
    name: 'Coach Outlet',
    tagline: 'Carteras premium a precio outlet',
    website: 'https://www.coachoutlet.com',
    searchUrl: 'https://www.coachoutlet.com/search?q=',
    facade: '/storefronts/coach-outlet.png',
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Color',
    categories: ['Todos', 'Hombro', 'Tote', 'Crossbody'],
    models: [
      m('tabby-26', 'Tabby 26', 'Hombro', 295, '/coach/tabby-26.png'),
      m('empire-26', 'Empire Carryall 26', 'Tote', 248, '/coach/empire-26.png'),
      m('city-tote', 'City Tote', 'Tote', 159, '/coach/city-tote.png'),
      m('lana-23', 'Lana Shoulder 23', 'Hombro', 189, '/coach/lana-23.png'),
      m('willow-24', 'Willow Bucket 24', 'Crossbody', 219, '/coach/willow-24.png'),
      m('rowan-file', 'Rowan File Bag', 'Crossbody', 139, '/coach/rowan-file.png'),
    ],
  },
  'foot-locker': {
    slug: 'foot-locker',
    name: 'Foot Locker',
    tagline: 'Sneakers originales de todas las marcas',
    website: 'https://www.footlocker.com',
    searchUrl: 'https://www.footlocker.com/search?query=',
    facade: '/storefronts/foot-locker.png',
    sizeLabel: 'Talla US',
    sizes: SHOE_SIZES,
    colorLabel: 'Color',
    categories: ['Todos', 'Lifestyle', 'Retro', 'Botas'],
    models: [
      m('jordan-4', 'Air Jordan 4 Retro', 'Retro', 215, '/foot-locker/jordan-4.png'),
      m('air-max-90', 'Nike Air Max 90', 'Lifestyle', 135, '/foot-locker/air-max-90.png'),
      m('samba', 'Adidas Samba OG', 'Retro', 100, '/foot-locker/samba.png'),
      m('nb-550', 'New Balance 550', 'Lifestyle', 110, '/foot-locker/nb-550.png'),
      m('timberland', 'Timberland 6" Premium', 'Botas', 198, '/foot-locker/timberland.png'),
      m('crocs', 'Crocs Classic Clog', 'Lifestyle', 50, '/foot-locker/crocs.png'),
    ],
  },
  nike: {
    slug: 'nike',
    name: 'Nike',
    tagline: 'Sneakers y ropa deportiva oficial',
    website: 'https://www.nike.com',
    searchUrl: 'https://www.nike.com/w?q=',
    facade: '/storefronts/nike.png',
    sizeLabel: 'Talla US',
    sizes: SHOE_SIZES,
    colorLabel: 'Color',
    categories: ['Todos', 'Lifestyle', 'Running', 'Training'],
    models: [
      m('af1', "Nike Air Force 1 '07", 'Lifestyle', 115, `${NIKE_IMG}/a42a5d53-2f99-4e78-a081-9d07a2d0774a/AIR+FORCE+1+%2707.png`),
      m('dunk-low', 'Nike Dunk Low Retro', 'Lifestyle', 125, `${NIKE_IMG}/2990f85d-8844-4e5b-a222-31ed53a5a9d4/NIKE+DUNK+LOW+RETRO.png`),
      m('air-max-270', 'Nike Air Max 270', 'Lifestyle', 160, `${NIKE_IMG}/s6dp2gck3oukxj9csz5y/AIR+MAX+270.png`),
      m('pegasus-42', 'Nike Pegasus 42', 'Running', 130, `${NIKE_IMG}/5e69cf31-a91c-4465-9330-9d86e2f821fd/AIR+ZOOM+PEGASUS+42.png`),
      m('vomero-plus', 'Nike Vomero Plus', 'Running', 180, `${NIKE_IMG}/ab581537-fbd1-41c8-bded-200fa4f49db0/NIKE+VOMERO+PLUS.png`),
      m('metcon-10', 'Nike Metcon 10', 'Training', 155, `${NIKE_IMG}/07e9d15a-d767-42b0-b383-fd97c3197aa8/M+NIKE+METCON+10.png`),
    ],
  },
  sephora: {
    slug: 'sephora',
    name: 'Sephora',
    tagline: 'Maquillaje y skincare original',
    website: 'https://www.sephora.com',
    searchUrl: 'https://www.sephora.com/search?keyword=',
    facade: '/storefronts/sephora.png',
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Tono',
    categories: ['Todos', 'Maquillaje', 'Skincare', 'Cuerpo'],
    models: [
      m('rare-blush', 'Rare Beauty Soft Pinch Blush', 'Maquillaje', 23, '/sephora/rare-beauty-blush.png'),
      m('dior-lip-oil', 'Dior Lip Glow Oil', 'Maquillaje', 40, '/sephora/dior-lip-oil.png'),
      m('flawless-filter', 'Charlotte Tilbury Flawless Filter', 'Maquillaje', 49, '/sephora/flawless-filter.png'),
      m('bum-bum', 'Sol de Janeiro Bum Bum Cream', 'Cuerpo', 48, '/sephora/bum-bum-cream.png'),
      m('unseen', 'Supergoop! Unseen Sunscreen SPF 40', 'Skincare', 38, '/sephora/unseen-sunscreen.png'),
      m('gloss-bomb', 'Fenty Beauty Gloss Bomb', 'Maquillaje', 21, '/sephora/gloss-bomb.png'),
    ],
  },
  target: {
    slug: 'target',
    name: 'Target',
    tagline: 'Hogar, tecnología y más',
    website: 'https://www.target.com',
    searchUrl: 'https://www.target.com/s?searchTerm=',
    facade: '/storefronts/target.png',
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Color / Modelo',
    categories: ['Todos', 'Hogar', 'Tech', 'Juguetes', 'Ropa'],
    models: [
      m('stanley', 'Stanley Quencher H2.0 40oz', 'Hogar', 45, '/target/stanley.png'),
      m('airpods', 'Apple AirPods (3rd Gen)', 'Tech', 169.99, '/target/airpods.png'),
      m('lamp', 'Threshold Ceramic Table Lamp', 'Hogar', 39.99, '/target/lamp.png'),
      m('lego', 'LEGO Classic Creative Brick Box', 'Juguetes', 34.99, '/target/lego.png'),
      m('air-fryer', 'Ninja Air Fryer 4qt', 'Hogar', 89.99, '/target/air-fryer.png'),
      m('cardigan', 'Universal Thread Cardigan', 'Ropa', 28, '/target/cardigan.png'),
    ],
  },
  'bath-and-body-works': {
    slug: 'bath-and-body-works',
    name: 'Bath & Body Works',
    tagline: 'Fragancias y cuidado personal',
    website: 'https://www.bathandbodyworks.com',
    searchUrl: 'https://www.bathandbodyworks.com/search?q=',
    facade: '/storefronts/bath-body-works.png',
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Aroma',
    categories: ['Todos', 'Cuerpo', 'Hogar'],
    models: [
      m('candle', '3-Wick Candle', 'Hogar', 26.95, '/bath-and-body-works/3-wick-candle.png'),
      m('mist', 'Fine Fragrance Mist', 'Cuerpo', 18.95, '/bath-and-body-works/fragrance-mist.png'),
      m('body-cream', 'Ultimate Hydration Body Cream', 'Cuerpo', 18.95, '/bath-and-body-works/body-cream.png'),
      m('hand-soap', 'Gentle & Clean Foaming Hand Soap', 'Hogar', 8.95, '/bath-and-body-works/hand-soap.png'),
      m('wallflowers', 'Wallflowers Fragrance Refill', 'Hogar', 7.95, '/bath-and-body-works/wallflowers.png'),
      m('shower-gel', 'Shower Gel', 'Cuerpo', 16.95, '/bath-and-body-works/shower-gel.png'),
    ],
  },
  lululemon: {
    slug: 'lululemon',
    name: 'Lululemon',
    tagline: 'Activewear premium',
    website: 'https://shop.lululemon.com',
    searchUrl: 'https://shop.lululemon.com/search?Ntt=',
    facade: '/storefronts/lululemon.png',
    sizeLabel: 'Talla',
    sizes: CLOTHING_SIZES,
    colorLabel: 'Color',
    categories: ['Todos', 'Mujer', 'Hombre', 'Accesorios'],
    models: [
      m('align', 'Align High-Rise Pant 25"', 'Mujer', 98, '/lululemon/align-pant.png'),
      m('define', 'Define Jacket Nulu', 'Mujer', 118, '/lululemon/define-jacket.png'),
      m('scuba', 'Scuba Oversized Half-Zip Hoodie', 'Mujer', 118, '/lululemon/scuba-hoodie.png'),
      m('belt-bag', 'Everywhere Belt Bag 1L', 'Accesorios', 38, '/lululemon/belt-bag.png'),
      m('abc', 'ABC Classic-Fit Pant', 'Hombre', 128, '/lululemon/abc-pant.png'),
      m('swiftly', 'Swiftly Tech Short-Sleeve Shirt', 'Hombre', 78, '/lululemon/swiftly-tech.png'),
    ],
  },
  uniqlo: {
    slug: 'uniqlo',
    name: 'Uniqlo',
    tagline: 'Básicos de calidad japonesa',
    website: 'https://www.uniqlo.com/us/en/',
    searchUrl: 'https://www.uniqlo.com/us/en/search?q=',
    facade: null,
    sizeLabel: 'Talla',
    sizes: CLOTHING_SIZES,
    colorLabel: 'Color',
    categories: ['Todos', 'Camisetas', 'Abrigos', 'Pantalones'],
    models: [
      m('u-crew', 'U Crew Neck T-Shirt', 'Camisetas', 19.9, '/uniqlo/u-crew-tee.png'),
      m('airism', 'AIRism Cotton Crew Neck T-Shirt', 'Camisetas', 14.9, '/uniqlo/airism-tee.png'),
      m('down', 'Ultra Light Down Jacket', 'Abrigos', 69.9, '/uniqlo/ultra-light-down.png'),
      m('bra-top', 'Bra Top', 'Camisetas', 29.9, '/uniqlo/bra-top.png'),
      m('wide-jeans', 'Wide Fit Jeans', 'Pantalones', 39.9, '/uniqlo/wide-fit-jeans.png'),
      m('supima', 'Supima Cotton Long Sleeve', 'Camisetas', 29.9, '/uniqlo/supima-long-sleeve.png'),
    ],
  },
  macys: {
    slug: 'macys',
    name: "Macy's",
    tagline: 'Moda, belleza y hogar',
    website: 'https://www.macys.com',
    searchUrl: 'https://www.macys.com/shop/search?keyword=',
    facade: null,
    sizeLabel: 'Talla',
    sizes: CLOTHING_SIZES,
    colorLabel: 'Color',
    categories: ['Todos', 'Moda', 'Belleza', 'Hogar'],
    models: [
      m('satin-dress', 'INC Satin Midi Dress', 'Moda', 89.5, '/macys/satin-dress.png'),
      m('mk-crossbody', 'Michael Kors Jet Set Crossbody', 'Moda', 128, '/macys/mk-crossbody.png'),
      m('levis-501', "Levi's 501 Original Fit Jeans", 'Moda', 79.5, '/macys/levis-501.png'),
      m('ralph-polo', 'Polo Ralph Lauren Classic Fit Polo', 'Moda', 110, '/macys/ralph-polo.png'),
      m('good-girl', 'Carolina Herrera Good Girl EDP', 'Belleza', 135, '/macys/good-girl.png'),
      m('hotel-towel', 'Hotel Collection Cotton Towel', 'Hogar', 34, '/macys/hotel-towel.png'),
    ],
  },
  carters: {
    slug: 'carters',
    name: "Carter's",
    tagline: 'Ropa de bebés y niños',
    website: 'https://www.carters.com',
    searchUrl: 'https://www.carters.com/search?q=',
    facade: null,
    sizeLabel: 'Talla / Edad',
    sizes: ['0-3M', '3-6M', '6-9M', '12M', '18M', '2T', '3T', '4T'],
    colorLabel: 'Color',
    categories: ['Todos', 'Bebé', 'Niños'],
    models: [
      m('bodysuits', 'Baby 5-Pack Bodysuits', 'Bebé', 24, '/carters/bodysuits.png'),
      m('pant-set', 'Baby 2-Piece Bodysuit & Pant Set', 'Bebé', 20, '/carters/pant-set.png'),
      m('pajamas', 'Toddler 4-Piece Cotton Pajamas', 'Niños', 26, '/carters/pajamas.png'),
      m('sleep-play', 'Baby Zip-Up Sleep & Play', 'Bebé', 16, '/carters/sleep-play.png'),
      m('ruffle-dress', 'Kid Floral Ruffle Dress', 'Niños', 22, '/carters/ruffle-dress.png'),
      m('booties', 'Baby 3-Pack Socks & Booties', 'Bebé', 12, '/carters/booties.png'),
    ],
  },
  etsy: {
    slug: 'etsy',
    name: 'Etsy',
    tagline: 'Hecho a mano y personalizado',
    website: 'https://www.etsy.com',
    searchUrl: 'https://www.etsy.com/search?q=',
    facade: null,
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Color / Personalización',
    categories: ['Todos', 'Joyería', 'Hogar', 'Regalos'],
    models: [
      m('name-necklace', 'Personalized Name Necklace', 'Joyería', 35, '/etsy/name-necklace.png'),
      m('pet-portrait', 'Custom Pet Portrait', 'Regalos', 45, '/etsy/pet-portrait.png'),
      m('soy-candle', 'Handmade Soy Candle', 'Hogar', 22, '/etsy/soy-candle.png'),
      m('gold-rings', 'Vintage Gold Rings Set', 'Joyería', 28, '/etsy/gold-rings.png'),
      m('crochet', 'Crochet Plush Toys', 'Regalos', 30, '/etsy/crochet-plush.png'),
      m('tumbler', 'Custom Engraved Tumbler', 'Regalos', 25, '/etsy/engraved-tumbler.png'),
    ],
  },
  shop: {
    slug: 'shop',
    name: 'Shop',
    tagline: 'Miles de marcas USA en un solo lugar',
    website: 'https://shop.app',
    searchUrl: 'https://shop.app/search/results?query=',
    facade: null,
    sizeLabel: null,
    sizes: [],
    colorLabel: 'Talla / Color',
    categories: ['Todos', 'Moda', 'Belleza', 'Hogar'],
    models: [
      m('allbirds', 'Allbirds Tree Runners', 'Moda', 98, '/shop/allbirds.png'),
      m('gymshark', 'Gymshark Vital Seamless Leggings', 'Moda', 58, '/shop/gymshark.png'),
      m('lip-kit', 'Kylie Cosmetics Lip Kit', 'Belleza', 32, '/shop/lip-kit.png'),
      m('sheets', 'Brooklinen Luxe Sheet Set', 'Hogar', 185, '/shop/sheets.png'),
      m('owala', 'Owala FreeSip Bottle 24oz', 'Hogar', 27.99, '/shop/owala.png'),
      m('skims', 'Skims Fits Everybody T-Shirt', 'Moda', 48, '/shop/skims-tee.png'),
    ],
  },
}

export const modelUrl = (store: StoreConfig, model: StoreModel) => store.searchUrl + encodeURIComponent(model.name)

export const formatUSD = (usd: number) => `US$ ${Number.isInteger(usd) ? usd : usd.toFixed(2)}`

export const toRD = (usd: number) => `RD$ ${Math.round(usd * RD_RATE).toLocaleString('en-US')}`
