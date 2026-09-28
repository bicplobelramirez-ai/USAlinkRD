import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Stanley Quencher H2.0 Tumbler 40oz", precio: "$45", imagen: "/target/stanley.png" },
  { id: 2, nombre: "Apple AirPods (3rd Gen)", precio: "$169.99", imagen: "/target/airpods.png" },
  { id: 3, nombre: "Threshold Ceramic Table Lamp", precio: "$39.99", imagen: "/target/lamp.png" },
  { id: 4, nombre: "LEGO Classic Creative Brick Box", precio: "$34.99", imagen: "/target/lego.png" },
  { id: 5, nombre: "Ninja Air Fryer 4qt", precio: "$89.99", imagen: "/target/air-fryer.png" },
  { id: 6, nombre: "Universal Thread Cardigan", precio: "$28", imagen: "/target/cardigan.png" },
]

export default function TargetPage() {
  return (
    <VitrinaStore
      tienda="Target"
      slogan="Todo para tu hogar desde USA"
      officialUrl="https://www.target.com"
      linkPlaceholder="https://www.target.com/p/..."
      brandColor="#cc0000"
      productos={productos}
      sizeLabel="Talla / Modelo"
    />
  )
}
