import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Macy's | USALINK", description: "Compra en Macy's desde República Dominicana con USALINK." }

export default function Page() {
  return <StorePage store={stores['macys']} />
}
