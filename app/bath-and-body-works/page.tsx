import StorePage from '../components/store/StorePage'
import { stores } from '../components/store/storeData'

export const metadata = { title: "Bath 'bath-and-body-works | USALINK' Body Works | USALINK", description: 'Compra en Bath en bath-and-body-works desde Body Works desde República Dominicana con USALINK.' }

export default function Page() {
  return <StorePage store={stores['bath-and-body-works']} />
}
