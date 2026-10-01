import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Target | USALINK", description: 'Compra en Target desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['target']} />
}
