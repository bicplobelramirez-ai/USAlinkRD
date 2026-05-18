import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL  = "https://kugdrwxthmcscrvlszws.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z2Ryd3h0aG1jc2NydmxzendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDU4NjIsImV4cCI6MjA5NDEyMTg2Mn0.G4qXcDgoLvarYC8fvr5TrkiigvKBXRxVYOXiauyADic";
export const sb = createClient(SUPA_URL, SUPA_ANON);

const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);
const RateCtx = createContext(75);
const useRate = () => useContext(RateCtx);

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
    setProfile(data); setLoading(false);
  }
  async function signOut() { await sb.auth.signOut(); setUser(null); setProfile(null); }
  return <AuthCtx.Provider value={{ user, profile, loading, signOut, loadProfile }}>{children}</AuthCtx.Provider>;
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
body{background:#0d0d0d;font-family:'DM Sans',sans-serif;color:#f0f0f0;}
::-webkit-scrollbar{display:none;}input::placeholder{color:#555866;}
button{font-family:'DM Sans',sans-serif;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`;

const btnP = { padding:"10px 16px", borderRadius:11, background:"#4a8fff", color:"white", fontWeight:700, fontSize:11, border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(74,143,255,0.3)" };
const btnS = { padding:"10px 16px", borderRadius:11, background:"#1e1e1e", color:"#a0a2aa", fontWeight:700, fontSize:11, border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer" };
const inp  = { width:"100%", background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"13px 14px", color:"#f0f0f0", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

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
      <div style={{ background:"rgba(18,18,18,0.97)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, display:"flex", padding:5, boxShadow:"0 -2px 30px rgba(0,0,0,0.6)" }}>
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
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <style>{GS}</style>
      <div style={{ width:64, height:64, background:"#002D72", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🔗</div>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white" }}>
        <span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:16 }}>RD</span>
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
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 22px", maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>📧</div>
        <div style={{ fontWeight:700, fontSize:18, color:"white", marginBottom:8 }}>Revisa tu email</div>
        <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:20, lineHeight:1.6 }}>Link mágico enviado a <strong style={{ color:"#4a8fff" }}>{email}</strong></div>
        <button onClick={() => setSent(false)} style={{ ...btnS, width:"100%" }}>← Volver</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <style>{GS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:28 }}>
        <div style={{ width:56, height:56, background:"#002D72", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>🔗</div>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:24, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:16 }}>RD</span></div>
        <div style={{ fontSize:11, color:"#555866" }}>Tu acceso a las mejores tiendas de USA</div>
      </div>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
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
      <div style={{ textAlign:"center", fontSize:11, color:"#555866", marginTop:16 }}>🇩🇴 República Dominicana × 🇺🇸 USA</div>
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
    if (data.user) await sb.from("users").upsert({ id: data.user.id, email, full_name: fullName, phone, plan: "guest" });
    setDone(true); setLoading(false);
  }
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 22px", maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🎉</div>
        <div style={{ fontWeight:700, fontSize:20, color:"white", marginBottom:8 }}>¡Cuenta creada!</div>
        <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:16, lineHeight:1.6 }}>Revisa tu email <strong style={{ color:"#4a8fff" }}>{email}</strong></div>
        <button onClick={onLogin} style={{ ...btnP, width:"100%" }}>→ Iniciar sesión</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <style>{GS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:24 }}>
        <div style={{ width:52, height:52, background:"#002D72", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔗</div>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:14 }}>RD</span></div>
      </div>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
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

// ── TILE BRAND COLORS ──────────────────────────────────────────
const BRAND = {
  macys:       { bg:"linear-gradient(145deg,#2a0808,#1a0404,#3a0e0e)", color:"#f0a0a0" },
  zara:        { bg:"linear-gradient(145deg,#0e0e0e,#080808,#161616)", color:"rgba(255,255,255,.85)" },
  nordstrom:   { bg:"linear-gradient(145deg,#181820,#101018,#201f2a)", color:"rgba(190,205,255,.8)" },
  hm:          { bg:"linear-gradient(145deg,#280008,#1e0005,#360010)", color:"#ff7090" },
  uniqlo:      { bg:"linear-gradient(145deg,#1a0000,#120000,#240000)", color:"#ff4444" },
  forever21:   { bg:"linear-gradient(145deg,#1c0a14,#140810,#240f1c)", color:"rgba(255,170,195,.8)" },
  ralph:       { bg:"linear-gradient(145deg,#00102a,#000a1e,#001838)", color:"rgba(150,195,255,.8)" },
  tommy:       { bg:"linear-gradient(145deg,#1a0008,#100005,#22000c)", color:"rgba(255,210,215,.8)" },
  ae:          { bg:"linear-gradient(145deg,#0a1825,#060f1a,#102030)", color:"rgba(130,185,255,.8)" },
  oldnavy:     { bg:"linear-gradient(145deg,#001840,#000f28,#002050)", color:"rgba(100,165,255,.8)" },
  levis:       { bg:"linear-gradient(145deg,#1a0005,#120003,#220008)", color:"#ff6680" },
  nike:        { bg:"linear-gradient(145deg,#060606,#040404,#0a0a0a)", color:"rgba(255,255,255,.95)" },
  adidas:      { bg:"linear-gradient(145deg,#0c1000,#080b00,#141800)", color:"rgba(200,220,0,.9)" },
  nb:          { bg:"linear-gradient(145deg,#0c0018,#080012,#120022)", color:"rgba(175,135,255,.9)" },
  hoka:        { bg:"linear-gradient(145deg,#000612,#00040d,#000e1e)", color:"rgba(195,225,0,.9)" },
  on:          { bg:"linear-gradient(145deg,#1e0400,#160300,#280600)", color:"rgba(255,135,95,.9)" },
  reebok:      { bg:"linear-gradient(145deg,#0e001e,#090015,#140028)", color:"rgba(195,155,255,.85)" },
  vans:        { bg:"linear-gradient(145deg,#1c0010,#140008,#240018)", color:"rgba(255,150,200,.85)" },
  footlocker:  { bg:"linear-gradient(145deg,#1e0000,#160000,#280000)", color:"rgba(255,100,100,.85)" },
  brooks:      { bg:"linear-gradient(145deg,#001a18,#001210,#002220)", color:"rgba(100,220,200,.85)" },
  sephora:     { bg:"linear-gradient(145deg,#080808,#050505,#0e0e0e)", color:"rgba(255,255,255,.85)" },
  bathandbody: { bg:"linear-gradient(145deg,#001a08,#000f05,#002210)", color:"rgba(155,215,155,.85)" },
  ulta:        { bg:"linear-gradient(145deg,#180020,#100018,#200028)", color:"rgba(255,95,175,.9)" },
  bestbuy:     { bg:"linear-gradient(145deg,#000820,#000518,#001030)", color:"#ffe000" },
  apple:       { bg:"linear-gradient(145deg,#141414,#0e0e0e,#1a1a1a)", color:"rgba(255,255,255,.8)" },
  amazon:      { bg:"linear-gradient(145deg,#0a1020,#060c18,#101828)", color:"#ff9900" },
  ikea:        { bg:"linear-gradient(145deg,#002060,#001840,#003080)", color:"#ffe000" },
  target:      { bg:"linear-gradient(145deg,#200000,#180000,#2a0000)", color:"#ff6060" },
  walmart:     { bg:"linear-gradient(145deg,#001535,#000e25,#002050)", color:"#ffc220" },
  kohls:       { bg:"linear-gradient(145deg,#0a0020,#060015,#100030)", color:"rgba(100,100,255,.9)" },
  wayfair:     { bg:"linear-gradient(145deg,#1a0830,#100520,#220a40)", color:"rgba(200,140,255,.85)" },
  dicks:       { bg:"linear-gradient(145deg,#001030,#000820,#001840)", color:"rgba(100,165,255,.85)" },
  rei:         { bg:"linear-gradient(145deg,#001a08,#001205,#002210)", color:"rgba(130,215,130,.85)" },
  gnc:         { bg:"linear-gradient(145deg,#1e0800,#160500,#280a00)", color:"rgba(255,140,80,.85)" },
  patagonia:   { bg:"linear-gradient(145deg,#001818,#001010,#002020)", color:"rgba(100,220,180,.85)" },
  columbia:    { bg:"linear-gradient(145deg,#000e30,#000820,#001540)", color:"rgba(100,180,255,.85)" },
};

function Tile({ slug, name, cb, hot }) {
  const b = BRAND[slug] || { bg:"linear-gradient(145deg,#161616,#1e1e1e)", color:"#a0a2aa" };
  return (
    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", width:72 }}>
      <div style={{ width:64, height:64, borderRadius:15, background:b.bg, border:"1px solid rgba(255,255,255,0.06)", position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,.5)", transition:"transform .18s" }}>
        {hot && <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#ff3355", border:"1.5px solid rgba(255,255,255,.15)", zIndex:5, animation:"pulse 2s infinite" }}/>}
        <span style={{ fontFamily:"'Clash Display',sans-serif", fontSize:10, fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase", color:b.color, textAlign:"center", lineHeight:1.3, padding:"0 4px", zIndex:2, position:"relative" }}>{name}</span>
        <div style={{ position:"absolute", bottom:5, left:0, right:0, textAlign:"center", fontFamily:"'Clash Display',sans-serif", fontSize:7, fontWeight:700, color:b.color, opacity:.4, zIndex:2 }}>{cb}% CB</div>
        <div style={{ position:"absolute", top:0, left:"-100%", width:"60%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)", animation:"shimmer 4s infinite", zIndex:3 }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)", zIndex:4 }}/>
      </div>
      <div style={{ fontSize:8.5, color:"#a0a2aa", textAlign:"center", lineHeight:1.2, width:"100%" }}>{name}</div>
      <div style={{ fontSize:8, color:"#4caf82", textAlign:"center", fontWeight:600 }}>{cb}% cashback</div>
    </div>
  );
}

// ── CAROUSEL ──────────────────────────────────────────────────
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
    clearInterval(intervalRef.current);
    progressRef.current = 0;
    setProgress(0);
    intervalRef.current = setInterval(() => {
      progressRef.current += 100 / 40;
      setProgress(Math.min(progressRef.current, 100));
      if (progressRef.current >= 100) {
        const next = (slide + 1) % 4;
        setCur(next);
        startInterval(next);
      }
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
      <div style={{ fontSize:7, opacity:.5, textTransform:"uppercase", letterSpacing:.5 }}>seg</div>
    </div>
  );

  const SLIDES = [
    {
      bg:"linear-gradient(135deg,#0d001a,#1a0030,#000d1a)",
      grid:"rgba(74,143,255,0.04)",
      glow1:"rgba(74,143,255,0.25)",glow2:"rgba(168,85,247,0.15)",
      eyebrow:"Solo hoy · Termina en",eyebrowColor:"rgba(74,143,255,.7)",
      showCd:true,
      title:<>Ofertas<br/><span style={{ color:"#4a8fff" }}>del día</span> 🔥</>,
      sub:"Hasta 28% OFF en tus marcas favoritas",
      btn:{ label:"Ver ofertas →", bg:"#4a8fff", shadow:"rgba(74,143,255,.4)", action:"stores" },
      float:"🛍️", floatLabel:"FLASH DEALS", floatBg:"rgba(255,255,255,.08)", floatBorder:"rgba(255,255,255,.12)", floatColor:"rgba(255,255,255,.6)"
    },
    {
      bg:"linear-gradient(135deg,#0d0005,#1a0020,#000d1a)",
      glow1:"rgba(255,0,80,0.25)",glow2:"rgba(0,242,234,0.15)",
      eyebrow:"Nuevo servicio",eyebrowColor:"rgba(0,242,234,.65)",
      title:<>TikTok <span style={{ color:"#ff0050" }}>Shop</span><br/>en <span style={{ color:"#00f2ea" }}>RD</span> 🇩🇴</>,
      sub:"Ve el producto, pega el link — nosotros lo compramos",
      btn:{ label:"Pegar mi link →", bg:"#ff0050", shadow:"rgba(255,0,80,.4)", action:"neworder" },
      float:"🎵", floatLabel:"TikTok Shop", floatBg:"rgba(255,0,80,.15)", floatBorder:"rgba(255,0,80,.3)", floatColor:"#ff0050"
    },
    {
      bg:"linear-gradient(135deg,#001020,#002040,#000810)",
      glow1:"rgba(74,143,255,0.3)",
      eyebrow:"Calzado Premium",eyebrowColor:"rgba(74,143,255,.65)",
      title:<>Nike, HOKA<br/><span style={{ color:"#4a8fff" }}>Adidas & más</span></>,
      sub:"Las mejores marcas de USA directo a RD",
      btn:{ label:"Ver calzado →", bg:"rgba(74,143,255,.15)", shadow:"transparent", action:"stores", border:"1px solid rgba(74,143,255,.3)", color:"#4a8fff" },
      float:"👟", floatLabel:"12% CB", floatBg:"rgba(74,143,255,.15)", floatBorder:"rgba(74,143,255,.3)", floatColor:"#4a8fff"
    },
    {
      bg:"linear-gradient(135deg,#1a0800,#2a1000,#0d0500)",
      glow1:"rgba(235,105,31,0.3)",
      eyebrow:"Artesanal desde USA",eyebrowColor:"rgba(255,180,80,.65)",
      title:<><span style={{ color:"#eb691f" }}>Etsy</span> ahora<br/>llega a <span style={{ color:"#f0b429" }}>RD</span></>,
      sub:"Único, hecho a mano y personalizado",
      btn:{ label:"Explorar Etsy →", bg:"#eb691f", shadow:"rgba(235,105,31,.4)", action:"stores" },
      float:"🧶", floatLabel:"NUEVO", floatBg:"rgba(235,105,31,.15)", floatBorder:"rgba(235,105,31,.3)", floatColor:"#eb691f"
    },
  ];

  const sl = SLIDES[cur];

  return (
    <div style={{ height:200, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:sl.bg, transition:"background .6s" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at 70% 30%,${sl.glow1||"transparent"},transparent 55%)${sl.glow2 ? `,radial-gradient(circle at 20% 80%,${sl.glow2},transparent 45%)` : ""}` }}/>
        {sl.grid && <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${sl.grid} 1px,transparent 1px),linear-gradient(90deg,${sl.grid} 1px,transparent 1px)`, backgroundSize:"18px 18px" }}/>}
      </div>

      {/* Float right */}
      <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:7, zIndex:2, maxWidth:"35%" }}>
        <div style={{ fontSize:46, animation:"float 3s ease-in-out infinite", filter:"drop-shadow(0 8px 14px rgba(0,0,0,.4))" }}>{sl.float}</div>
        <div style={{ background:sl.floatBg, border:`1px solid ${sl.floatBorder}`, borderRadius:7, padding:"3px 9px", fontFamily:"'Clash Display',sans-serif", fontSize:8, fontWeight:700, color:sl.floatColor }}>{sl.floatLabel}</div>
      </div>

      {/* Content left */}
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

      {/* Dots */}
      <div style={{ position:"absolute", bottom:10, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5, zIndex:10 }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => goSlide(i)} style={{ width: cur === i ? 20 : 6, height:6, borderRadius: cur === i ? 3 : "50%", background: cur === i ? "white" : "rgba(255,255,255,.3)", transition:"all .3s", cursor:"pointer" }}/>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"rgba(255,255,255,.1)", zIndex:10 }}>
        <div style={{ height:"100%", width:`${progress}%`, background:"#4a8fff", borderRadius:1, transition:"width .1s linear" }}/>
      </div>
    </div>
  );
}

// ── ACCORDION CATEGORIES ──────────────────────────────────────
const CATS = [
  {
    id:"moda", icon:"👗", name:"Moda & Ropa", sub:"13 tiendas · Macy's, Zara, Uniqlo...",
    color:"rgba(255,51,85,.10)", border:"rgba(255,51,85,.18)",
    stores:[
      { slug:"macys", name:"Macy's", cb:15, hot:true },
      { slug:"zara", name:"Zara", cb:12 },
      { slug:"nordstrom", name:"Nordstrom", cb:10 },
      { slug:"hm", name:"H&M", cb:10 },
      { slug:"uniqlo", name:"Uniqlo", cb:10 },
      { slug:"forever21", name:"Forever 21", cb:8 },
      { slug:"ralph", name:"Ralph Lauren", cb:8 },
      { slug:"tommy", name:"Tommy H.", cb:8 },
      { slug:"ae", name:"Am. Eagle", cb:7 },
      { slug:"oldnavy", name:"Old Navy", cb:6 },
      { slug:"levis", name:"Levi's", cb:8 },
    ]
  },
  {
    id:"calzado", icon:"👟", name:"Calzado & Sneakers", sub:"8 tiendas · Nike, Adidas, HOKA...",
    color:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.18)",
    stores:[
      { slug:"nike", name:"Nike", cb:12, hot:true },
      { slug:"adidas", name:"Adidas", cb:10 },
      { slug:"nb", name:"New Balance", cb:10 },
      { slug:"hoka", name:"HOKA", cb:8 },
      { slug:"on", name:"On Cloud", cb:7 },
      { slug:"reebok", name:"Reebok", cb:8 },
      { slug:"vans", name:"Vans", cb:7 },
      { slug:"footlocker", name:"Foot Locker", cb:6 },
    ]
  },
  {
    id:"belleza", icon:"💄", name:"Belleza & Cuidado", sub:"5 tiendas · Sephora, Ulta, Bath & Body...",
    color:"rgba(204,0,102,.10)", border:"rgba(204,0,102,.18)",
    stores:[
      { slug:"sephora", name:"Sephora", cb:15, hot:true },
      { slug:"bathandbody", name:"Bath & Body", cb:10 },
      { slug:"ulta", name:"Ulta Beauty", cb:8 },
    ]
  },
  {
    id:"tech", icon:"💻", name:"Tecnología", sub:"4 tiendas · Best Buy, Apple, Amazon...",
    color:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.18)",
    stores:[
      { slug:"bestbuy", name:"Best Buy", cb:8 },
      { slug:"apple", name:"Apple", cb:5 },
      { slug:"amazon", name:"Amazon", cb:10 },
    ]
  },
  {
    id:"hogar", icon:"🏠", name:"Hogar & Decoración", sub:"4 tiendas · IKEA, Target, Wayfair...",
    color:"rgba(76,175,130,.10)", border:"rgba(76,175,130,.18)",
    stores:[
      { slug:"ikea", name:"IKEA", cb:5 },
      { slug:"target", name:"Target", cb:8 },
      { slug:"wayfair", name:"Wayfair", cb:6 },
    ]
  },
  {
    id:"deportes", icon:"🏋️", name:"Deportes & Outdoor", sub:"5 tiendas · Dick's, REI, Patagonia...",
    color:"rgba(200,16,46,.10)", border:"rgba(200,16,46,.18)",
    stores:[
      { slug:"dicks", name:"Dick's Sports", cb:6, hot:true },
      { slug:"rei", name:"REI", cb:5 },
      { slug:"gnc", name:"GNC", cb:5 },
      { slug:"patagonia", name:"Patagonia", cb:4 },
      { slug:"columbia", name:"Columbia", cb:4 },
    ]
  },
  {
    id:"grandes", icon:"🛒", name:"Grandes Superficies", sub:"4 tiendas · Walmart, Target, Amazon...",
    color:"rgba(240,180,41,.10)", border:"rgba(240,180,41,.18)",
    stores:[
      { slug:"walmart", name:"Walmart", cb:8, hot:true },
      { slug:"target", name:"Target", cb:8 },
      { slug:"amazon", name:"Amazon", cb:10 },
      { slug:"kohls", name:"Kohl's", cb:6 },
    ]
  },
];

function AccordionSection({ onNav }) {
  const [open, setOpen] = useState("moda");
  const toggle = (id) => setOpen(prev => prev === id ? null : id);

  return (
    <div style={{ margin:"12px 14px 0", borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", background:"#161616" }}>
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
            <div style={{ maxHeight: isOpen ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1a1a1a", borderTop: isOpen ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div style={{ display:"flex", gap:10, padding:"14px 14px 16px", overflowX:"auto" }}>
                {cat.stores.map(store => (
                  <Tile key={store.slug} {...store} />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* TikTok Shop */}
      <TikTokRow onNav={onNav} />

      {/* Etsy */}
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
      <div style={{ maxHeight: open ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1a1a1a" }}>
        <div style={{ padding:"12px 14px 14px" }}>
          <div style={{ background:"linear-gradient(135deg,#0d0005,#1a0020)", borderRadius:14, padding:"13px 13px", border:"1px solid rgba(255,0,80,.18)", position:"relative", overflow:"hidden" }}>
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
      <div style={{ maxHeight: open ? 200 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)", background:"#1a1a1a" }}>
        <div style={{ padding:"12px 14px 14px" }}>
          <div style={{ background:"linear-gradient(135deg,#1a0800,#2a1000)", borderRadius:14, padding:"13px 13px", border:"1px solid rgba(235,105,31,.18)", position:"relative", overflow:"hidden" }}>
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

// ── INFO BANNERS ───────────────────────────────────────────────
function InfoBanners({ onNav }) {
  const [openHow, setOpenHow] = useState(false);
  const [openWhy, setOpenWhy] = useState(false);

  return (
    <div style={{ padding:"12px 14px 0", display:"flex", flexDirection:"column", gap:10 }}>

      {/* Cómo funciona */}
      <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div onClick={() => setOpenHow(p => !p)} style={{ background:"linear-gradient(135deg,#001830,#002850,#001020)", padding:"14px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(74,143,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(74,143,255,.05) 1px,transparent 1px)", backgroundSize:"14px 14px" }}/>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(74,143,255,.15)", border:"1px solid rgba(74,143,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, zIndex:1 }}>⚙️</div>
          <div style={{ flex:1, zIndex:1 }}>
            <div style={{ fontSize:8.5, color:"rgba(74,143,255,.6)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Simple y transparente</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white" }}>Cómo funciona <span style={{ color:"#7ab0ff" }}>USAlinkRD</span></div>
          </div>
          <div style={{ fontSize:18, color:"rgba(255,255,255,.35)", transition:"transform .3s", transform: openHow ? "rotate(90deg)" : "rotate(0deg)", zIndex:1 }}>›</div>
        </div>
        <div style={{ maxHeight: openHow ? 500 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ background:"#161616", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
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

      {/* Por qué elegir */}
      <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ height:3, background:"linear-gradient(90deg,#002D72 33%,#1e1e1e 33%,#1e1e1e 66%,#BF0A30 66%)" }}/>
        <div onClick={() => setOpenWhy(p => !p)} style={{ background:"#161616", padding:"13px 16px", display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none" }}>
          <div style={{ width:38, height:38, borderRadius:11, background:"rgba(240,180,41,.12)", border:"1px solid rgba(240,180,41,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🇩🇴</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:8.5, color:"rgba(240,180,41,.55)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>Nuestra promesa</div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontSize:15, fontWeight:700, color:"white" }}>Por qué elegir <span style={{ color:"#f0b429" }}>USAlinkRD</span></div>
          </div>
          <div style={{ fontSize:18, color:"#555866", transition:"transform .3s", transform: openWhy ? "rotate(90deg)" : "rotate(0deg)" }}>›</div>
        </div>
        <div style={{ maxHeight: openWhy ? 500 : 0, overflow:"hidden", transition:"max-height .4s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ background:"#161616", borderTop:"1px solid rgba(255,255,255,.04)" }}>
            {[
              { icon:"🇩🇴", bg:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.20)", title:"Paga en RD, sin tarjeta americana", sub:"Transferencia, tarjeta dominicana o efectivo. Sin rechazos bancarios." },
              { icon:"📸", bg:"rgba(255,51,85,.10)", border:"rgba(255,51,85,.18)", title:"Evidencia fotográfica en cada paso", sub:"Foto de compra, tracking real y foto de entrega. Sin sorpresas." },
              { icon:"✈️", bg:"rgba(74,143,255,.10)", border:"rgba(74,143,255,.20)", title:"Casillero Miami incluido", sub:"5-8 días a RD. Tiendas que no envían a LATAM — nosotros sí." },
              { icon:"🛡️", bg:"rgba(76,175,130,.12)", border:"rgba(76,175,130,.22)", title:"Sistema anti-fraude verificado", sub:"Score de confianza, contrato digital y respaldo total." },
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

  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>

      {/* TopBar */}
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Tiendas <span style={{ color:"#4a8fff" }}>USA</span></div>
        <div style={{ display:"flex", gap:7 }}>
          <div style={{ width:33, height:33, background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🔍</div>
          <div style={{ width:33, height:33, background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, position:"relative" }}>
            🔔<div style={{ position:"absolute", top:-3, right:-3, width:8, height:8, background:"#ff3355", borderRadius:"50%", border:"2px solid #0d0d0d", animation:"pulse 2s infinite" }}/>
          </div>
        </div>
      </div>

      {/* 1. PERFIL DEL CLIENTE */}
      <div style={{ padding:"14px 14px 0" }}>
        <div style={{ background:"#161616", borderRadius:18, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:12, boxShadow:"0 4px 24px rgba(0,0,0,.45)" }}>
          <div style={{ height:64, background:"linear-gradient(135deg,#002D72 0%,#1a3d8a 50%,#BF0A30 100%)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"16px 16px" }}/>
            <div style={{ position:"absolute", top:10, right:14, fontSize:14, opacity:.3 }}>🇩🇴⛓🇺🇸</div>
          </div>
          <div style={{ padding:"0 14px 14px" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-26, marginBottom:10 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4a8fff,#002D72)", border:"2.5px solid #161616", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>😊</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(240,180,41,0.12)", border:"1px solid rgba(240,180,41,0.22)", borderRadius:50, padding:"4px 10px" }}>
                <span style={{ fontSize:11 }}>⭐</span>
                <span style={{ fontSize:9, fontWeight:700, color:"#f0b429", fontFamily:"'Clash Display',sans-serif" }}>COMPRADOR GOLD</span>
              </div>
            </div>
            <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:17, color:"white", marginBottom:1 }}>{profile?.full_name || "Mi cuenta"}</div>
            <div style={{ fontSize:10, color:"#555866", marginBottom:10 }}>Miembro desde {profile ? new Date(profile.created_at).getFullYear() : "2024"}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:10 }}>
              {[
                { n:profile?.trust_score||50, l:"Trust Score", c:"#4a8fff" },
                { n:profile?.total_orders||0, l:"Pedidos", c:"#f0b429" },
                { n:profile?.disputes||0, l:"Disputas", c:"#4caf82" },
                { n:`RD$${((profile?.purchase_limit||8000)/1000).toFixed(0)}k`, l:"Límite", c:"#ff3355" },
              ].map((s,i) => (
                <div key={i} style={{ background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"8px 4px", textAlign:"center", borderBottom:`2px solid ${s.c}` }}>
                  <div style={{ fontWeight:700, fontSize:14, color:s.c }}>{s.n}</div>
                  <div style={{ fontSize:7, color:"#555866", textTransform:"uppercase", letterSpacing:".4px" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ fontSize:10, color:"#a0a2aa", whiteSpace:"nowrap" }}>Confianza</div>
              <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${profile?.trust_score||50}%`, background:"linear-gradient(90deg,#4a8fff,#7ab0ff)", borderRadius:3 }}/>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff", whiteSpace:"nowrap" }}>{profile?.trust_score||50}/100</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={() => onNav("neworder")} style={{ ...btnP }}>➕ Nuevo pedido</button>
              <button onClick={() => onNav("orders")} style={{ ...btnS }}>📋 Ver historial</button>
            </div>
          </div>
        </div>

        {/* Tasa */}
        <div style={{ background:"#161616", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ fontSize:11, color:"#a0a2aa" }}>💱 Tasa del día</div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:14, color:"#4a8fff" }}>$1 USD = RD${Number(rate).toFixed(2)}</div>
        </div>
      </div>

      {/* 2. CAROUSEL */}
      <Carousel onNav={onNav} />

      {/* 3. TICKER */}
      <div style={{ overflow:"hidden", borderTop:"1px solid rgba(255,255,255,.04)", borderBottom:"1px solid rgba(255,255,255,.04)", padding:"7px 0", background:"#161616" }}>
        <div style={{ display:"flex", whiteSpace:"nowrap", animation:"ticker 30s linear infinite" }}>
          {[
            "● Nike Pegasus 41 · $149 · RD$11,200",
            "● HOKA Clifton 9 · $145 · RD$10,800",
            "● Macy's Hasta 15% cashback",
            "● Sephora Set Skincare · $45 · RD$3,375",
            "● Adidas Ultraboost · $90 · RD$6,750",
            "● TikTok Shop · Pega tu link y listo",
            "● Etsy · Joyería personalizada desde $15",
            "● Nike Pegasus 41 · $149 · RD$11,200",
            "● HOKA Clifton 9 · $145 · RD$10,800",
            "● Macy's Hasta 15% cashback",
          ].map((item, i) => (
            <span key={i} style={{ display:"inline-block", padding:"0 16px", fontSize:10, color:"#555866" }}>
              <strong style={{ color:"#4a8fff" }}>{item.split(" ")[0]}</strong> {item.slice(item.indexOf(" ") + 1)}
            </span>
          ))}
        </div>
      </div>

      {/* 4. ACCORDION */}
      <AccordionSection onNav={onNav} />

      {/* 5. INFO BANNERS */}
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
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Tiendas <span style={{ color:"#4a8fff" }}>USA</span></div>
      </div>
      <div style={{ display:"flex", gap:7, padding:"12px 14px", overflowX:"auto" }}>
        {CATS2.map(c => <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: cat === c.id ? "#4a8fff" : "#161616", color: cat === c.id ? "white" : "#555866", outline: cat === c.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>{c.l}</button>)}
      </div>
      <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:8 }}>
        {list.map(store => (
          <div key={store.id} style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:11, background:store.color||"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>{store.name.slice(0,3).toUpperCase()}</div>
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
  async function submit() {
    if (!url || !price) return; setLoading(true); setError("");
    const { error } = await sb.from("orders").insert({ user_id: user.id, product_url: url, product_name: name || "Producto", price_usd: usd, exchange_rate: rate, status: "pending" });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true); setLoading(false);
  }
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, gap:16 }}>
      <style>{GS}</style>
      <div style={{ fontSize:56 }}>🎉</div>
      <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:22, color:"white", textAlign:"center" }}>¡Pedido creado!</div>
      <div style={{ fontSize:13, color:"#a0a2aa", textAlign:"center", lineHeight:1.6 }}>Tu pedido fue recibido. Te contactaremos por WhatsApp para confirmar el pago.</div>
      <button onClick={() => { setDone(false); setUrl(""); setName(""); setPrice(""); onNav("orders"); }} style={{ ...btnP, padding:"13px 32px" }}>Ver mis pedidos →</button>
    </div>
  );
  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Nuevo <span style={{ color:"#4a8fff" }}>Pedido</span></div>
      </div>
      <div style={{ padding:"16px 16px", display:"flex", flexDirection:"column", gap:14 }}>
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
        {price && (
          <div style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:14 }}>
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
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Mis <span style={{ color:"#4a8fff" }}>Pedidos</span></div>
      </div>
      <div style={{ display:"flex", gap:7, padding:"12px 14px", overflowX:"auto" }}>
        {[{ id:"all", l:"Todos" },{ id:"active", l:"✈️ En camino" },{ id:"delivered", l:"✅ Entregados" },{ id:"cancelled", l:"❌ Cancelados" }].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: filter === f.id ? "#4a8fff" : "#161616", color: filter === f.id ? "white" : "#555866", outline: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>{f.l}</button>
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
          return (
            <div key={order.id} style={{ background:"#161616", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
              <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", gap:10, borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ width:34, height:34, borderRadius:9, background:order.stores?.color||"#1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>{(order.stores?.name||"?").slice(0,3).toUpperCase()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:"white" }}>{order.stores?.name||"Tienda USA"}</div>
                  <div style={{ fontSize:9, color:"#555866" }}>#{order.order_number} · {new Date(order.created_at).toLocaleDateString("es-DO")}</div>
                </div>
                <div style={{ background:`${st.c}20`, border:`1px solid ${st.c}40`, borderRadius:6, padding:"3px 8px", fontSize:9, fontWeight:700, color:st.c }}>{st.l}</div>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontWeight:600, fontSize:12, color:"white", marginBottom:3 }}>{order.product_name||"Producto"}</div>
                <div style={{ fontWeight:700, fontSize:15, color:"white" }}>${order.price_usd?.toFixed(2)} USD</div>
                {order.total_dop && <div style={{ fontSize:10, color:"#4a8fff" }}>≈ RD${Number(order.total_dop).toLocaleString("es-DO",{minimumFractionDigits:2})}</div>}
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
  const MENU = [
    { icon:"👤", label:"Información personal", sub:"Nombre, teléfono, cédula", bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)" },
    { icon:"📍", label:"Direcciones de envío", sub:"2 guardadas", bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"💳", label:"Métodos de pago", sub:"Transferencia · Tarjeta", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
    { icon:"📦", label:"Historial de pedidos", sub:`${profile?.total_orders||0} pedidos`, bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)", nav:"orders" },
    { icon:"💰", label:"Mi cashback", sub:`RD$${Number(profile?.cashback_balance||0).toLocaleString()} disponibles`, bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"🥇", label:"Mi membresía Gold", sub:"Ver beneficios · Subir a Elite", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
    { icon:"🔔", label:"Notificaciones", sub:"Pedidos, ofertas, alertas", bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)" },
  ];
  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:18, color:"white" }}>Mi <span style={{ color:"#4a8fff" }}>Perfil</span></div>
        <div style={{ width:33, height:33, background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚙️</div>
      </div>
      <div style={{ background:"#161616", overflow:"hidden" }}>
        <div style={{ height:72, background:"linear-gradient(135deg,#002D72,#1a3d8a,#BF0A30)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"16px 16px" }}/>
        </div>
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-26, marginBottom:10 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4a8fff,#002D72)", border:"2.5px solid #161616", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>😊</div>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(240,180,41,0.12)", border:"1px solid rgba(240,180,41,0.22)", borderRadius:50, padding:"5px 11px" }}>
              <span style={{ fontSize:12 }}>🥇</span><span style={{ fontSize:9, fontWeight:700, color:"#f0b429", fontFamily:"'Clash Display',sans-serif" }}>COMPRADOR GOLD</span>
            </div>
          </div>
          <div style={{ fontFamily:"'Clash Display',sans-serif", fontWeight:700, fontSize:17, color:"white" }}>{profile?.full_name||"Mi cuenta"}</div>
          <div style={{ fontSize:11, color:"#555866", marginBottom:12 }}>{profile?.email||""}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:10 }}>
            {[
              { n:profile?.trust_score||50, l:"Trust", c:"#4a8fff" },
              { n:profile?.total_orders||0, l:"Pedidos", c:"#f0b429" },
              { n:profile?.disputes||0, l:"Disputas", c:"#4caf82" },
              { n:`RD$${((profile?.purchase_limit||8000)/1000).toFixed(0)}k`, l:"Límite", c:"#ff3355" },
            ].map((s,i) => (
              <div key={i} style={{ background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"8px 4px", textAlign:"center", borderBottom:`2px solid ${s.c}` }}>
                <div style={{ fontWeight:700, fontSize:13, color:s.c }}>{s.n}</div>
                <div style={{ fontSize:7, color:"#555866", textTransform:"uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:10, color:"#a0a2aa" }}>Confianza</div>
            <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${profile?.trust_score||50}%`, background:"linear-gradient(90deg,#4a8fff,#7ab0ff)", borderRadius:3 }}/>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff" }}>{profile?.trust_score||50}/100</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"14px 14px 0" }}>
        <div style={{ background:"#161616", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
          {MENU.map((item,i) => (
            <div key={i} onClick={() => item.nav && onNav(item.nav)} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", borderBottom: i < MENU.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: item.nav ? "pointer" : "default" }}>
              <div style={{ width:34, height:34, borderRadius:10, background:item.bg, border:`1px solid ${item.br}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{item.icon}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:500, color:"white" }}>{item.label}</div><div style={{ fontSize:10, color:"#555866" }}>{item.sub}</div></div>
              <div style={{ fontSize:15, color:"#555866" }}>›</div>
            </div>
          ))}
        </div>
        <div style={{ background:"#161616", borderRadius:16, border:"1px solid rgba(255,51,85,0.1)", overflow:"hidden", marginTop:10 }}>
          <div onClick={signOut} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", cursor:"pointer" }}>
            <div style={{ width:34, height:34, borderRadius:10, background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🚪</div>
            <div style={{ fontSize:12, fontWeight:500, color:"#ff3355" }}>Cerrar sesión</div>
          </div>
        </div>
        <div style={{ textAlign:"center", padding:16, fontSize:10, color:"#555866" }}>
          <strong style={{ color:"#a0a2aa" }}>USAlinkRD</strong> v2.0 · Hecho con ❤️ en República Dominicana
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <RateProvider>
        <Router />
      </RateProvider>
    </AuthProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState("home");
  const [authScreen, setAuthScreen] = useState("login");
  if (loading) return <Splash />;
  if (!user) return authScreen === "login"
    ? <Login onRegister={() => setAuthScreen("register")} />
    : <Register onLogin={() => setAuthScreen("login")} />;
  const SCREENS = { home:Home, stores:Stores, neworder:NewOrder, orders:Orders, profile:Profile };
  const Screen = SCREENS[screen] || Home;
  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:390, position:"relative" }}>
        <Screen onNav={setScreen} />
        <BottomNav screen={screen} onNav={setScreen} />
      </div>
    </div>
  );
}

