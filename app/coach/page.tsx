import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: 'Coach Outlet | USALINK', description: 'Compra en Coach Outlet desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['coach-outlet']} />
}
