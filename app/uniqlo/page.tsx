import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Uniqlo | USALINK", description: 'Compra en Uniqlo desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['uniqlo']} />
}
