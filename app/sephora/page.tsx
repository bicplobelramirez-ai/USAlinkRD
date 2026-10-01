import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Sephora | USALINK", description: 'Compra en Sephora desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['sephora']} />
}
