import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "Allbirds Tree Runners", precio: "$98", imagen: "/shop/allbirds.png" },
  { id: 2, nombre: "Gymshark Vital Seamless Leggings", precio: "$58", imagen: "/shop/gymshark.png" },
  { id: 3, nombre: "Kylie Cosmetics Lip Kit", precio: "$32", imagen: "/shop/lip-kit.png" },
  { id: 4, nombre: "Brooklinen Luxe Sheet Set", precio: "$185", imagen: "/shop/sheets.png" },
  { id: 5, nombre: "Owala FreeSip Water Bottle 24oz", precio: "$27.99", imagen: "/shop/owala.png" },
  { id: 6, nombre: "Skims Fits Everybody T-Shirt", precio: "$48", imagen: "/shop/skims-tee.png" },
]

export default function ShopPage() {
  return (
    <VitrinaStore
      tienda="Shop"
      slogan="Miles de marcas USA en un solo lugar"
      officialUrl="https://shop.app"
      linkPlaceholder="https://shop.app/products/..."
      brandColor="#5a31f4"
      productos={productos}
    />
  )
}
