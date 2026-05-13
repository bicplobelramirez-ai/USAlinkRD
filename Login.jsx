// screens/auth/Login.jsx
import { useState } from "react";
import { supabase } from "../../App";

export default function Login({ onRegister }) {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [sent, setSent]       = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handleMagicLink() {
    if (!email) { setError("Escribe tu email primero"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  if (sent) return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={{ fontSize:48, textAlign:"center", marginBottom:16 }}>📧</div>
        <div style={styles.title}>Revisa tu email</div>
        <div style={styles.sub}>
          Enviamos un link mágico a <strong style={{ color:"#4a8fff" }}>{email}</strong>.
          Tócalo para entrar sin contraseña.
        </div>
        <button style={styles.btnSecondary} onClick={() => setSent(false)}>
          ← Volver
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.wrap}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🔗</div>
        <div style={styles.logoText}>
          <span style={{ color:"#4a8fff" }}>USA</span>link
          <span style={{ color:"#ff3355", fontSize:14 }}>RD</span>
        </div>
        <div style={styles.logoSub}>Tu acceso a las mejores tiendas de USA</div>
      </div>

      <div style={styles.card}>
        <div style={styles.title}>Bienvenido de vuelta</div>
        <div style={styles.sub}>Inicia sesión en tu cuenta</div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
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
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? "Entrando..." : "🔑 Iniciar sesión"}
          </button>
        </form>

        <div style={styles.divider}>— o —</div>

        <button style={styles.btnMagic} onClick={handleMagicLink} disabled={loading}>
          ✨ Entrar con link mágico (sin contraseña)
        </button>

        <div style={styles.registerRow}>
          ¿No tienes cuenta?{" "}
          <span style={styles.link} onClick={onRegister}>Regístrate</span>
        </div>
      </div>

      {/* Flags */}
      <div style={{ textAlign:"center", fontSize:11, color:"#555866", marginTop:16 }}>
        🇩🇴 República Dominicana × 🇺🇸 USA
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
    alignItems:"center", gap:8, marginBottom:28
  },
  logoIcon: {
    width:56, height:56, background:"#002D72", borderRadius:14,
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:24, boxShadow:"0 8px 24px rgba(0,45,114,0.4)"
  },
  logoText: {
    fontWeight:700, fontSize:24, color:"white", letterSpacing:"-0.3px"
  },
  logoSub: { fontSize:11, color:"#555866", textAlign:"center" },
  card: {
    width:"100%", maxWidth:360,
    background:"#161616", borderRadius:20,
    border:"1px solid rgba(255,255,255,0.07)",
    padding:"24px 20px"
  },
  title: {
    fontWeight:700, fontSize:20, color:"white",
    marginBottom:4, textAlign:"center"
  },
  sub: {
    fontSize:12, color:"#a0a2aa",
    textAlign:"center", marginBottom:20
  },
  error: {
    background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)",
    borderRadius:10, padding:"10px 12px",
    fontSize:12, color:"#ff3355", marginBottom:14
  },
  field: { marginBottom:14 },
  label: { fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:"0.8px", display:"block", marginBottom:6 },
  input: {
    width:"100%", background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:12, padding:"12px 14px",
    color:"white", fontSize:14, outline:"none",
    fontFamily:"inherit", boxSizing:"border-box"
  },
  btnPrimary: {
    width:"100%", padding:14, borderRadius:12,
    background:"#4a8fff", color:"white",
    fontWeight:700, fontSize:14, border:"none", cursor:"pointer",
    marginTop:6, boxShadow:"0 4px 14px rgba(74,143,255,0.3)"
  },
  btnMagic: {
    width:"100%", padding:12, borderRadius:12,
    background:"rgba(124,58,237,0.12)",
    border:"1px solid rgba(124,58,237,0.25)",
    color:"#a855f7", fontWeight:600, fontSize:13,
    cursor:"pointer"
  },
  btnSecondary: {
    width:"100%", padding:12, borderRadius:12,
    background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)",
    color:"#a0a2aa", fontWeight:600, fontSize:13, cursor:"pointer",
    marginTop:12
  },
  divider: {
    textAlign:"center", color:"#555866", fontSize:12,
    margin:"16px 0"
  },
  registerRow: {
    textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16
  },
  link: { color:"#4a8fff", cursor:"pointer", fontWeight:600 }
};
