import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      nombre_cliente,
      telefono,
      tienda,
      link_producto,
      nombre_producto,
      talla_color,
      precio_usd,
      total_rd,
      notas
    } = req.body

    const { data, error } = await supabase
      .from('Pedidos')
      .insert([{
        Nombre_cliente: nombre_cliente,
        Teléfono: telefono,
        Tienda: tienda,
        Link_Producto: link_producto,
        Nombre_Producto: nombre_producto,
        Talla_Color: talla_color,
        Precio_usd: precio_usd,
        Total_usd: total_rd,
        Estado: 'Nuevo',
        Notas: notas
      }])

    if (error) throw error

    return res.status(200).json({ success: true, data })

  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}