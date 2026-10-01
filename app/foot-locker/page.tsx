import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Foot Locker | USALINK", description: 'Compra en Foot Locker desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['foot-locker']} />
}
