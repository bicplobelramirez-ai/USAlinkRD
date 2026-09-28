import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "INC International Concepts Satin Midi Dress", precio: "$89.50", imagen: "/macys/satin-dress.png" },
  { id: 2, nombre: "Michael Kors Jet Set Crossbody", precio: "$128", imagen: "/macys/mk-crossbody.png" },
  { id: 3, nombre: "Levi's 501 Original Fit Jeans", precio: "$79.50", imagen: "/macys/levis-501.png" },
  { id: 4, nombre: "Polo Ralph Lauren Classic Fit Polo", precio: "$110", imagen: "/macys/ralph-polo.png" },
  { id: 5, nombre: "Carolina Herrera Good Girl EDP", precio: "$135", imagen: "/macys/good-girl.png" },
  { id: 6, nombre: "Hotel Collection Egyptian Cotton Towel", precio: "$34", imagen: "/macys/hotel-towel.png" },
]

export default function MacysPage() {
  return (
    <VitrinaStore
      tienda="Macy's"
      slogan="Moda, belleza y hogar desde USA"
      officialUrl="https://www.macys.com"
      linkPlaceholder="https://www.macys.com/shop/..."
      brandColor="#e11d48"
      productos={productos}
      sizeLabel="Talla"
    />
  )
}
