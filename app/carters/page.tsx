import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Carter's | USALINK", description: "Compra en Carter's desde República Dominicana con USALINK." }

export default function Page() {
  return <StorePage store={stores['carters']} />
}
