export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE = 'appSrCkBCihEkjQRE';
  const TABLE = 'tbl3ypuRZ6cnGICdP';
  const URL = `https://api.airtable.com/v0/${BASE}/${TABLE}`;
  const H = { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' };

  try {
    if (req.method === 'GET') {
      const r = await fetch(`${URL}?filterByFormula=AND({Activo})&sort[0][field]=Nombre`, { headers: H });
      const d = await r.json();
      return res.json(d.records || []);
    }

    if (req.method === 'POST') {
      const b = req.body;
      const r = await fetch(URL, {
        method: 'POST', headers: H,
        body: JSON.stringify({
          records: [{
            fields: {
              Nombre: b.nombre || '',
              Marca: b.marca || '',
              Categoria: b.categoria || 'Otro',
              Estado: b.estado || 'Nuevo',
              Precio: parseFloat(b.precio) || 0,
              Precio_Original: parseFloat(b.precioOriginal) || 0,
              Stock: parseInt(b.stock) || 0,
              Descripcion: b.descripcion || '',
              Atributos: b.atributos || '',
              Imagen: b.imagen || '',
              Activo: true
            }
          }]
        })
      });
      const d = await r.json();
      return res.json(d);
    }

    if (req.method === 'DELETE') {
      const id = req.query.id;
      const r = await fetch(`${URL}/${id}`, { method: 'DELETE', headers: H });
      const d = await r.json();
      return res.json(d);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

