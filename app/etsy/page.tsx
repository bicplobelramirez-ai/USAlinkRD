import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Etsy | USALINK", description: 'Compra en Etsy desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['etsy']} />
}
