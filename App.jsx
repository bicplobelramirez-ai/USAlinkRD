import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL  = "https://kugdrwxthmcscrvlszws.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z2Ryd3h0aG1jc2NydmxzendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDU4NjIsImV4cCI6MjA5NDEyMTg2Mn0.G4qXcDgoLvarYC8fvr5TrkiigvKBXRxVYOXiauyADic";
export const sb = createClient(SUPA_URL, SUPA_ANON);

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);
const RateCtx = createContext(75);
const useRate = () => useContext(RateCtx);

// ── TRUST SCORE CALCULATOR ─────────────────────────────────────
// Fórmula: base 30 (registro) + KYC 25 + pedidos completados (hasta 30) + sin disputas (15)
function calcTrustScore(profile) {
  let score = 30; // base por estar registrado
  if (profile?.kyc_verified) score += 25;
  const completed = Math.min(profile?.total_orders || 0, 10);
  score += completed * 3; // hasta 30 puntos por pedidos
  if ((profile?.disputes || 0) === 0) score += 15;
  else if ((profile?.disputes || 0) === 1) score += 7;
  return Math.min(score, 100);
}

function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) await loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);
  async function loadProfile(id) {
    const { data } = await sb.from("users").select("*").eq("id", id).single();
    if (data) {
      // Calcular trust score dinámico y guardarlo
      const ts = calcTrustScore(data);
      if (ts !== data.trust_score) {
        await sb.from("users").update({ trust_score: ts }).eq("id", id);
        data.trust_score = ts;
      }
    }
    setProfile(data); setLoading(false);
  }
  async function signOut() { await sb.auth.signOut(); setUser(null); setProfile(null); }

  async function uploadAvatar(file) {
    if (!user) return null;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await sb.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { console.error(upErr); return null; }
    const { data } = sb.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl + "?t=" + Date.now();
    await sb.from("users").update({ avatar_url: url }).eq("id", user.id);
    setProfile(prev => ({ ...prev, avatar_url: url }));
    return url;
  }

  return <AuthCtx.Provider value={{ user, profile, loading, signOut, loadProfile, uploadAvatar }}>{children}</AuthCtx.Provider>;
}

function RateProvider({ children }) {
  const [rate, setRate] = useState(75);
  useEffect(() => {
    sb.from("exchange_rates").select("rate").order("recorded_at", { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data) setRate(Number(data.rate)); });
  }, []);
  return <RateCtx.Provider value={rate}>{children}</RateCtx.Provider>;
}

