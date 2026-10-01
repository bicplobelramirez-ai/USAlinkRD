import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Nike | USALINK", description: 'Compra en Nike desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['nike']} />
}
