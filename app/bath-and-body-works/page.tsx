import VitrinaStore from "../components/VitrinaStore"

const productos = [
  { id: 1, nombre: "3-Wick Candle", precio: "$26.95", imagen: "/bath-and-body-works/3-wick-candle.png" },
  { id: 2, nombre: "Fine Fragrance Mist", precio: "$18.95", imagen: "/bath-and-body-works/fragrance-mist.png" },
  { id: 3, nombre: "Ultimate Hydration Body Cream", precio: "$18.95", imagen: "/bath-and-body-works/body-cream.png" },
  { id: 4, nombre: "Gentle & Clean Foaming Hand Soap", precio: "$8.95", imagen: "/bath-and-body-works/hand-soap.png" },
  { id: 5, nombre: "Wallflowers Fragrance Refill", precio: "$7.95", imagen: "/bath-and-body-works/wallflowers.png" },
  { id: 6, nombre: "Shower Gel", precio: "$16.95", imagen: "/bath-and-body-works/shower-gel.png" },
]

export default function BathAndBodyWorksPage() {
  return (
    <VitrinaStore
      tienda="Bath & Body Works"
      slogan="Fragancias y cuidado desde USA"
      officialUrl="https://www.bathandbodyworks.com"
      linkPlaceholder="https://www.bathandbodyworks.com/p/..."
      brandColor="#0058a3"
      productos={productos}
      colorLabel="Aroma"
    />
  )
}
