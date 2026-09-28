import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Baby 5-Pack Short-Sleeve Bodysuits", precio: "$24", imagen: "/carters/bodysuits.png" },
  { id: 2, nombre: "Baby 2-Piece Bodysuit & Pant Set", precio: "$20", imagen: "/carters/pant-set.png" },
  { id: 3, nombre: "Toddler 4-Piece Cotton Pajamas", precio: "$26", imagen: "/carters/pajamas.png" },
  { id: 4, nombre: "Baby Zip-Up Sleep & Play", precio: "$16", imagen: "/carters/sleep-play.png" },
  { id: 5, nombre: "Kid Floral Ruffle Dress", precio: "$22", imagen: "/carters/ruffle-dress.png" },
  { id: 6, nombre: "Baby 3-Pack Socks & Booties", precio: "$12", imagen: "/carters/booties.png" },
]

export default function CartersPage() {
  return (
    <VitrinaStore
      tienda="Carter's"
      slogan="Ropa de bebés y niños desde USA"
      officialUrl="https://www.carters.com"
      linkPlaceholder="https://www.carters.com/p/..."
      brandColor="#0284c7"
      productos={productos}
      sizeLabel="Talla / Edad"
    />
  )
}
