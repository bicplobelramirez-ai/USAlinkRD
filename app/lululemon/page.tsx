import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "lululemon Align High-Rise Pant 25\"", precio: "$98", imagen: "/lululemon/align-pant.png" },
  { id: 2, nombre: "Define Jacket Nulu", precio: "$118", imagen: "/lululemon/define-jacket.png" },
  { id: 3, nombre: "Scuba Oversized Half-Zip Hoodie", precio: "$118", imagen: "/lululemon/scuba-hoodie.png" },
  { id: 4, nombre: "Everywhere Belt Bag 1L", precio: "$38", imagen: "/lululemon/belt-bag.png" },
  { id: 5, nombre: "ABC Classic-Fit Pant (Hombre)", precio: "$128", imagen: "/lululemon/abc-pant.png" },
  { id: 6, nombre: "Swiftly Tech Short-Sleeve Shirt", precio: "$78", imagen: "/lululemon/swiftly-tech.png" },
]

export default function LululemonPage() {
  return (
    <VitrinaStore
      tienda="Lululemon"
      slogan="Activewear premium desde USA"
      officialUrl="https://shop.lululemon.com"
      linkPlaceholder="https://shop.lululemon.com/p/..."
      brandColor="#c8102e"
      productos={productos}
      sizeLabel="Talla"
    />
  )
}
