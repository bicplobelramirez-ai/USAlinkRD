import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "U Crew Neck Short-Sleeve T-Shirt", precio: "$19.90", imagen: "/uniqlo/u-crew-tee.png" },
  { id: 2, nombre: "AIRism Cotton Crew Neck T-Shirt", precio: "$14.90", imagen: "/uniqlo/airism-tee.png" },
  { id: 3, nombre: "Ultra Light Down Jacket", precio: "$69.90", imagen: "/uniqlo/ultra-light-down.png" },
  { id: 4, nombre: "Bra Top", precio: "$29.90", imagen: "/uniqlo/bra-top.png" },
  { id: 5, nombre: "Wide Fit Jeans", precio: "$39.90", imagen: "/uniqlo/wide-fit-jeans.png" },
  { id: 6, nombre: "Supima Cotton Long Sleeve", precio: "$29.90", imagen: "/uniqlo/supima-long-sleeve.png" },
]

export default function UniqloPage() {
  return (
    <VitrinaStore
      tienda="Uniqlo"
      slogan="Básicos de calidad japonesa desde USA"
      officialUrl="https://www.uniqlo.com/us/es/"
      linkPlaceholder="https://www.uniqlo.com/us/..."
      brandColor="#d7000f"
      productos={productos}
      sizeLabel="Talla"
    />
  )
}
