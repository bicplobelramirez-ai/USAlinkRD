// screens/auth/Register.jsx
import { useState } from "react";
import { supabase } from "../../App";

export default function Register({ onLogin }) {
  const [step, setStep]         = useState(1); // 1=datos, 2=verificar
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Crear usuario en Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Crear perfil en tabla users
    if (data.user) {
      await supabase.from("users").upsert({
        id:        data.user.id,
        email,
        full_name: fullName,
        phone,
        plan:      "guest"
      });
    }

    setStep(2);
    setLoading(false);
  }

  if (step === 2) return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ fontSize:48, textAlign:"center", marginBottom:16 }}>🎉</div>
        <div style={styles.title}>¡Cuenta creada!</div>
        <div style={styles.sub}>
          Revisa tu email <strong style={{ color:"#4a8fff" }}>{email}</strong> y
          confirma tu cuenta para empezar a comprar.
        </div>
        <div style={{
          background:"rgba(76,175,130,0.1)", border:"1px solid rgba(76,175,130,0.2)",
          borderRadius:12, padding:"12px 14px", marginTop:16,
          fontSize:12, color:"#4caf82"
        }}>
          ✅ Una vez confirmado podrás iniciar sesión
        </div>
        <button style={styles.btnPrimary} onClick={onLogin}>
          → Ir a iniciar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🔗</div>
        <div style={styles.logoText}>
          <span style={{ color:"#4a8fff" }}>USA</span>link
          <span style={{ color:"#ff3355", fontSize:14 }}>RD</span>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.title}>Crear cuenta</div>
        <div style={styles.sub}>Empieza a comprar en USA desde RD</div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <div style={styles.field}>
            <label style={styles.label}>Nombre completo</label>
            <input
              type="text"
              placeholder="Juan Rodríguez"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Teléfono (WhatsApp)</label>
            <input
              type="tel"
              placeholder="809-555-1234"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              minLength={8}
              required
            />
          </div>

          {/* Garantías */}
          <div style={styles.guarantees}>
            <div style={styles.gItem}>🛡️ Datos protegidos</div>
            <div style={styles.gItem}>🇩🇴 Servicio dominicano</div>
            <div style={styles.gItem}>✅ Sin tarjeta americana</div>
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? "Creando cuenta..." : "🚀 Crear mi cuenta gratis"}
          </button>
        </form>

        <div style={styles.loginRow}>
          ¿Ya tienes cuenta?{" "}
          <span style={styles.link} onClick={onLogin}>Inicia sesión</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight:"100vh", background:"#0d0d0d",
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    padding:"24px 16px"
  },
  logo: {
    display:"flex", flexDirection:"column",
    alignItems:"center", gap:8, marginBottom:24
  },
  logoIcon: {
    width:52, height:52, background:"#002D72", borderRadius:13,
    display:"flex", alignItems:"center", justifyContent:"center", fontSize:22
  },
  logoText: { fontWeight:700, fontSize:22, color:"white" },
  card: {
    width:"100%", maxWidth:360,
    background:"#161616", borderRadius:20,
    border:"1px solid rgba(255,255,255,0.07)",
    padding:"24px 20px"
  },
  title: { fontWeight:700, fontSize:20, color:"white", marginBottom:4, textAlign:"center" },
  sub: { fontSize:12, color:"#a0a2aa", textAlign:"center", marginBottom:20 },
  error: {
    background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)",
    borderRadius:10, padding:"10px 12px",
    fontSize:12, color:"#ff3355", marginBottom:14
  },
  field: { marginBottom:14 },
  label: {
    fontSize:11, color:"#a0a2aa", textTransform:"uppercase",
    letterSpacing:"0.8px", display:"block", marginBottom:6
  },
  input: {
    width:"100%", background:"#1e1e1e",
    border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:12, padding:"12px 14px",
    color:"white", fontSize:14, outline:"none",
    fontFamily:"inherit", boxSizing:"border-box"
  },
  guarantees: {
    display:"flex", gap:6, flexWrap:"wrap",
    marginBottom:16
  },
  gItem: {
    flex:1, minWidth:90,
    background:"rgba(74,143,255,0.08)",
    border:"1px solid rgba(74,143,255,0.15)",
    borderRadius:8, padding:"6px 8px",
    fontSize:10, color:"#a0a2aa", textAlign:"center"
  },
  btnPrimary: {
    width:"100%", padding:14, borderRadius:12,
    background:"#4a8fff", color:"white",
    fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
    boxShadow:"0 4px 14px rgba(74,143,255,0.3)"
  },
  loginRow: { textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16 },
  link: { color:"#4a8fff", cursor:"pointer", fontWeight:600 }
};
