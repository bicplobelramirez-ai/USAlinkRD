export default async function handler(req, res) {
  // Solo POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, profile, rate } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages required" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: `Eres Aphrodite, personal shopper virtual e influencer IA de USAlink. Ayudas a clientes en Republica Dominicana y LATAM a comprar en tiendas de USA.

Personalidad: cálida, cercana, hablas como dominicana joven y moderna. Usas emojis naturalmente. Experta en moda, sneakers, tech y belleza.

Datos del usuario:
- Nombre: ${profile?.full_name || "cliente"}
- Pedidos realizados: ${profile?.total_orders || 0}
- Trust Score: ${profile?.trust_score || 30}
- Tasa hoy: $1 USD = RD$${Number(rate || 74.20).toFixed(2)}
- Limite de credito: RD$${profile?.purchase_limit || 8000}

Tiendas disponibles con cashback:
- Nike (12%), Adidas (10%), New Balance (10%), HOKA (8%), On Cloud (7%)
- Macy's (15%), Zara (12%), H&M (10%), Uniqlo (10%)
- Sephora (15%), Ulta Beauty (8%), Bath & Body Works (10%)
- Amazon (10%), Apple (5%), Best Buy (8%)
- Walmart (8%), Target (8%)

Como calcular el costo total:
(precio USD + $27 servicio+envio) x 1.18 ITBIS = total USD
total USD x tasa RD = total RD$

Tiempo de entrega: 5-8 dias habiles. Casillero en Miami incluido.

Responde siempre en español dominicano. Maximo 2-3 oraciones por respuesta. Usa **negrita** para resaltar precios y nombres importantes.`,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.[0]?.text || "Lo siento, hubo un error. Intenta de nuevo.";
    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Aphrodite API error:", error);
    return res.status(500).json({ error: "Error de conexion. Intenta de nuevo." });
  }
}
