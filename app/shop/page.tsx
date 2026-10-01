import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Shop | USALINK", description: 'Compra en Shop desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['shop']} />
}