const GS = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Clash+Display:wght@500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
body{background:#0a0e1a;font-family:'DM Sans',sans-serif;color:#f0f0f0;}
::-webkit-scrollbar{display:none;}input::placeholder{color:#555866;}
button{font-family:'DM Sans',sans-serif;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes fadeDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(240,180,41,0.5),0 0 40px rgba(200,140,40,0.2)}50%{box-shadow:0 0 32px rgba(255,200,80,0.8)}}
@keyframes typingDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
@keyframes shimmerGold{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}`;

const btnP = { padding:"10px 16px", borderRadius:11, background:"#4a8fff", color:"white", fontWeight:700, fontSize:11, border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(74,143,255,0.3)" };
const btnS = { padding:"10px 16px", borderRadius:11, background:"#1e293b", color:"#a0a2aa", fontWeight:700, fontSize:11, border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer" };
const inp  = { width:"100%", background:"#1e293b", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"13px 14px", color:"#f0f0f0", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

// ── AVATAR UPLOADER ───────────────────────────────────────────
function AvatarUploader({ avatarUrl, size = 115 }) {
  const { uploadAvatar } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(avatarUrl);
  const fileRef = useRef(null);

  useEffect(() => { setPreview(avatarUrl); }, [avatarUrl]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview instantáneo
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
  }

  return (
    <div style={{ position:"relative", width:size, height:size }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
      <div style={{ width:size, height:size, borderRadius:"50%", border:"3px solid rgba(99,179,237,0.7)", background:"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", boxShadow:"0 0 0 5px rgba(74,143,255,0.12), 0 8px 32px rgba(0,0,0,0.6)" }}>
        {preview
          ? <img src={preview} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          : <svg viewBox="0 0 80 80" width={size * 0.62} height={size * 0.62} fill="none"><circle cx="40" cy="28" r="17" fill="#334155" /><ellipse cx="40" cy="70" rx="27" ry="18" fill="#334155" /></svg>
        }
      </div>
      {/* Botón cámara */}
      <div onClick={() => !uploading && fileRef.current?.click()} style={{ position:"absolute", bottom:4, right:4, width:30, height:30, borderRadius:"50%", background: uploading ? "#334155" : "#4a8fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, boxShadow:"0 2px 10px rgba(0,0,0,0.5)", cursor: uploading ? "default" : "pointer", border:"2px solid #0a0e1a", transition:"background .2s" }}>
        {uploading
          ? <div style={{ width:12, height:12, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid white", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
          : "📷"
        }
      </div>
    </div>
  );
}

const COUNTRY_MAP = { DO:"RD", AR:"ARG", MX:"MX", CO:"COL", PE:"PE", CL:"CHL", VE:"VE", EC:"EC", BO:"BOL", UY:"UY", PY:"PY", GT:"GT", HN:"HN", CR:"CR", PA:"PA" };
const COUNTRY_NAMES = { DO:"República Dominicana 🇩🇴", AR:"Argentina 🇦🇷", MX:"México 🇲🇽", CO:"Colombia 🇨🇴", PE:"Perú 🇵🇪", CL:"Chile 🇨🇱", VE:"Venezuela 🇻🇪" };

const NAV = [
  { id:"home", label:"Inicio", icon:"🏠" },
  { id:"stores", label:"Tiendas", icon:"🏪" },
  { id:"neworder", label:"Pedir", icon:"➕" },
  { id:"orders", label:"Pedidos", icon:"📦" },
  { id:"profile", label:"Perfil", icon:"◎" },
];

function BottomNav({ screen, onNav }) {
  return (
    <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:390, zIndex:200, padding:"0 14px 22px" }}>
      <div style={{ background:"rgba(10,14,26,0.97)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, display:"flex", padding:5, boxShadow:"0 -2px 30px rgba(0,0,0,0.6)" }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer", padding:"8px 0", borderRadius:14, border:"none", background: screen === item.id ? "rgba(74,143,255,0.10)" : "transparent" }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ fontSize:8, textTransform:"uppercase", letterSpacing:"0.4px", fontWeight: screen === item.id ? 700 : 500, color: screen === item.id ? "#4a8fff" : "#555866" }}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function Splash() {
  return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <style>{GS}</style>
      <div style={{ width:64, height:64, background:"#002D72", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🔗</div>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white" }}>
        <span style={{ color:"#4a8fff" }}>USA</span>link
      </div>
      <div style={{ width:32, height:32, border:"2px solid rgba(74,143,255,0.2)", borderTop:"2px solid #4a8fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );
}

function Login({ onRegister }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  async function handleLogin(e) { e.preventDefault(); setLoading(true); setError(""); const { error } = await sb.auth.signInWithPassword({ email, password }); if (error) setError(error.message); setLoading(false); }
  async function handleMagic() { if (!email) { setError("Escribe tu email primero"); return; } setLoading(true); const { error } = await sb.auth.signInWithOtp({ email }); if (error) setError(error.message); else setSent(true); setLoading(false); }
  if (sent) return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ background:"#161b2e", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 22px", maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>📧</div>
        <div style={{ fontWeight:700, fontSize:18, color:"white", marginBottom:8 }}>Revisa tu email</div>
        <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:20, lineHeight:1.6 }}>Link mágico enviado a <strong style={{ color:"#4a8fff" }}>{email}</strong></div>
        <button onClick={() => setSent(false)} style={{ ...btnS, width:"100%" }}>← Volver</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <style>{GS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:28 }}>
        <div style={{ width:56, height:56, background:"#002D72", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🔗</div>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:24, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link</div>
        <div style={{ fontSize:11, color:"#555866" }}>Tu acceso a las mejores tiendas de USA</div>
      </div>
      <div style={{ background:"#161b2e", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"white", textAlign:"center", marginBottom:4 }}>Bienvenido de vuelta</div>
        <div style={{ fontSize:12, color:"#a0a2aa", textAlign:"center", marginBottom:20 }}>Inicia sesión en tu cuenta</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355", marginBottom:14 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}><label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Email</label><input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} required /></div>
          <div style={{ marginBottom:14 }}><label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Contraseña</label><input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inp} required /></div>
          <button type="submit" style={{ ...btnP, width:"100%", opacity:loading ? 0.7 : 1 }} disabled={loading}>{loading ? "Entrando..." : "🔑 Iniciar sesión"}</button>
        </form>
        <div style={{ textAlign:"center", color:"#555866", fontSize:12, margin:"16px 0" }}>— o —</div>
        <button onClick={handleMagic} style={{ width:"100%", padding:"10px 16px", borderRadius:11, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", color:"#a855f7", fontWeight:600, fontSize:13, cursor:"pointer" }} disabled={loading}>✨ Entrar con link mágico</button>
        <div style={{ textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16 }}>¿No tienes cuenta?{" "}<span onClick={onRegister} style={{ color:"#4a8fff", cursor:"pointer", fontWeight:600 }}>Regístrate</span></div>
      </div>
    </div>
  );
}

function Register({ onLogin }) {
  const [fullName, setFullName] = useState(""); const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [done, setDone] = useState(false);
  async function handleRegister(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: authError } = await sb.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) await sb.from("users").upsert({ id: data.user.id, email, full_name: fullName, phone, plan: "guest", trust_score: 30 });
    setDone(true); setLoading(false);
  }
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ background:"#161b2e", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 22px", maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🎉</div>
        <div style={{ fontWeight:700, fontSize:20, color:"white", marginBottom:8 }}>¡Cuenta creada!</div>
        <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:16, lineHeight:1.6 }}>Revisa tu email <strong style={{ color:"#4a8fff" }}>{email}</strong></div>
        <button onClick={onLogin} style={{ ...btnP, width:"100%" }}>→ Iniciar sesión</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <style>{GS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:24 }}>
        <div style={{ width:52, height:52, background:"#002D72", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔗</div>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link</div>
      </div>
      <div style={{ background:"#161b2e", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"white", textAlign:"center", marginBottom:4 }}>Crear cuenta</div>
        <div style={{ fontSize:12, color:"#a0a2aa", textAlign:"center", marginBottom:20 }}>Empieza a comprar en USA desde RD</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355", marginBottom:14 }}>{error}</div>}
        <form onSubmit={handleRegister}>
          {[
            { label:"Nombre completo", ph:"Juan Rodríguez", val:fullName, set:setFullName, type:"text" },
            { label:"Teléfono", ph:"809-555-1234", val:phone, set:setPhone, type:"tel" },
            { label:"Email", ph:"tu@email.com", val:email, set:setEmail, type:"email" },
            { label:"Contraseña", ph:"Mínimo 8 chars", val:password, set:setPassword, type:"password" },
          ].map((f,i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inp} required={f.type !== "tel"} />
            </div>
          ))}
          <button type="submit" style={{ ...btnP, width:"100%", opacity:loading ? 0.7 : 1 }} disabled={loading}>{loading ? "Creando..." : "🚀 Crear mi cuenta gratis"}</button>
        </form>
        <div style={{ textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16 }}>¿Ya tienes cuenta?{" "}<span onClick={onLogin} style={{ color:"#4a8fff", cursor:"pointer", fontWeight:600 }}>Inicia sesión</span></div>
      </div>
    </div>
  );
}

const BRAND = {
  macys:{ bg:"linear-gradient(145deg,#2a0808,#1a0404,#3a0e0e)", color:"#f0a0a0" },
  zara:{ bg:"linear-gradient(145deg,#0e0e0e,#080808,#161616)", color:"rgba(255,255,255,.85)" },
  nordstrom:{ bg:"linear-gradient(145deg,#181820,#101018,#201f2a)", color:"rgba(190,205,255,.8)" },
  hm:{ bg:"linear-gradient(145deg,#280008,#1e0005,#360010)", color:"#ff7090" },
  uniqlo:{ bg:"linear-gradient(145deg,#1a0000,#120000,#240000)", color:"#ff4444" },
  forever21:{ bg:"linear-gradient(145deg,#1c0a14,#140810,#240f1c)", color:"rgba(255,170,195,.8)" },
  ralph:{ bg:"linear-gradient(145deg,#00102a,#000a1e,#001838)", color:"rgba(150,195,255,.8)" },
  tommy:{ bg:"linear-gradient(145deg,#1a0008,#100005,#22000c)", color:"rgba(255,210,215,.8)" },
  ae:{ bg:"linear-gradient(145deg,#0a1825,#060f1a,#102030)", color:"rgba(130,185,255,.8)" },
  oldnavy:{ bg:"linear-gradient(145deg,#001840,#000f28,#002050)", color:"rgba(100,165,255,.8)" },
  levis:{ bg:"linear-gradient(145deg,#1a0005,#120003,#220008)", color:"#ff6680" },
  nike:{ bg:"linear-gradient(145deg,#060606,#040404,#0a0a0a)", color:"rgba(255,255,255,.95)" },
  adidas:{ bg:"linear-gradient(145deg,#0c1000,#080b00,#141800)", color:"rgba(200,220,0,.9)" },
  nb:{ bg:"linear-gradient(145deg,#0c0018,#080012,#120022)", color:"rgba(175,135,255,.9)" },
  hoka:{ bg:"linear-gradient(145deg,#000612,#00040d,#000e1e)", color:"rgba(195,225,0,.9)" },
  on:{ bg:"linear-gradient(145deg,#1e0400,#160300,#280600)", color:"rgba(255,135,95,.9)" },
  reebok:{ bg:"linear-gradient(145deg,#0e001e,#090015,#140028)", color:"rgba(195,155,255,.85)" },
  vans:{ bg:"linear-gradient(145deg,#1c0010,#140008,#240018)", color:"rgba(255,150,200,.85)" },
  footlocker:{ bg:"linear-gradient(145deg,#1e0000,#160000,#280000)", color:"rgba(255,100,100,.85)" },
  brooks:{ bg:"linear-gradient(145deg,#001a18,#001210,#002220)", color:"rgba(100,220,200,.85)" },
  sephora:{ bg:"linear-gradient(145deg,#080808,#050505,#0e0e0e)", color:"rgba(255,255,255,.85)" },
  bathandbody:{ bg:"linear-gradient(145deg,#001a08,#000f05,#002210)", color:"rgba(155,215,155,.85)" },
  ulta:{ bg:"linear-gradient(145deg,#180020,#100018,#200028)", color:"rgba(255,95,175,.9)" },
  bestbuy:{ bg:"linear-gradient(145deg,#000820,#000518,#001030)", color:"#ffe000" },
  apple:{ bg:"linear-gradient(145deg,#141414,#0e0e0e,#1a1a1a)", color:"rgba(255,255,255,.8)" },
  amazon:{ bg:"linear-gradient(145deg,#0a1020,#060c18,#101828)", color:"#ff9900" },
  ikea:{ bg:"linear-gradient(145deg,#002060,#001840,#003080)", color:"#ffe000" },
  target:{ bg:"linear-gradient(145deg,#200000,#180000,#2a0000)", color:"#ff6060" },
  walmart:{ bg:"linear-gradient(145deg,#001535,#000e25,#002050)", color:"#ffc220" },
  kohls:{ bg:"linear-gradient(145deg,#0a0020,#060015,#100030)", color:"rgba(100,100,255,.9)" },
  wayfair:{ bg:"linear-gradient(145deg,#1a0830,#100520,#220a40)", color:"rgba(200,140,255,.85)" },
  dicks:{ bg:"linear-gradient(145deg,#001030,#000820,#001840)", color:"rgba(100,165,255,.85)" },
  rei:{ bg:"linear-gradient(145deg,#001a08,#001205,#002210)", color:"rgba(130,215,130,.85)" },
  gnc:{ bg:"linear-gradient(145deg,#1e0800,#160500,#280a00)", color:"rgba(255,140,80,.85)" },
  patagonia:{ bg:"linear-gradient(145deg,#001818,#001010,#002020)", color:"rgba(100,220,180,.85)" },
  columbia:{ bg:"linear-gradient(145deg,#000e30,#000820,#001540)", color:"rgba(100,180,255,.85)" },
};

function Tile({ slug, name, cb, hot }) {
  const b = BRAND[slug] || { bg:"linear-gradient(145deg,#161b2e,#1e293b)", color:"#a0a2aa" };
  return (
    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", width:72 }}>
      <div style={{ width:64, height:64, borderRadius:15, background:b.bg, border:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,.5)" }}>
        {hot && <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#ff3355", border:"1.5px solid rgba(255,255,255,.15)", zIndex:5, animation:"pulse 2s infinite" }}/>}
        <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:b.color, textAlign:"center", lineHeight:1.3, padding:"0 4px", zIndex:2, position:"relative" }}>{name}</span>
        <div style={{ position:"absolute", bottom:5, left:0, right:0, textAlign:"center", fontFamily:"'Clash Display',sans-serif", fontSize:7, fontWeight:700, color:b.color, opacity:.4, zIndex:2 }}>{cb}% CB</div>
        <div style={{ position:"absolute", top:0, left:"-100%", width:"60%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)", animation:"shimmer 4s infinite", zIndex:3 }}/>
      </div>
      <div style={{ fontSize:8.5, color:"#a0a2aa", textAlign:"center", lineHeight:1.2, width:"100%" }}>{name}</div>
      <div style={{ fontSize:8, color:"#4caf82", textAlign:"center", fontWeight:600 }}>{cb}% cashback</div>
    </div>
  );
}

function Carousel({ onNav }) {
  const [cur, setCur] = useState(0);
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(8 * 3600 + 47 * 60 + 33);
  const intervalRef = useRef(null);
  const progressRef = useRef(0);
  useEffect(() => {
    const cd = setInterval(() => setCountdown(p => p > 0 ? p - 1 : 86400), 1000);
    return () => clearInterval(cd);
  }, []);
  const startInterval = (slide) => {
    clearInterval(intervalRef.current); progressRef.current = 0; setProgress(0);
    intervalRef.current = setInterval(() => {
      progressRef.current += 100 / 40; setProgress(Math.min(progressRef.current, 100));
      if (progressRef.current >= 100) { const next = (slide + 1) % 4; setCur(next); startInterval(next); }
    }, 100);
  };
  useEffect(() => { startInterval(0); return () => clearInterval(intervalRef.current); }, []);
  const goSlide = (n) => { setCur(n); startInterval(n); };
  const h = String(Math.floor(countdown / 3600)).padStart(2, "0");
  const m = String(Math.floor((countdown % 3600) / 60)).padStart(2, "0");
  const s = String(countdown % 60).padStart(2, "0");
  const CdBlock = ({ val }) => (
    <div style={{ background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:7, padding:"4px 8px", minWidth:30, textAlign:"center" }}>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, color:"white", lineHeight:1 }}>{val}</div>
    </div>
  );
  const SLIDES = [
    { bg:"linear-gradient(135deg,#0d001a,#1a0030,#000d1a)", glow1:"rgba(74,143,255,0.25)", glow2:"rgba(168,85,247,0.15)", eyebrow:"Solo hoy · Termina en", eyebrowColor:"rgba(74,143,255,.7)", showCd:true, title:<>Ofertas<br/><span style={{ color:"#4a8fff" }}>del día</span> 🔥</>, sub:"Hasta 28% OFF en tus marcas favoritas", btn:{ label:"Ver ofertas →", bg:"#4a8fff", shadow:"rgba(74,143,255,.4)", action:"stores" }, float:"🛍️", floatLabel:"FLASH DEALS", floatBg:"rgba(255,255,255,.08)", floatBorder:"rgba(255,255,255,.12)", floatColor:"rgba(255,255,255,.6)" },
    { bg:"linear-gradient(135deg,#0d0005,#1a0020,#000d1a)", glow1:"rgba(255,0,80,0.25)", glow2:"rgba(0,242,234,0.15)", eyebrow:"Nuevo servicio", eyebrowColor:"rgba(0,242,234,.65)", title:<>TikTok <span style={{ color:"#ff0050" }}>Shop</span><br/>en <span style={{ color:"#00f2ea" }}>RD</span> 🇩🇴</>, sub:"Ve el producto, pega el link — nosotros lo compramos", btn:{ label:"Pegar mi link →", bg:"#ff0050", shadow:"rgba(255,0,80,.4)", action:"neworder" }, float:"🎵", floatLabel:"TikTok Shop", floatBg:"rgba(255,0,80,.15)", floatBorder:"rgba(255,0,80,.3)", floatColor:"#ff0050" },
    { bg:"linear-gradient(135deg,#001020,#002040,#000810)", glow1:"rgba(74,143,255,0.3)", eyebrow:"Calzado Premium", eyebrowColor:"rgba(74,143,255,.65)", title:<>Nike, HOKA<br/><span style={{ color:"#4a8fff" }}>Adidas & más</span></>, sub:"Las mejores marcas de USA directo a RD", btn:{ label:"Ver calzado →", bg:"rgba(74,143,255,.15)", shadow:"transparent", action:"stores", border:"1px solid rgba(74,143,255,.3)", color:"#4a8fff" }, float:"👟", floatLabel:"12% CB", floatBg:"rgba(74,143,255,.15)", floatBorder:"rgba(74,143,255,.3)", floatColor:"#4a8fff" },
    { bg:"linear-gradient(135deg,#1a0800,#2a1000,#0d0500)", glow1:"rgba(235,105,31,0.3)", eyebrow:"Artesanal desde USA", eyebrowColor:"rgba(255,180,80,.65)", title:<><span style={{ color:"#eb691f" }}>Etsy</span> ahora<br/>llega a <span style={{ color:"#f0b429" }}>RD</span></>, sub:"Único, hecho a mano y personalizado", btn:{ label:"Explorar Etsy →", bg:"#eb691f", shadow:"rgba(235,105,31,.4)", action:"stores" }, float:"🧶", floatLabel:"NUEVO", floatBg:"rgba(235,105,31,.15)", floatBorder:"rgba(235,105,31,.3)", floatColor:"#eb691f" },
  ];
  const sl = SLIDES[cur];
  return (
    <div style={{ height:200, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:sl.bg, transition:"background .6s" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 70% 30%,${sl.glow1||"transparent"},transparent 55%)${sl.glow2?`,radial-gradient(circle at 20% 80%,${sl.glow2},transparent 45%)`:""}` }}/>
      </div>
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:7, zIndex:2, maxWidth:"35%" }}>
        <div style={{ fontSize:46, animation:"float 3s ease-in-out infinite", filter:"drop-shadow(0 8px 14px rgba(0,0,0,.4))" }}>{sl.float}</div>
        <div style={{ background:sl.floatBg, border:`1px solid ${sl.floatBorder}`, borderRadius:7, padding:"3px 9px", fontFamily:"'Clash Display',sans-serif", fontSize:8, fontWeight:700, color:sl.floatColor }}>{sl.floatLabel}</div>
      </div>
      <div style={{ position:"absolute", inset:0, zIndex:2, padding:"18px 16px", display:"flex", flexDirection:"column", justifyContent:"space-between", maxWidth:"65%" }}>
        <div>
          <div style={{ fontSize:9, color:sl.eyebrowColor, textTransform:"uppercase", letterSpacing:2, marginBottom:4 }}>{sl.eyebrow}</div>
          {sl.showCd && (
            <div style={{ display:"flex", gap:4, alignItems:"center", marginBottom:6 }}>
              <CdBlock val={h} /><span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, color:"white", opacity:.4 }}>:</span>
              <CdBlock val={m} /><span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:16, fontWeight:700, color:"white", opacity:.4 }}>:</span>
              <CdBlock val={s} />
            </div>
          )}
        </div>
        <div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:20, fontWeight:700, lineHeight:1.15, color:"white", marginBottom:4 }}>{sl.title}</div>
          <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:10, lineHeight:1.5 }}>{sl.sub}</div>
          <button onClick={() => onNav(sl.btn.action)} style={{ background:sl.btn.bg, color:sl.btn.color||"white", border:sl.btn.border||"none", padding:"7px 13px", borderRadius:9, fontFamily:"'Clash Display',sans-serif", fontSize:10, fontWeight:700, cursor:"pointer", boxShadow:`0 4px 14px ${sl.btn.shadow||"transparent"}` }}>{sl.btn.label}</button>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, zIndex:10 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goSlide(i)} style={{ width: cur===i ? 20 : 6, height:6, borderRadius: cur===i ? 3 : "50%", background: cur===i ? "white" : "rgba(255,255,255,.3)", transition:"all .3s", cursor:"pointer" }}/>
        ))}
      </div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"rgba(255,255,255,.1)", zIndex:10 }}>
        <div style={{ height:"100%", width:`${progress}%`, background:"#4a8fff", borderRadius:1, transition:"width .1s linear" }}/>
      </div>
    </div>
  );
}

