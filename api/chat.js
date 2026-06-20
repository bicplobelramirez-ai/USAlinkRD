export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system, max_tokens } = req.body;

    // Probamos varias variantes del nombre de la variable,
    // porque el navegador del tablet a veces traduce el nombre al guardarlo en Vercel.
    const apiKey =
      process.env.ANTHROPIC_API_KEY ||
      process.env.CLAVE_API_ANTRÓPICA ||
      process.env["CLAVE_API_ANTRÓPICA"] ||
      process.env.CLAVE_API_ANTROPICA ||
      "";

    if (!apiKey) {
      return res.status(200).json({
        content: [{ type: "text", text: "⚠️ DEBUG: No se encontró ninguna variable de API key (probé ANTHROPIC_API_KEY y CLAVE_API_ANTRÓPICA)." }]
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 600,
        system: system || "Eres Aphrodite, asistente de USALINK.",
        messages: messages || [],
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return res.status(200).json({
        content: [{
          type: "text",
          text: `⚠️ DEBUG: Anthropic respondió con error (status ${response.status}): ${JSON.stringify(data.error || data)}`
        }]
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      content: [{ type: "text", text: `⚠️ DEBUG: Error interno: ${error.message}` }]
    });
  }
}
