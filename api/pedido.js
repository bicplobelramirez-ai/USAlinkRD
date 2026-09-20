import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Falta el id del pedido' })
  }

  try {
    const { data, error } = await supabase
      .from('Pedidos')
      .select('Nombre_cliente, Tienda, Nombre_Producto, Talla_Color, Precio_usd, Total_usd, Estado')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    return res.status(200).json({ pedido: data })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