const CATS = [
  { id:"moda", icon:"👗", name:"Moda & Ropa", sub:"13 tiendas · Macy's, Zara, Uniqlo...", color:"rgba(255,51,85,.10)", border:"rgba(255,51,85,.18)", stores:[{ slug:"macys", name:"Macy's", cb:15, hot:true },{ slug:"zara", name:"Zara", cb:12 },{ slug:"nordstrom", name:"Nordstrom", cb:10 },{ slug:"hm", name:"H&M", cb:10 },{ slug:"uniqlo", name:"Uniqlo", cb:10 },{ slug:"forever21", name:"Forever 21", cb:8 },{ slug:"ralph", name:"Ralph Lauren", cb:8 },{ slug:"tommy", name:"Tommy H.", cb:8 },{ slug:"ae", name:"Am. Eagle", cb:7 },{ slug:"oldnavy", name:"Old Navy", cb:6 },{ slug:"levis", name:"Levi's", cb:8 }] },
  { id:"calzado", icon:"👟", name:"Calzado & Sneakers", sub:"8 tiendas · Nike, Adidas, HOKA...", color:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.18)", stores:[{ slug:"nike", name:"Nike", cb:12, hot:true },{ slug:"adidas", name:"Adidas", cb:10 },{ slug:"nb", name:"New Balance", cb:10 },{ slug:"hoka", name:"HOKA", cb:8 },{ slug:"on", name:"On Cloud", cb:7 },{ slug:"reebok", name:"Reebok", cb:8 },{ slug:"vans", name:"Vans", cb:7 },{ slug:"footlocker", name:"Foot Locker", cb:6 }] },
  { id:"belleza", icon:"💄", name:"Belleza & Cuidado", sub:"5 tiendas · Sephora, Ulta, Bath & Body...", color:"rgba(204,0,102,.10)", border:"rgba(204,0,102,.18)", stores:[{ slug:"sephora", name:"Sephora", cb:15, hot:true },{ slug:"bathandbody", name:"Bath & Body", cb:10 },{ slug:"ulta", name:"Ulta Beauty", cb:8 }] },
  { id:"tech", icon:"💻", name:"Tecnología", sub:"4 tiendas · Best Buy, Apple, Amazon...", color:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.18)", stores:[{ slug:"bestbuy", name:"Best Buy", cb:8 },{ slug:"apple", name:"Apple", cb:5 },{ slug:"amazon", name:"Amazon", cb:10 }] },
  { id:"hogar", icon:"🏠", name:"Hogar & Decoración", sub:"4 tiendas · IKEA, Target, Wayfair...", color:"rgba(76,175,130,.10)", border:"rgba(76,175,130,.18)", stores:[{ slug:"ikea", name:"IKEA", cb:5 },{ slug:"target", name:"Target", cb:8 },{ slug:"wayfair", name:"Wayfair", cb:6 }] },
  { id:"deportes", icon:"🏋️", name:"Deportes & Outdoor", sub:"5 tiendas · Dick's, REI, Patagonia...", color:"rgba(200,16,46,.10)", border:"rgba(200,16,46,.18)", stores:[{ slug:"dicks", name:"Dick's Sports", cb:6, hot:true },{ slug:"rei", name:"REI", cb:5 },{ slug:"gnc", name:"GNC", cb:5 },{ slug:"patagonia", name:"Patagonia", cb:4 },{ slug:"columbia", name:"Columbia", cb:4 }] },
  { id:"grandes", icon:"🛒", name:"Grandes Superficies", sub:"4 tiendas · Walmart, Target, Amazon...", color:"rgba(240,180,41,.10)", border:"rgba(240,180,41,.18)", stores:[{ slug:"walmart", name:"Walmart", cb:8, hot:true },{ slug:"target", name:"Target", cb:8 },{ slug:"amazon", name:"Amazon", cb:10 },{ slug:"kohls", name:"Kohl's", cb:6 }] },
];

