import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Lululemon | USALINK", description: 'Compra en Lululemon desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['lululemon']} />
}
