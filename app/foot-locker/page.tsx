import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Jordan Retro 4", precio: "$215", imagen: "/foot-locker/jordan-4.png" },
  { id: 2, nombre: "New Balance 550", precio: "$110", imagen: "/foot-locker/nb-550.png" },
  { id: 3, nombre: "adidas Samba OG", precio: "$100", imagen: "/foot-locker/samba.png" },
  { id: 4, nombre: "Nike Air Max 90", precio: "$130", imagen: "/foot-locker/air-max-90.png" },
  { id: 5, nombre: "Timberland 6\" Premium Boot", precio: "$210", imagen: "/foot-locker/timberland.png" },
  { id: 6, nombre: "Crocs Classic Clog", precio: "$49.99", imagen: "/foot-locker/crocs.png" },
]

export default function FootLockerPage() {
  return (
    <VitrinaStore
      tienda="Foot Locker"
      slogan="Los sneakers más buscados desde USA"
      officialUrl="https://www.footlocker.com"
      linkPlaceholder="https://www.footlocker.com/product/..."
      brandColor="#111111"
      productos={productos}
      sizeLabel="Talla (US)"
    />
  )
}