function AccordionSection({ onNav }) {
  const [open, setOpen] = useState("moda");
  const toggle = (id) => setOpen(prev => prev === id ? null : id);
  return (
    <div style={{ margin:"12px 14px 0", borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", background:"#161b2e" }}>
      {CATS.map((cat, idx) => {
        const isOpen = open === cat.id;
        return (
          <div key={cat.id} style={{ borderBottom: idx < CATS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div onClick={() => toggle(cat.id)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer", userSelect:"none" }}>
              <div style={{ width:36, height:36, borderRadius:10, background:cat.color, border:`1px solid ${cat.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{cat.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:13, fontWeight:700, color:"white", marginBottom:1 }}>{cat.name}</div>
                <div style={{ fontSize:10, color:"#555866", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cat.sub}</div>
              </div>
              <div style={{ fontSize:16, color:"#555866", transition:"transform .3s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", flexShrink:0 }}>›</div>
            </div>
            <div style={{ maxHeight: isOpen ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1e293b", borderTop: isOpen ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ display:"flex", gap:10, padding:"14px 14px 16px", overflowX:"auto" }}>
                {cat.stores.map(store => <Tile key={store.slug} {...store} />)}
              </div>
            </div>
          </div>
        );
      })}
      <TikTokRow onNav={onNav} />
      <EtsyRow onNav={onNav} />
    </div>
  );
}

function TikTokRow({ onNav }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div onClick={() => setOpen(p => !p)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer", userSelect:"none", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(255,0,80,.04),transparent 60%)" }}/>
        <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,0,80,.10)", border:"1px solid rgba(255,0,80,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, zIndex:1 }}>🎵</div>
        <div style={{ flex:1, zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:13, fontWeight:700, color:"white" }}>TikTok Shop</span>
            <span style={{ background:"#ff0050", color:"white", fontSize:7, fontWeight:700, padding:"2px 5px", borderRadius:4 }}>NUEVO</span>
          </div>
          <div style={{ fontSize:10, color:"#555866" }}>Lo que ves en TikTok, nosotros lo traemos</div>
        </div>
        <div style={{ fontSize:16, color:"#555866", transition:"transform .3s", transform: open ? "rotate(90deg)" : "rotate(0deg)", zIndex:1 }}>›</div>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1e293b" }}>
        <div style={{ padding:"12px 14px 14px" }}>
          <div style={{ background:"linear-gradient(135deg,#0d0005,#1a0020)", borderRadius:14, padding:"13px", border:"1px solid rgba(255,0,80,.18)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:32, opacity:.7 }}>🎵</div>
            <div style={{ fontSize:8, color:"rgba(0,242,234,.65)", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>Nuevo servicio</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white", marginBottom:3 }}>TikTok <span style={{ color:"#ff0050" }}>Shop</span> en <span style={{ color:"#00f2ea" }}>RD</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:10 }}>Ve el producto, pega el link.</div>
            <button onClick={() => onNav("neworder")} style={{ background:"#ff0050", color:"white", border:"none", padding:"6px 12px", borderRadius:8, fontFamily:"'Clash Display',sans-serif", fontSize:10, fontWeight:700, cursor:"pointer" }}>🛍️ Pegar mi link →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EtsyRow({ onNav }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
      <div onClick={() => setOpen(p => !p)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer", userSelect:"none", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(235,105,31,.04),transparent 60%)" }}/>
        <div style={{ width:36, height:36, borderRadius:10, background:"rgba(235,105,31,.10)", border:"1px solid rgba(235,105,31,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0, zIndex:1 }}>🛍️</div>
        <div style={{ flex:1, zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:13, fontWeight:700, color:"white" }}>Etsy</span>
            <span style={{ background:"#eb691f", color:"white", fontSize:7, fontWeight:700, padding:"2px 5px", borderRadius:4 }}>NUEVO</span>
          </div>
          <div style={{ fontSize:10, color:"#555866" }}>Productos únicos y artesanales de USA</div>
        </div>
        <div style={{ fontSize:16, color:"#555866", transition:"transform .3s", transform: open ? "rotate(90deg)" : "rotate(0deg)", zIndex:1 }}>›</div>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1e293b" }}>
        <div style={{ padding:"12px 14px 14px" }}>
          <div style={{ background:"linear-gradient(135deg,#1a0800,#2a1000)", borderRadius:14, padding:"13px", border:"1px solid rgba(235,105,31,.18)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:32, opacity:.7 }}>🧶</div>
            <div style={{ fontSize:8, color:"rgba(255,180,80,.65)", textTransform:"uppercase", letterSpacing:2, marginBottom:3 }}>Artesanal desde USA</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white", marginBottom:3 }}><span style={{ color:"#eb691f" }}>Etsy</span> llega a <span style={{ color:"#f0b429" }}>RD</span></div>
            <div style={{ fontSize:10, color:"rgba(255,255,255,.4)", marginBottom:10 }}>Único, hecho a mano y personalizado.</div>
            <button onClick={() => onNav("neworder")} style={{ background:"#eb691f", color:"white", border:"none", padding:"6px 12px", borderRadius:8, fontFamily:"'Clash Display',sans-serif", fontSize:10, fontWeight:700, cursor:"pointer" }}>🛍️ Buscar en Etsy →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBanners({ onNav }) {
  const [openHow, setOpenHow] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);
  return (
    <div style={{ padding:"12px 14px 0", display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div onClick={() => setOpenHow(p => !p)} style={{ background:"linear-gradient(135deg,#001830,#002850,#001020)", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(74,143,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(74,143,255,.05) 1px,transparent 1px)", backgroundSize:"14px 14px" }}/>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(74,143,255,.15)", border:"1px solid rgba(74,143,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, zIndex:1 }}>⚙️</div>
          <div style={{ flex:1, zIndex:1 }}>
            <div style={{ fontSize:8.5, color:"rgba(74,143,255,.6)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Simple y transparente</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white" }}>Cómo funciona <span style={{ color:"#7ab0ff" }}>USAlink</span></div>
          </div>
          <div style={{ fontSize:18, color:"rgba(255,255,255,.35)", transition:"transform .3s", transform: openHow ? "rotate(90deg)" : "rotate(0deg)", zIndex:1 }}>›</div>
        </div>
        <div style={{ maxHeight: openHow ? 500 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ background:"#161b2e", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
            {[
              { num:"01", c:"#4a8fff", title:"Elige en la tienda USA", sub:"Navega Nike, HOKA, Macy's o cualquier tienda. Copia el link del producto." },
              { num:"02", c:"#ff3355", title:"Paga en RD sin complicaciones", sub:"Transferencia o tarjeta dominicana. Sin tarjeta americana, sin rechazos." },
              { num:"03", c:"#4a8fff", title:"Lo compramos con evidencia", sub:"Foto de compra, tracking real y foto de entrega. Transparencia total." },
              { num:"04", c:"#ff3355", title:"Recibe en 5-8 días en RD", sub:"Casillero Miami incluido. Donde otros no envían a LATAM, nosotros sí." },
            ].map((step, i, arr) => (
              <div key={i} style={{ display:"flex", gap:13, alignItems:"flex-start", padding:"13px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Clash Display',sans-serif", fontSize:11, fontWeight:700, background:`${step.c}18`, border:`1px solid ${step.c}35`, color:step.c }}>{step.num}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"white", marginBottom:3 }}>{step.title}</div>
                  <div style={{ fontSize:10, color:"#a0a2aa", lineHeight:1.6 }}>{step.sub}</div>
                </div>
              </div>
            ))}
            <div style={{ padding:"12px 16px 14px" }}>
              <button onClick={() => onNav("neworder")} style={{ ...btnP, width:"100%", padding:12, fontFamily:"'Clash Display',sans-serif", fontSize:12 }}>➕ Hacer mi primer pedido →</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height:3, background:"linear-gradient(90deg,#002D72 33%,#1e293b 33%,#1e293b 66%,#BF0A30 66%)" }}/>
        <div onClick={() => setOpenWhy(p => !p)} style={{ background:"#161b2e", padding:"13px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none" }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(240,180,41,.12)", border:"1px solid rgba(240,180,41,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🇩🇴</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:8.5, color:"rgba(240,180,41,.55)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Nuestra promesa</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white" }}>Por qué elegir <span style={{ color:"#f0b429" }}>USAlink</span></div>
          </div>
          <div style={{ fontSize:18, color:"#555866", transition:"transform .3s", transform: openWhy ? "rotate(90deg)" : "rotate(0deg)" }}>›</div>
        </div>
        <div style={{ maxHeight: openWhy ? 500 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ background:"#161b2e", borderTop:"1px solid rgba(255,255,255,.04)" }}>
            {[
              { icon:"🇩🇴", bg:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.20)", title:"Paga en RD, sin tarjeta americana", sub:"Transferencia, tarjeta dominicana o efectivo. Sin rechazos bancarios." },
              { icon:"📸", bg:"rgba(255,51,85,.10)", border:"rgba(255,51,85,.18)", title:"Evidencia fotográfica en cada paso", sub:"Foto de compra, tracking real y foto de entrega. Sin sorpresas." },
              { icon:"✈️", bg:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.20)", title:"Casillero Miami incluido", sub:"5-8 días a RD. Tiendas que no envían a LATAM — nosotros sí." },
              { icon:"🛡️", bg:"rgba(76,175,130,.12)", border:"rgba(76,175,130,.22)", title:"Sistema anti-fraude verificado", sub:"Trust Score, contrato digital y respaldo total." },
            ].map((item, i, arr) => (
              <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"13px 16px", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                <div style={{ width:38, height:38, borderRadius:11, background:item.bg, border:`1px solid ${item.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"white", marginBottom:3 }}>{item.title}</div>
                  <div style={{ fontSize:10, color:"#a0a2aa", lineHeight:1.6 }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────
function Home({ onNav }) {
  const { profile } = useAuth();
  const rate = useRate();
  const [country, setCountry] = useState(null);
  const [toast, setToast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(data => {
        if (data.country_code) {
          setCountry(data.country_code);
          setToast(true);
          setTimeout(() => setToast(false), 3500);
        }
      })
      .catch(() => {});
  }, []);

  const suffix = country ? (COUNTRY_MAP[country] || null) : null;
  const ts = profile?.trust_score || 0;

  const stats = [
    { icon:"🛡️", n: ts,                                              l:"TRUST SCORE", c:"#4a8fff" },
    { icon:"🛍️", n: profile?.total_orders || 0,                      l:"PEDIDOS",     c:"#f0b429" },
    { icon:"💰", n: `RD$${Number(profile?.cashback_balance||0).toLocaleString()}`, l:"CASHBACK", c:"#4caf82" },
    { icon:"💳", n: `RD$${((profile?.purchase_limit||8000)/1000).toFixed(0)}k`,   l:"límite",   c:"#ff3355" },
  ];

  return (
    <div style={{ background:"#0a0e1a", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>

      {/* TOAST país */}
      {toast && country && (
        <div style={{ position:"fixed", top:14, left:"50%", transform:"translateX(-50%)", background:"#161b2e", border:"1px solid rgba(74,143,255,0.3)", borderRadius:50, padding:"8px 18px", zIndex:999, display:"flex", alignItems:"center", gap:8, boxShadow:"0 8px 32px rgba(0,0,0,0.6)", animation:"fadeDown .35s ease", whiteSpace:"nowrap" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#4a8fff", animation:"pulse 1.5s infinite" }} />
          <span style={{ fontSize:11, color:"#a0a2aa" }}>Detectado:</span>
          <span style={{ fontSize:11, fontWeight:700, color:"white" }}>{COUNTRY_NAMES[country] || country}</span>
          {suffix && <span style={{ fontSize:11, color:"#4a8fff", fontWeight:700 }}>→ USAlink{suffix}</span>}
        </div>
      )}

      {/* MENÚ LATERAL */}
      {menuOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:500 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(4px)" }} />
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:260, background:"#111827", borderRight:"1px solid rgba(255,255,255,0.07)", display:"flex", flexDirection:"column" }}>
            <div style={{ height:110, background:"linear-gradient(135deg,#1e3a8a,#7c3aed)", display:"flex", alignItems:"flex-end", padding:"16px 18px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize:"16px 16px" }} />
              <div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>
                  <span style={{ color:"#7ab0ff" }}>USA</span>link{suffix && <span style={{ color:"#ff6b6b", fontSize:13 }}>{suffix}</span>}
                </div>
                {country && <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:2 }}>{COUNTRY_NAMES[country] || country}</div>}
              </div>
            </div>
            {[["🏠","Inicio"],["🏪","Tiendas"],["➕","Hacer pedido"],["📦","Mis pedidos"],["💰","Mi cashback"],["🎧","Soporte"],["⚙️","Configuración"]].map(([icon,label]) => (
              <div key={label} onClick={() => { setMenuOpen(false); }} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", cursor:"pointer", borderBottom:"1px solid rgba(255,255,255,0.04)", fontSize:13, color:"white", fontWeight:500 }}>
                <span style={{ fontSize:18 }}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ background:"rgba(10,14,26,0.97)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={() => setMenuOpen(true)} style={{ background:"#161b2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5 }}>
          {[18,14,18].map((w,i) => <span key={i} style={{ display:"block", width:w, height:2, background:"rgba(255,255,255,0.7)", borderRadius:2 }} />)}
        </button>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:24, color:"white", letterSpacing:-0.5 }}>
            <span style={{ color:"#4a8fff" }}>USA</span>link
          </div>
          <div style={{ fontSize:8, color:"#4a5568", letterSpacing:2.5, textTransform:"uppercase" }}>Conecta con lo mejor de USA</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <div style={{ width:42, height:42, background:"#161b2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, cursor:"pointer" }}>🔍</div>
          <div style={{ position:"relative", cursor:"pointer" }}>
            <div style={{ width:42, height:42, background:"#161b2e", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🔔</div>
            <div style={{ position:"absolute", top:-2, right:-2, width:10, height:10, borderRadius:"50%", background:"#ff3355", border:"2px solid #0a0e1a", animation:"pulse 2s infinite" }} />
          </div>
        </div>
      </div>

      {/* PERFIL HERO */}
      <div style={{ margin:"14px 14px 0", borderRadius:24, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.6)" }}>
        {/* Banner waves */}
        <div style={{ height:210, position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#2d0a6b 0%,#1e3a8a 45%,#1e40af 75%,#2563eb 100%)" }}>
          <div style={{ position:"absolute", top:16, right:16, display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
            {Array.from({length:28}).map((_,i) => <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"rgba(99,179,237,0.4)" }} />)}
          </div>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 70" preserveAspectRatio="none">
            <path d="M0,35 C80,70 160,0 240,35 C310,65 360,15 390,35 L390,70 L0,70 Z" fill="rgba(30,58,138,0.5)" />
          </svg>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 55" preserveAspectRatio="none">
            <path d="M0,28 C60,55 150,5 250,28 C330,48 370,12 390,28 L390,55 L0,55 Z" fill="rgba(124,58,237,0.3)" />
          </svg>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 40" preserveAspectRatio="none">
            <path d="M0,20 C100,40 200,0 300,20 C360,35 380,8 390,20 L390,40 L0,40 Z" fill="rgba(167,139,250,0.2)" />
          </svg>
          {/* Avatar con upload */}
          <div style={{ position:"absolute", left:18, bottom:18 }}>
            <AvatarUploader avatarUrl={profile?.avatar_url} size={115} />
          </div>
          {/* Nombre + badge */}
          <div style={{ position:"absolute", left:150, bottom:28, right:14 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)", border:"1px solid rgba(240,180,41,0.55)", borderRadius:50, padding:"5px 13px", marginBottom:9 }}>
              <span style={{ fontSize:12 }}>⭐</span>
              <span style={{ fontSize:9, fontWeight:700, color:"#f0b429", fontFamily:"'Clash Display',sans-serif", letterSpacing:0.8 }}>COMPRADOR GOLD</span>
            </div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:20, color:"white", lineHeight:1.1, textShadow:"0 2px 12px rgba(0,0,0,0.6)", marginBottom:5 }}>
              {profile?.full_name || "Mi cuenta"}
            </div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>
              Miembro desde {profile ? new Date(profile.created_at).getFullYear() : "2024"}
            </div>
          </div>
        </div>

        {/* STATS — Disputas → Cashback, Límite etiqueta pequeña */}
        <div style={{ background:"#111827", padding:"16px 12px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {stats.map((s,i) => (
              <div key={i} style={{ background:"#1e293b", borderRadius:16, padding:"14px 4px 12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
                <div style={{ fontSize:20, marginBottom:7 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize: s.n.toString().length > 4 ? 11 : 18, color:s.c, lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize: i === 3 ? 6 : 7, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px", marginTop:5 }}>{s.l}</div>
                <div style={{ position:"absolute", bottom:0, left:"20%", right:"20%", height:2.5, borderRadius:2, background:s.c, opacity:0.85 }} />
              </div>
            ))}
          </div>
          {/* Trust Score info */}
          <div style={{ marginTop:12, background:"#1e293b", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,143,255,0.12)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontSize:10, color:"#a0a2aa" }}>🛡️ Trust Score</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff" }}>{ts}/100</div>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden", marginBottom:6 }}>
              <div style={{ height:"100%", width:`${ts}%`, background:"linear-gradient(90deg,#4a8fff,#7ab0ff)", borderRadius:3, transition:"width 1s ease" }} />
            </div>
            <div style={{ display:"flex", gap:8, fontSize:9, color:"#64748b" }}>
              <span style={{ color: profile?.kyc_verified ? "#4caf82" : "#555866" }}>
                {profile?.kyc_verified ? "✅" : "⬜"} KYC verificado (+25)
              </span>
              <span style={{ color: (profile?.total_orders||0) > 0 ? "#4caf82" : "#555866" }}>
                {(profile?.total_orders||0) > 0 ? "✅" : "⬜"} Pedidos (+{Math.min((profile?.total_orders||0),10)*3})
              </span>
              <span style={{ color: (profile?.disputes||0) === 0 ? "#4caf82" : "#ff3355" }}>
                {(profile?.disputes||0) === 0 ? "✅" : "⚠️"} Sin disputas (+15)
              </span>
            </div>
          </div>
          {/* CTA */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:10 }}>
            <button onClick={() => onNav("neworder")} style={{ ...btnP }}>➕ Nuevo pedido</button>
            <button onClick={() => onNav("orders")} style={{ ...btnS }}>📋 Ver historial</button>
          </div>
        </div>
      </div>

      {/* Tasa */}
      <div style={{ margin:"12px 14px 0", background:"#161b2e", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:11, color:"#a0a2aa" }}>💱 Tasa del día</div>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:14, color:"#4a8fff" }}>$1 USD = RD${Number(rate).toFixed(2)}</div>
      </div>

      {/* CAROUSEL */}
      <div style={{ marginTop:12 }}><Carousel onNav={onNav} /></div>

      {/* TICKER */}
      <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.04)", padding:"7px 0", background:"#161b2e" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", animation:"ticker 30s linear infinite" }}>
          {["● Nike Pegasus 41 · $149 · RD$11,200","● HOKA Clifton 9 · $145 · RD$10,800","● Macy's Hasta 15% cashback","● Sephora Set Skincare · $45 · RD$3,375","● Adidas Ultraboost · $90 · RD$6,750","● TikTok Shop · Pega tu link y listo","● Etsy · Joyería personalizada desde $15","● Nike Pegasus 41 · $149 · RD$11,200","● HOKA Clifton 9 · $145 · RD$10,800","● Macy's Hasta 15% cashback"].map((item, i) => (
            <span key={i} style={{ display:"inline-block", padding:"0 16px", fontSize:10, color:"#555866" }}>
              <strong style={{ color:"#4a8fff" }}>{item.split(" ")[0]}</strong> {item.slice(item.indexOf(" ") + 1)}
            </span>
          ))}
        </div>
      </div>

      <AccordionSection onNav={onNav} />
      <InfoBanners onNav={onNav} />
      <div style={{ height:12 }} />
    </div>
  );
}

// ── STORES ────────────────────────────────────────────────────
function Stores({ onNav }) {
  const [stores, setStores] = useState([]);
  const [cat, setCat] = useState("all");
  useEffect(() => {
    sb.from("stores").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setStores(data || []));
  }, []);
  const CATS2 = [{ id:"all", l:"Todas" },{ id:"moda", l:"👗 Moda" },{ id:"calzado", l:"👟 Calzado" },{ id:"belleza", l:"💄 Belleza" },{ id:"tech", l:"💻 Tech" },{ id:"hogar", l:"🏠 Hogar" },{ id:"deportes", l:"🏋️ Deportes" },{ id:"grandes", l:"🛒 Grandes" }];
  const list = cat === "all" ? stores : stores.filter(s => s.category === cat);
  return (
    <div style={{ background:"#0a0e1a", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Tiendas <span style={{ color:"#4a8fff" }}>USA</span></div>
      </div>
      <div style={{ display:"flex", gap:7, padding:"12px 14px", overflowX:"auto" }}>
        {CATS2.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: cat === c.id ? "#4a8fff" : "#161b2e", color: cat === c.id ? "white" : "#555866", outline: cat === c.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>{c.l}</button>)}
      </div>
      <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:8 }}>
        {list.map(store => (
          <div key={store.id} style={{ background:"#161b2e", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:11, background:store.color||"#1e293b", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>{store.name.slice(0,3).toUpperCase()}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"white" }}>{store.name}</div>
              <div style={{ fontSize:10, color:"#4caf82" }}>💰 Hasta {store.cashback_pct}% cashback</div>
            </div>
            <div style={{ fontSize:16, color:"#555866" }}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── NEW ORDER ─────────────────────────────────────────────────
function NewOrder({ onNav }) {
  const { user } = useAuth(); const rate = useRate();
  const [url, setUrl] = useState(""); const [name, setName] = useState(""); const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState("");
  const usd = parseFloat(price) || 0; const total = (usd + 27) * 1.18;
  // Fecha estimada de entrega: hoy + 7 días
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
  const deliveryStr = estimatedDelivery.toLocaleDateString("es-DO", { day:"numeric", month:"long", year:"numeric" });

  async function submit() {
    if (!url || !price) return; setLoading(true); setError("");
    const est = new Date(); est.setDate(est.getDate() + 7);
    const { error } = await sb.from("orders").insert({
      user_id: user.id,
      product_url: url,
      product_name: name || "Producto",
      price_usd: usd,
      exchange_rate: rate,
      status: "pending",
      estimated_delivery: est.toISOString(),
    });
    if (error) { setError(error.message); setLoading(false); return; }
    // Actualizar total_orders y recalcular trust score
    await sb.rpc("increment_orders", { user_id: user.id }).catch(() => {});
    setDone(true); setLoading(false);
  }
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0a0e1a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, gap:16 }}>
      <style>{GS}</style>
      <div style={{ fontSize:56 }}>🎉</div>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white", textAlign:"center" }}>¡Pedido creado!</div>
      <div style={{ fontSize:13, color:"#a0a2aa", textAlign:"center", lineHeight:1.6 }}>Tu pedido fue recibido. Entrega estimada: <strong style={{ color:"#4a8fff" }}>{deliveryStr}</strong></div>
      <button onClick={() => { setDone(false); setUrl(""); setName(""); setPrice(""); onNav("orders"); }} style={{ ...btnP, padding:"13px 32px" }}>Ver mis pedidos →</button>
    </div>
  );
  return (
    <div style={{ background:"#0a0e1a", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Nuevo <span style={{ color:"#4a8fff" }}>Pedido</span></div>
      </div>
      <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ fontSize:11, color:"#a0a2aa", lineHeight:1.6 }}>Copia el link del producto desde cualquier tienda USA y nosotros lo compramos por ti.</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355" }}>{error}</div>}
        {[
          { label:"🔗 Link del producto", ph:"https://www.nike.com/...", val:url, set:setUrl, type:"url" },
          { label:"📦 Nombre del producto", ph:"Nike Air Force 1...", val:name, set:setName, type:"text" },
          { label:"💵 Precio en USD", ph:"90.00", val:price, set:setPrice, type:"number" },
        ].map((f,i) => (
          <div key={i}>
            <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:7 }}>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inp} />
            {f.type === "number" && price && <div style={{ fontSize:11, color:"#4a8fff", marginTop:5 }}>≈ RD${(usd * rate).toLocaleString("es-DO",{minimumFractionDigits:2})}</div>}
          </div>
        ))}
        {/* Entrega estimada preview */}
        {price && (
          <div style={{ background:"#161b2e", borderRadius:12, border:"1px solid rgba(74,143,255,0.15)", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ fontSize:11, color:"#a0a2aa" }}>📅 Entrega estimada</div>
            <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff" }}>{deliveryStr}</div>
          </div>
        )}
        {price && (
          <div style={{ background:"#161b2e", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:14 }}>
            <div style={{ fontWeight:700, fontSize:12, color:"white", marginBottom:10 }}>Resumen del pedido</div>
            {[{ l:"Producto", v:`$${usd.toFixed(2)}` },{ l:"Servicio", v:"$15.00" },{ l:"Envío Miami→RD", v:"$12.00" },{ l:"ITBIS (18%)", v:`$${((usd+27)*0.18).toFixed(2)}` }].map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12, color:"#a0a2aa" }}><span>{r.l}</span><span>{r.v}</span></div>
            ))}
            <div style={{ height:1, background:"rgba(255,255,255,.04)", margin:"10px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, fontSize:14, color:"white" }}>Total</span>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, fontSize:16, color:"white" }}>${total.toFixed(2)}</div>
                <div style={{ fontSize:10, color:"#4a8fff" }}>≈ RD${(total*rate).toLocaleString("es-DO",{minimumFractionDigits:2})}</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={submit} disabled={!url || !price || loading} style={{ ...btnP, opacity:(!url||!price||loading) ? 0.5 : 1 }}>
          {loading ? "Enviando..." : "✅ Confirmar pedido →"}
        </button>
      </div>
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────
function Orders({ onNav }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState("all");
  const STATUS = {
    pending:{ l:"⏳ Pendiente", c:"#f0b429" }, confirmed:{ l:"✅ Confirmado", c:"#4a8fff" },
    purchased:{ l:"🛍️ Comprado", c:"#4a8fff" }, in_miami:{ l:"📦 En Miami", c:"#f97316" },
    in_flight:{ l:"✈️ En vuelo", c:"#f97316" }, customs:{ l:"🛃 En aduana", c:"#a855f7" },
    delivered:{ l:"✅ Entregado", c:"#4caf82" }, cancelled:{ l:"❌ Cancelado", c:"#ff3355" },
  };
  useEffect(() => {
    if (!user) return;
    sb.from("orders").select("*, stores(name,color,slug)").eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [user]);
  const ACTIVE = ["pending","confirmed","purchased","in_miami","in_flight","customs"];
  const filtered = filter === "all" ? orders : filter === "active" ? orders.filter(o => ACTIVE.includes(o.status)) : orders.filter(o => o.status === filter);
  return (
    <div style={{ background:"#0a0e1a", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Mis <span style={{ color:"#4a8fff" }}>Pedidos</span></div>
      </div>
      <div style={{ display:"flex", gap:7, padding:"12px 14px", overflowX:"auto" }}>
        {[{ id:"all", l:"Todos" },{ id:"active", l:"✈️ En camino" },{ id:"delivered", l:"✅ Entregados" },{ id:"cancelled", l:"❌ Cancelados" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: filter === f.id ? "#4a8fff" : "#161b2e", color: filter === f.id ? "white" : "#555866", outline: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>{f.l}</button>
        ))}
      </div>
      <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:10 }}>
        {loading && <div style={{ textAlign:"center", color:"#555866", padding:40 }}>Cargando...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📦</div>
            <div style={{ fontWeight:700, fontSize:16, color:"white", marginBottom:6 }}>Sin pedidos aún</div>
            <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:20 }}>Haz tu primer pedido desde una tienda USA</div>
            <button onClick={() => onNav("neworder")} style={{ ...btnP, padding:"11px 24px" }}>➕ Hacer mi primer pedido</button>
          </div>
        )}
        {filtered.map(order => {
          const st = STATUS[order.status] || { l: order.status, c:"#a0a2aa" };
          const createdAt = new Date(order.created_at).toLocaleDateString("es-DO", { day:"numeric", month:"short", year:"numeric" });
          const estDelivery = order.estimated_delivery
            ? new Date(order.estimated_delivery).toLocaleDateString("es-DO", { day:"numeric", month:"short", year:"numeric" })
            : null;
          return (
            <div key={order.id} style={{ background:"#161b2e", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width:34, height:34, borderRadius:9, background:order.stores?.color||"#1e293b", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>{(order.stores?.name||"?").slice(0,3).toUpperCase()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:"white" }}>{order.stores?.name||"Tienda USA"}</div>
                  <div style={{ fontSize:9, color:"#555866" }}>#{order.order_number}</div>
                </div>
                <div style={{ background:`${st.c}20`, border:`1px solid ${st.c}40`, borderRadius:6, padding:"3px 8px", fontSize:9, fontWeight:700, color:st.c }}>{st.l}</div>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontWeight:600, fontSize:12, color:"white", marginBottom:4 }}>{order.product_name||"Producto"}</div>
                <div style={{ fontWeight:700, fontSize:15, color:"white", marginBottom:8 }}>${order.price_usd?.toFixed(2)} USD</div>
                {/* Fechas */}
                <div style={{ display:"flex", gap:12 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ fontSize:11 }}>📅</span>
                    <div>
                      <div style={{ fontSize:8, color:"#64748b", textTransform:"uppercase", letterSpacing:".4px" }}>Pedido</div>
                      <div style={{ fontSize:11, fontWeight:600, color:"#a0a2aa" }}>{createdAt}</div>
                    </div>
                  </div>
                  {estDelivery && (
                    <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <span style={{ fontSize:11 }}>✈️</span>
                      <div>
                        <div style={{ fontSize:8, color:"#64748b", textTransform:"uppercase", letterSpacing:".4px" }}>Entrega est.</div>
                        <div style={{ fontSize:11, fontWeight:600, color:"#4a8fff" }}>{estDelivery}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PROFILE ───────────────────────────────────────────────────
function Profile({ onNav }) {
  const { profile, signOut } = useAuth();
  const ts = profile?.trust_score || 0;
  const MENU = [
    { icon:"👤", label:"Información personal", sub:"Nombre, teléfono, cédula", bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)" },
    { icon:"📍", label:"Direcciones de envío", sub:"2 guardadas", bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"💳", label:"Métodos de pago", sub:"Transferencia · Tarjeta", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
    { icon:"📦", label:"Historial de pedidos", sub:`${profile?.total_orders||0} pedidos`, bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)", nav:"orders" },
    { icon:"💰", label:"Mi cashback", sub:`RD$${Number(profile?.cashback_balance||0).toLocaleString()} disponibles`, bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"🥇", label:"Mi membresía Gold", sub:"Ver beneficios · Subir a Elite", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
    { icon:"🔔", label:"Notificaciones", sub:"Pedidos, ofertas, alertas", bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)" },
  ];
  const stats = [
    { icon:"🛡️", n: ts,                                              l:"TRUST SCORE", c:"#4a8fff" },
    { icon:"🛍️", n: profile?.total_orders || 0,                      l:"PEDIDOS",     c:"#f0b429" },
    { icon:"💰", n: `RD$${Number(profile?.cashback_balance||0).toLocaleString()}`, l:"CASHBACK", c:"#4caf82" },
    { icon:"💳", n: `RD$${((profile?.purchase_limit||8000)/1000).toFixed(0)}k`,   l:"límite",   c:"#ff3355" },
  ];
  return (
    <div style={{ background:"#0a0e1a", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(10,14,26,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Mi <span style={{ color:"#4a8fff" }}>Perfil</span></div>
        <div style={{ width:33, height:33, background:"#161b2e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚙️</div>
      </div>

      {/* Hero perfil igual que Home */}
      <div style={{ margin:"14px 14px 0", borderRadius:24, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.6)" }}>
        <div style={{ height:210, position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#2d0a6b 0%,#1e3a8a 45%,#1e40af 75%,#2563eb 100%)" }}>
          <div style={{ position:"absolute", top:16, right:16, display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
            {Array.from({length:28}).map((_,i) => <div key={i} style={{ width:3, height:3, borderRadius:"50%", background:"rgba(99,179,237,0.4)" }} />)}
          </div>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 70" preserveAspectRatio="none"><path d="M0,35 C80,70 160,0 240,35 C310,65 360,15 390,35 L390,70 L0,70 Z" fill="rgba(30,58,138,0.5)" /></svg>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 55" preserveAspectRatio="none"><path d="M0,28 C60,55 150,5 250,28 C330,48 370,12 390,28 L390,55 L0,55 Z" fill="rgba(124,58,237,0.3)" /></svg>
          <svg style={{ position:"absolute", bottom:0, left:0, width:"100%" }} viewBox="0 0 390 40" preserveAspectRatio="none"><path d="M0,20 C100,40 200,0 300,20 C360,35 380,8 390,20 L390,40 L0,40 Z" fill="rgba(167,139,250,0.2)" /></svg>
          <div style={{ position:"absolute", left:18, bottom:18 }}>
            <AvatarUploader avatarUrl={profile?.avatar_url} size={115} />
          </div>
          <div style={{ position:"absolute", left:150, bottom:28, right:14 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(10px)", border:"1px solid rgba(240,180,41,0.55)", borderRadius:50, padding:"5px 13px", marginBottom:9 }}>
              <span style={{ fontSize:12 }}>⭐</span>
              <span style={{ fontSize:9, fontWeight:700, color:"#f0b429", fontFamily:"'Clash Display',sans-serif", letterSpacing:0.8 }}>COMPRADOR GOLD</span>
            </div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:20, color:"white", lineHeight:1.1, textShadow:"0 2px 12px rgba(0,0,0,0.6)", marginBottom:5 }}>{profile?.full_name||"Mi cuenta"}</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>Miembro desde {profile ? new Date(profile.created_at).getFullYear() : "2024"}</div>
          </div>
        </div>
        <div style={{ background:"#111827", padding:"16px 12px 20px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:12 }}>
            {stats.map((s,i) => (
              <div key={i} style={{ background:"#1e293b", borderRadius:16, padding:"14px 4px 12px", textAlign:"center", border:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden" }}>
                <div style={{ fontSize:20, marginBottom:7 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize: s.n.toString().length > 4 ? 11 : 18, color:s.c, lineHeight:1 }}>{s.n}</div>
                <div style={{ fontSize: i === 3 ? 6 : 7, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px", marginTop:5 }}>{s.l}</div>
                <div style={{ position:"absolute", bottom:0, left:"20%", right:"20%", height:2.5, borderRadius:2, background:s.c, opacity:0.85 }} />
              </div>
            ))}
          </div>
          {/* Trust score breakdown */}
          <div style={{ background:"#1e293b", borderRadius:12, padding:"10px 14px", border:"1px solid rgba(74,143,255,0.12)", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontSize:10, color:"#a0a2aa" }}>🛡️ Trust Score</div>
              <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff" }}>{ts}/100</div>
            </div>
            <div style={{ height:4, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden", marginBottom:6 }}>
              <div style={{ height:"100%", width:`${ts}%`, background:"linear-gradient(90deg,#4a8fff,#7ab0ff)", borderRadius:3 }} />
            </div>
            <div style={{ display:"flex", gap:8, fontSize:9, color:"#64748b", flexWrap:"wrap" }}>
              <span style={{ color: profile?.kyc_verified ? "#4caf82" : "#555866" }}>{profile?.kyc_verified ? "✅" : "⬜"} KYC (+25)</span>
              <span style={{ color: (profile?.total_orders||0) > 0 ? "#4caf82" : "#555866" }}>{(profile?.total_orders||0) > 0 ? "✅" : "⬜"} Pedidos (+{Math.min((profile?.total_orders||0),10)*3})</span>
              <span style={{ color: (profile?.disputes||0) === 0 ? "#4caf82" : "#ff3355" }}>{(profile?.disputes||0) === 0 ? "✅" : "⚠️"} Sin disputas (+15)</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0" }}>
        <div style={{ background:"#161b2e", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
          {MENU.map((item,i) => (
            <div key={i} onClick={() => item.nav && onNav(item.nav)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderBottom: i < MENU.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: item.nav ? "pointer" : "default" }}>
              <div style={{ width:34, height:34, borderRadius:10, background:item.bg, border:`1px solid ${item.br}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:500, color:"white" }}>{item.label}</div><div style={{ fontSize:10, color:"#555866" }}>{item.sub}</div></div>
              <div style={{ fontSize:15, color:"#555866" }}>›</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#161b2e", borderRadius:16, border:"1px solid rgba(255,51,85,0.1)", overflow:"hidden", marginTop:10 }}>
          <div onClick={signOut} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer" }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🚪</div>
            <div style={{ fontSize:12, fontWeight:500, color:"#ff3355" }}>Cerrar sesión</div>
          </div>
        </div>
        <div style={{ textAlign:"center", padding:16, fontSize:10, color:"#555866" }}>
          <strong style={{ color:"#a0a2aa" }}>USAlink</strong> v3.0 · Hecho con ❤️ en República Dominicana
        </div>
      </div>
    </div>
  );
}


// ── APHRODITE AI ──────────────────────────────────────────────
const APHRODITE_IMG = "data:image/jpeg;base64,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";

const APHRODITE_QUICK = [
  { icon:"👟", label:"Recomendar sneakers" },
  { icon:"💱", label:"Calcular precio USD→RD$" },
  { icon:"📦", label:"Ver mis pedidos" },
  { icon:"🏬", label:"Mejores tiendas" },
  { icon:"✈️", label:"Tiempo de envío" },
  { icon:"💄", label:"Tiendas de belleza" },
];

function AphroditeAvatar({ size=48, ring=true, animated=false }) {
  return (
    <div style={{ width:size, height:size, position:"relative", flexShrink:0, animation: animated ? "float 3s ease-in-out infinite" : "none" }}>
      {ring && <div style={{ position:"absolute", inset:-3, borderRadius:"50%", background:"linear-gradient(135deg,#f0b429,#ff9500,#f0b429)", animation:"glow 2.5s ease-in-out infinite", zIndex:0 }} />}
      <div style={{ position:"absolute", inset: ring ? 2 : 0, borderRadius:"50%", overflow:"hidden", zIndex:1, border: ring ? "2px solid #0a0e1a" : "none" }}>
        <img src={APHRODITE_IMG} alt="Aphrodite" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }} />
      </div>
    </div>
  );
}

function AphroditeTyping() {
  return (
    <div style={{ display:"flex", gap:4, padding:"12px 16px" }}>
      {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"linear-gradient(135deg,#f0b429,#ff9500)", animation:"typingDot 1.2s ease-in-out infinite", animationDelay:`${i*0.18}s` }} />)}
    </div>
  );
}

function AphroditeBubble({ msg }) {
  const isUser = msg.role === "user";
  const parts = msg.content.split(/\*\*(.*?)\*\*/g);
  return (
    <div style={{ display:"flex", flexDirection: isUser ? "row-reverse" : "row", alignItems:"flex-end", gap:8, marginBottom:12, animation:"fadeUp 0.3s ease" }}>
      {!isUser && <AphroditeAvatar size={30} ring={false} />}
      <div style={{ maxWidth:"78%", background: isUser ? "linear-gradient(135deg,#4a8fff,#2563eb)" : "rgba(255,255,255,0.04)", border: isUser ? "none" : "1px solid rgba(240,180,41,0.2)", borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding:"11px 14px", fontSize:13, color:"white", lineHeight:1.6 }}>
        {parts.map((p,i) => i%2===1 ? <strong key={i} style={{ color: isUser ? "white" : "#f0b429" }}>{p}</strong> : <span key={i}>{p}</span>)}
      </div>
    </div>
  );
}

function Aphrodite({ onNav, profile, rate }) {
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:"¡Hola! Soy **Aphrodite** tu personal shopper de USAlink. ¿Qué quieres traer de USA hoy?" }
  ]);
  const [input, setInput] = useState("");
  co
