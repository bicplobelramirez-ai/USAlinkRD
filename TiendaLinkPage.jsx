import { useState } from "react";
export default function TiendaLinkPage({ tienda, onBack, onContinue }) {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  const handlePegar = async () => {
    try {
      const texto = await navigator.clipboard.readText();
      setLink(texto);
      setError("");
    } catch (e) {
      setError("No pudimos leer el portapapeles. Pega el link manualmente.");
    }
  };

  const handleContinuar = () => {
    if (!link.trim()) {
      setError("Pega el link del producto antes de continuar.");
      return;
    }
    setError("");
    onContinue(link.trim());
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, color: "#081B4B" }}>
          ←
        </button>
        <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, color: "#081B4B" }}>
          {tienda.nombre}
        </span>
      </div>

      <div style={{ textAlign: "center", padding: "16px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>{tienda.icono || "🛍️"}</div>
        <p style={{ fontWeight: 600, fontSize: 16, color: "#081B4B", margin: "0 0 4px" }}>
          Comprar en {tienda.nombre}
        </p>
        <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.5 }}>
          Copia el link del producto que quieres y pégalo aquí abajo.
        </p>
      </div>

      <div style={{ padding: "0 20px 20px" }}>
        <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 6 }}>
          Link del producto
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            value={link}
            onChange={(e) => { setLink(e.target.value); setError(""); }}
            placeholder={`https://${tienda.dominio || "tienda.com"}/...`}
            style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13 }}
          />
          <button
            onClick={handlePegar}
            aria-label="Pegar link"
            style={{ padding: "0 14px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}
          >
            📋
          </button>
        </div>

        {error && (
          <p style={{ color: "#E31E24", fontSize: 12, marginTop: 6 }}>{error}</p>
        )}

        <button
          onClick={handleContinuar}
          style={{
            width: "100%",
            marginTop: 14,
            background: "#E31E24",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: 14,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Continuar →
        </button>

        <div style={{ display: "flex", gap: 8, marginTop: 14, padding: "10px 12px", background: "#f5f6fa", borderRadius: 8 }}>
          <span>ℹ️</span>
          <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.5 }}>
            Cotizamos tu producto por WhatsApp y creamos tu orden con el precio real.
          </p>
        </div>
      </div>
    </div>
  );
}
