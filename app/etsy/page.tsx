import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Personalized Name Necklace Gold", precio: "$35", imagen: "/etsy/name-necklace.png" },
  { id: 2, nombre: "Custom Pet Portrait", precio: "$45", imagen: "/etsy/pet-portrait.png" },
  { id: 3, nombre: "Handmade Soy Candle", precio: "$22", imagen: "/etsy/soy-candle.png" },
  { id: 4, nombre: "Vintage Gold Rings Set", precio: "$28", imagen: "/etsy/gold-rings.png" },
  { id: 5, nombre: "Crochet Plush Toys", precio: "$30", imagen: "/etsy/crochet-plush.png" },
  { id: 6, nombre: "Custom Engraved Tumbler", precio: "$25", imagen: "/etsy/engraved-tumbler.png" },
]

export default function EtsyPage() {
  return (
    <VitrinaStore
      tienda="Etsy"
      slogan="Hecho a mano y personalizado desde USA"
      officialUrl="https://www.etsy.com"
      linkPlaceholder="https://www.etsy.com/listing/..."
      brandColor="#c2410c"
      productos={productos}
      sizeLabel="Talla / Medida"
      colorLabel="Color / Personalización"
    />
  )
}
