import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Rare Beauty Soft Pinch Liquid Blush", precio: "$23", imagen: "/sephora/rare-beauty-blush.png" },
  { id: 2, nombre: "Dior Lip Oil", precio: "$40", imagen: "/sephora/dior-lip-oil.png" },
  { id: 3, nombre: "Charlotte Tilbury Flawless Filter", precio: "$49", imagen: "/sephora/flawless-filter.png" },
  { id: 4, nombre: "Sol de Janeiro Brazilian Bum Bum Cream", precio: "$48", imagen: "/sephora/bum-bum-cream.png" },
  { id: 5, nombre: "Supergoop! Unseen Sunscreen SPF 40", precio: "$38", imagen: "/sephora/unseen-sunscreen.png" },
  { id: 6, nombre: "Fenty Beauty Gloss Bomb", precio: "$21", imagen: "/sephora/gloss-bomb.png" },
]

export default function SephoraPage() {
  return (
    <VitrinaStore
      tienda="Sephora"
      slogan="Maquillaje y skincare original desde USA"
      officialUrl="https://www.sephora.com"
      linkPlaceholder="https://www.sephora.com/..."
      brandColor="#111111"
      productos={productos}
      colorLabel="Tono / Color"
    />
  )
}
