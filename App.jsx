import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL  = "https://kugdrwxthmcscrvlszws.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z2Ryd3h0aG1jc2NydmxzendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDU4NjIsImV4cCI6MjA5NDEyMTg2Mn0.G4qXcDgoLvarYC8fvr5TrkiigvKBXRxVYOXiauyADic";
export const sb = createClient(SUPA_URL, SUPA_ANON);

// ── CONTEXTS ──────────────────────────────────────────────────
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
    setProfile(data);
    setLoading(false);
  }

  async function signOut() {
    await sb.auth.signOut();
    setUser(null); setProfile(null);
  }

  return (
    <AuthCtx.Provider value={{ user, profile, loading, signOut, loadProfile }}>
      {children}
    </AuthCtx.Provider>
  );
}

function RateProvider({ children }) {
  const [rate, setRate] = useState(75);
  useEffect(() => {
    sb.from("exchange_rates").select("rate")
      .order("recorded_at", { ascending: false }).limit(1).single()
      .then(({ data }) => { if (data) setRate(Number(data.rate)); });
  }, []);
  return <RateCtx.Provider value={rate}>{children}</RateCtx.Provider>;
}

// ── GLOBAL STYLES ─────────────────────────────────────────────
const GS = `
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  body{background:#0d0d0d;font-family:'DM Sans',sans-serif;color:#f0f0f0;}
  ::-webkit-scrollbar{display:none;}
  input::placeholder{color:#555866;}
  button{font-family:'DM Sans',sans-serif;}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
  @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
`;

// ── BUTTON STYLES ─────────────────────────────────────────────
const btnP = { padding:"10px 16px", borderRadius:11, background:"#4a8fff", color:"white", fontWeight:700, fontSize:11, border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(74,143,255,0.3)" };
const btnS = { padding:"10px 16px", borderRadius:11, background:"#1e1e1e", color:"#a0a2aa", fontWeight:700, fontSize:11, border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer" };
const inp  = { width:"100%", background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"13px 14px", color:"#f0f0f0", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" };

// ── BOTTOM NAV ────────────────────────────────────────────────
const NAV = [
  { id:"home",     label:"Inicio",  icon:"🏠" },
  { id:"stores",   label:"Tiendas", icon:"🏪" },
  { id:"neworder", label:"Pedir",   icon:"➕" },
  { id:"orders",   label:"Pedidos", icon:"📦" },
  { id:"profile",  label:"Perfil",  icon:"◎"  },
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

// ── TOPBAR ────────────────────────────────────────────────────
function TopBar({ title, accent, right }) {
  return (
    <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ fontWeight:700, fontSize:18, color:"#f0f0f0" }}>
        {title}{accent && <span style={{ color:"#4a8fff" }}> {accent}</span>}
      </div>
      {right}
    </div>
  );
}

// ── SPLASH ────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16 }}>
      <style>{GS}</style>
      <div style={{ width:64, height:64, background:"#002D72", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🔗</div>
      <div style={{ fontWeight:700, fontSize:22, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:16 }}>RD</span></div>
      <div style={{ width:32, height:32, border:"2px solid rgba(74,143,255,0.2)", borderTop:"2px solid #4a8fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────
function Login({ onRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [sent, setSent]         = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  }
  async function handleMagic() {
    if (!email) { setError("Escribe tu email primero"); return; }
    setLoading(true);
    const { error } = await sb.auth.signInWithOtp({ email });
    if (error) setError(error.message); else setSent(true);
    setLoading(false);
  }

  if (sent) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
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
        <div style={{ fontWeight:700, fontSize:24, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:16 }}>RD</span></div>
        <div style={{ fontSize:11, color:"#555866" }}>Tu acceso a las mejores tiendas de USA</div>
      </div>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"white", textAlign:"center", marginBottom:4 }}>Bienvenido de vuelta</div>
        <div style={{ fontSize:12, color:"#a0a2aa", textAlign:"center", marginBottom:20 }}>Inicia sesión en tu cuenta</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355", marginBottom:14 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Email</label>
            <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inp} required />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Contraseña</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={inp} required />
          </div>
          <button type="submit" style={{ ...btnP, width:"100%", opacity:loading?.7:1 }} disabled={loading}>
            {loading ? "Entrando..." : "🔑 Iniciar sesión"}
          </button>
        </form>
        <div style={{ textAlign:"center", color:"#555866", fontSize:12, margin:"16px 0" }}>— o —</div>
        <button onClick={handleMagic} style={{ width:"100%", padding:"10px 16px", borderRadius:11, background:"rgba(124,58,237,0.12)", border:"1px solid rgba(124,58,237,0.25)", color:"#a855f7", fontWeight:600, fontSize:13, cursor:"pointer" }} disabled={loading}>
          ✨ Entrar con link mágico
        </button>
        <div style={{ textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16 }}>
          ¿No tienes cuenta?{" "}<span onClick={onRegister} style={{ color:"#4a8fff", cursor:"pointer", fontWeight:600 }}>Regístrate</span>
        </div>
      </div>
      <div style={{ textAlign:"center", fontSize:11, color:"#555866", marginTop:16 }}>🇩🇴 República Dominicana × 🇺🇸 USA</div>
    </div>
  );
}

// ── REGISTER ──────────────────────────────────────────────────
function Register({ onLogin }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone]       = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);

  async function handleRegister(e) {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: authError } = await sb.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } });
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) await sb.from("users").upsert({ id: data.user.id, email, full_name: fullName, phone, plan: "guest" });
    setDone(true); setLoading(false);
  }

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 22px", maxWidth:360, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:14 }}>🎉</div>
        <div style={{ fontWeight:700, fontSize:20, color:"white", marginBottom:8 }}>¡Cuenta creada!</div>
        <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:16, lineHeight:1.6 }}>Revisa tu email <strong style={{ color:"#4a8fff" }}>{email}</strong> y confirma tu cuenta.</div>
        <button onClick={onLogin} style={{ ...btnP, width:"100%" }}>→ Iniciar sesión</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px" }}>
      <style>{GS}</style>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, marginBottom:24 }}>
        <div style={{ width:52, height:52, background:"#002D72", borderRadius:13, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🔗</div>
        <div style={{ fontWeight:700, fontSize:22, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355", fontSize:14 }}>RD</span></div>
      </div>
      <div style={{ background:"#161616", borderRadius:20, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 20px", width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"white", textAlign:"center", marginBottom:4 }}>Crear cuenta</div>
        <div style={{ fontSize:12, color:"#a0a2aa", textAlign:"center", marginBottom:20 }}>Empieza a comprar en USA desde RD</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355", marginBottom:14 }}>{error}</div>}
        <form onSubmit={handleRegister}>
          {[
            { label:"Nombre completo", ph:"Juan Rodríguez", val:fullName, set:setFullName, type:"text" },
            { label:"Teléfono",        ph:"809-555-1234",   val:phone,    set:setPhone,    type:"tel" },
            { label:"Email",           ph:"tu@email.com",   val:email,    set:setEmail,    type:"email" },
            { label:"Contraseña",      ph:"Mínimo 8 chars", val:password, set:setPassword, type:"password" },
          ].map((f,i) => (
            <div key={i} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inp} required={f.type !== "tel"} />
            </div>
          ))}
          <button type="submit" style={{ ...btnP, width:"100%", opacity:loading?.7:1 }} disabled={loading}>
            {loading ? "Creando..." : "🚀 Crear mi cuenta gratis"}
          </button>
        </form>
        <div style={{ textAlign:"center", fontSize:13, color:"#a0a2aa", marginTop:16 }}>
          ¿Ya tienes cuenta?{" "}<span onClick={onLogin} style={{ color:"#4a8fff", cursor:"pointer", fontWeight:600 }}>Inicia sesión</span>
        </div>
      </div>
    </div>
  );
}

// ── HOME — FIEL AL MOCKUP ─────────────────────────────────────
const STORE_COLORS = {
  macys:"#6b0000", zara:"#111", nordstrom:"#1a1a1a", hm:"#e50010",
  "forever21":"#f8a0b0", "ralph-lauren":"#00205b", "tommy-hilfiger":"#8b0000",
  levis:"#c8102e", gap:"#1a3a6b", "american-eagle":"#1a3a5c", "old-navy":"#003580",
  nike:"#111", adidas:"#8a9800", "new-balance":"#4a1090", hoka:"#050f20",
  "on-cloud":"#d83000", reebok:"#160828", vans:"#e04090", "foot-locker":"#cc0000",
  sephora:"#111", "bath-body-works":"#2d5016", "ulta-beauty":"#cc0066",
  "best-buy":"#003087", apple:"#1d1d1f", amazon:"#131f30",
  ikea:"#0051ba", target:"#cc0000", wayfair:"#7b2d8b",
  walmart:"#0071ce", kohls:"#0a0a20", "tiktok-shop":"#111", etsy:"#eb691f",
};

const CATS = [
  { id:"moda",     label:"Moda & Ropa",          icon:"👗", color:"rgba(255,51,85,.10)",    border:"rgba(255,51,85,.18)" },
  { id:"calzado",  label:"Calzado & Sneakers",    icon:"👟", color:"rgba(74,143,255,.10)",   border:"rgba(74,143,255,.18)" },
  { id:"belleza",  label:"Belleza & Cuidado",     icon:"💄", color:"rgba(204,0,102,.10)",    border:"rgba(204,0,102,.18)" },
  { id:"tech",     label:"Tecnología",            icon:"💻", color:"rgba(74,143,255,.10)",   border:"rgba(74,143,255,.18)" },
  { id:"hogar",    label:"Hogar & Decoración",    icon:"🏠", color:"rgba(100,200,100,.10)",  border:"rgba(100,200,100,.18)" },
  { id:"deportes", label:"Deportes & Outdoor",    icon:"🏋️", color:"rgba(200,16,46,.10)",    border:"rgba(200,16,46,.18)" },
  { id:"grandes",  label:"Grandes Superficies",   icon:"🛒", color:"rgba(240,180,41,.10)",   border:"rgba(240,180,41,.18)" },
  { id:"tiktok",   label:"TikTok Shop",           icon:"🎵", color:"rgba(255,0,80,.10)",     border:"rgba(255,0,80,.22)", isNew:true },
  { id:"etsy",     label:"Etsy",                  icon:"🛍️", color:"rgba(235,105,31,.10)",   border:"rgba(235,105,31,.22)", isNew:true },
];

const CAT_SUBTITLES = {
  moda:     "12 tiendas · Macy's, Zara, Nordstrom...",
  calzado:  "8 tiendas · Nike, Adidas, Foot Locker...",
  belleza:  "6 tiendas · Sephora, Bath & Body, Ulta...",
  tech:     "5 tiendas · Best Buy, Apple, Amazon...",
  hogar:    "5 tiendas · IKEA, Target, Wayfair...",
  deportes: "5 tiendas · Dick's, REI, Patagonia...",
  grandes:  "5 tiendas · Walmart, Target, Amazon...",
  tiktok:   "Lo que ves en TikTok, nosotros lo traemos",
  etsy:     "Productos únicos y artesanales de USA",
};

function StoreIcon({ store }) {
  const bg = STORE_COLORS[store.slug] || store.color || "#1e1e1e";
  const label = store.name.slice(0, 4).toUpperCase();
  return (
    <div style={{ width:60, height:60, borderRadius:14, background:bg, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"white", letterSpacing:.5, textAlign:"center", lineHeight:1.3, padding:4, flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,.35)", position:"relative", overflow:"hidden" }}>
      {label}
    </div>
  );
}

function Home({ onNav }) {
  const { profile } = useAuth();
  const rate = useRate();
  const [stores, setStores]   = useState([]);
  const [openCat, setOpenCat] = useState("moda");
  const [chip, setChip]       = useState("todas");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    sb.from("stores").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setStores(data || []));
  }, []);

  const storesByCat = (catId) => stores.filter(s => s.category === catId);

  const toggleCat = (id) => setOpenCat(prev => prev === id ? null : id);

  const CHIPS = [
    { id:"todas",    label:"Todas" },
    { id:"moda",     label:"👗 Moda" },
    { id:"calzado",  label:"👟 Calzado" },
    { id:"belleza",  label:"💄 Belleza" },
    { id:"tiktok",   label:"🎵 TikTok" },
  ];

  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>

      {/* TOPBAR */}
      <div style={{ background:"rgba(13,13,13,0.96)", backdropFilter:"blur(20px)", padding:"48px 18px 14px", position:"sticky", top:0, zIndex:50, borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontWeight:700, fontSize:18, color:"white" }}>Tiendas <span style={{ color:"#4a8fff" }}>USA</span></div>
        <div style={{ display:"flex", gap:7 }}>
          <div style={{ width:33, height:33, background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, position:"relative" }}>🔔
            <div style={{ position:"absolute", top:-3, right:-3, width:8, height:8, background:"#ff3355", borderRadius:"50%", border:"2px solid #0d0d0d", animation:"pulse 2s infinite" }}/>
          </div>
        </div>
      </div>

      <div style={{ padding:"14px 14px 0" }}>

        {/* ── PROFILE CARD ── */}
        <div style={{ background:"#161616", borderRadius:18, border:"1px solid rgba(255,255,255,0.06)", overflow:"hidden", marginBottom:12, boxShadow:"0 4px 24px rgba(0,0,0,0.45)" }}>
          <div style={{ height:68, background:"linear-gradient(135deg,#002D72 0%,#1a3d8a 50%,#BF0A30 100%)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"16px 16px" }}/>
            <div style={{ position:"absolute", top:10, right:14, fontSize:15, opacity:.35 }}>🇩🇴⛓🇺🇸</div>
          </div>
          <div style={{ padding:"0 14px 14px" }}>
            <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-26, marginBottom:10 }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4a8fff,#002D72)", border:"2.5px solid #161616", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, boxShadow:"0 4px 14px rgba(0,0,0,0.5)" }}>😊</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(240,180,41,0.12)", border:"1px solid rgba(240,180,41,0.22)", borderRadius:50, padding:"5px 11px" }}>
                <span style={{ fontSize:12 }}>⭐</span>
                <span style={{ fontSize:9, fontWeight:700, color:"#f0b429", fontFamily:"sans-serif" }}>COMPRADOR GOLD</span>
              </div>
            </div>
            <div style={{ fontWeight:700, fontSize:17, color:"white", marginBottom:1 }}>{profile?.full_name || "Mi cuenta"}</div>
            <div style={{ fontSize:10, color:"#555866", marginBottom:10 }}>Miembro desde {profile ? new Date(profile.created_at).getFullYear() : "2024"}</div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:10 }}>
              {[
                { n:profile?.trust_score||50,  l:"Trust Score", c:"#4a8fff" },
                { n:profile?.total_orders||0,   l:"Pedidos",    c:"#f0b429" },
                { n:profile?.disputes||0,        l:"Disputas",   c:"#4caf82" },
                { n:`RD$${((profile?.purchase_limit||8000)/1000).toFixed(0)}k`, l:"Límite", c:"#ff3355" },
              ].map((s,i) => (
                <div key={i} style={{ background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:11, padding:"8px 4px", textAlign:"center", borderBottom:`2px solid ${s.c}` }}>
                  <div style={{ fontWeight:700, fontSize:14, color:s.c }}>{s.n}</div>
                  <div style={{ fontSize:7, color:"#555866", textTransform:"uppercase", letterSpacing:".4px" }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Trust bar */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <div style={{ fontSize:10, color:"#a0a2aa", whiteSpace:"nowrap" }}>Confianza</div>
              <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${profile?.trust_score||50}%`, background:"linear-gradient(90deg,#4a8fff,#7ab0ff)", borderRadius:3, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:"-100%", width:"60%", height:"100%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)", animation:"shimmer 2s infinite" }}/>
                </div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:"#4a8fff", whiteSpace:"nowrap" }}>{profile?.trust_score||50}/100</div>
            </div>

            {/* Buttons */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={() => onNav("neworder")} style={{ ...btnP, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>➕ Nuevo pedido</button>
              <button onClick={() => onNav("orders")}   style={{ ...btnS, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>📋 Ver historial</button>
            </div>
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div style={{ background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, display:"flex", alignItems:"center", gap:8, padding:"11px 13px", marginBottom:10 }}>
          <span style={{ fontSize:14, opacity:.35 }}>🔍</span>
          <input type="text" placeholder="Buscar tienda... Nike, Zara, Apple..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:"none", border:"none", outline:"none", fontFamily:"inherit", fontSize:13, color:"#a0a2aa", width:"100%" }} />
        </div>

        {/* ── FILTER CHIPS ── */}
        <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:12 }}>
          {CHIPS.map(c => (
            <button key={c.id} onClick={() => setChip(c.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: chip === c.id ? "#4a8fff" : "#161616", color: chip === c.id ? "white" : "#555866", outline: chip === c.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* ── ACCORDION ── */}
        <div style={{ borderRadius:18, overflow:"hidden", border:"1px solid rgba(255,255,255,0.07)", background:"#161616" }}>
          {CATS.map((cat, idx) => {
            const catStores = storesByCat(cat.id);
            const isOpen = openCat === cat.id;
            const isLast = idx === CATS.length - 1;
            const isTk = cat.id === "tiktok";
            const isEtsy = cat.id === "etsy";

            return (
              <div key={cat.id} style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}>

                {/* Toggle row */}
                <div onClick={() => toggleCat(cat.id)} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"13px 14px",
                  cursor:"pointer", background: isOpen && (isTk||isEtsy) ? `linear-gradient(to right,${cat.color.replace("0.10","0.05")},transparent 70%)` : "#161616",
                  userSelect:"none", position:"relative", overflow:"hidden"
                }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:cat.color, border:`1px solid ${cat.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{cat.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontWeight:700, fontSize:13, color:"white", marginBottom:1 }}>
                      {cat.label}
                      {cat.isNew && <span style={{ background: isTk ? "#ff0050" : "#eb691f", color:"white", fontSize:7, fontWeight:700, padding:"2px 5px", borderRadius:4 }}>NUEVO</span>}
                    </div>
                    <div style={{ fontSize:10, color:"#555866" }}>{CAT_SUBTITLES[cat.id]}</div>
                  </div>
                  <div style={{ fontSize:16, color:"#555866", transition:"transform .3s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ background:"#1a1a1a", borderTop:"1px solid rgba(255,255,255,0.04)" }}>

                    {/* TikTok Shop special content */}
                    {isTk && (
                      <div style={{ padding:"12px 14px 14px" }}>
                        <div style={{ background:"linear-gradient(135deg,#0d0005,#1a0020)", borderRadius:14, padding:"14px 14px", marginBottom:10, border:"1px solid rgba(255,0,80,0.2)", position:"relative", overflow:"hidden" }}>
                          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,0,80,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,80,0.03) 1px,transparent 1px)", backgroundSize:"16px 16px" }}/>
                          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:36, animation:"float 3s ease-in-out infinite", filter:"drop-shadow(0 6px 12px rgba(255,0,80,0.4))" }}>🎵</div>
                          <div style={{ position:"relative", zIndex:2, maxWidth:"65%" }}>
                            <div style={{ fontSize:8, color:"rgba(0,242,234,0.65)", textTransform:"uppercase", letterSpacing:1.8, marginBottom:4 }}>Nuevo servicio</div>
                            <div style={{ fontWeight:700, fontSize:16, color:"white", lineHeight:1.15, marginBottom:4 }}>TikTok <span style={{ color:"#ff0050" }}>Shop</span> ahora en <span style={{ color:"#00f2ea" }}>RD</span> 🇩🇴</div>
                            <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.4)", marginBottom:10 }}>Ve el producto, pega el link — nosotros lo compramos.</div>
                            <button onClick={() => onNav("neworder")} style={{ background:"#ff0050", color:"white", border:"none", padding:"6px 12px", borderRadius:8, fontWeight:700, fontSize:10, cursor:"pointer" }}>🛍️ Pegar mi link →</button>
                          </div>
                        </div>
                        {/* Steps */}
                        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, background:"#161616", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", overflow:"hidden", marginBottom:10 }}>
                          {[["📱","Paso 1","Ve en TikTok"],["🔗","Paso 2","Copia el link"],["💳","Paso 3","Paga en RD$"],["📦","Paso 4","Recíbelo"]].map(([ico,n,txt],i) => (
                            <div key={i} style={{ padding:"10px 5px", display:"flex", flexDirection:"column", alignItems:"center", gap:4, borderRight: i<3 ? "1px solid rgba(255,255,255,0.04)" : "none", textAlign:"center" }}>
                              <span style={{ fontSize:16 }}>{ico}</span>
                              <span style={{ fontSize:7, fontWeight:700, color:"#ff0050", textTransform:"uppercase" }}>{n}</span>
                              <span style={{ fontSize:8.5, color:"#a0a2aa", lineHeight:1.3 }}>{txt}</span>
                            </div>
                          ))}
                        </div>
                        {/* Paste link */}
                        <div style={{ display:"flex", gap:8, alignItems:"center", background:"#161616", border:"1px solid rgba(255,0,80,0.2)", borderRadius:11, padding:"10px 12px" }}>
                          <span style={{ fontSize:13, opacity:.4 }}>🌐</span>
                          <input type="url" placeholder="https://www.tiktok.com/shop/product/..." style={{ background:"none", border:"none", outline:"none", fontFamily:"inherit", fontSize:12, color:"#a0a2aa", flex:1 }} />
                          <div style={{ background:"rgba(255,0,80,0.12)", border:"1px solid rgba(255,0,80,0.25)", borderRadius:7, padding:"5px 10px", fontSize:10, color:"#ff0050", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>Buscar →</div>
                        </div>
                      </div>
                    )}

                    {/* Etsy special content */}
                    {isEtsy && (
                      <div style={{ padding:"12px 14px 14px" }}>
                        <div style={{ background:"linear-gradient(135deg,#1a0800,#2a1000)", borderRadius:14, padding:"14px 14px", marginBottom:10, border:"1px solid rgba(235,105,31,0.2)", position:"relative", overflow:"hidden" }}>
                          <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:36, animation:"float 3.2s ease-in-out infinite", filter:"drop-shadow(0 6px 12px rgba(235,105,31,0.4))" }}>🧶</div>
                          <div style={{ position:"relative", zIndex:2, maxWidth:"65%" }}>
                            <div style={{ fontSize:8, color:"rgba(255,180,80,0.65)", textTransform:"uppercase", letterSpacing:1.8, marginBottom:4 }}>Artesanal desde USA</div>
                            <div style={{ fontWeight:700, fontSize:16, color:"white", lineHeight:1.15, marginBottom:4 }}><span style={{ color:"#eb691f" }}>Etsy</span> ahora llega a <span style={{ color:"#f0b429" }}>RD</span> 🇩🇴</div>
                            <div style={{ fontSize:9.5, color:"rgba(255,255,255,0.4)", marginBottom:10 }}>Único, hecho a mano y personalizado.</div>
                            <button onClick={() => onNav("neworder")} style={{ background:"#eb691f", color:"white", border:"none", padding:"6px 12px", borderRadius:8, fontWeight:700, fontSize:10, cursor:"pointer" }}>🛍️ Buscar en Etsy →</button>
                          </div>
                        </div>
                        {/* Etsy categories */}
                        <div style={{ display:"flex", gap:9, overflowX:"auto" }}>
                          {[["💍","Joyería","Desde $15"],["🎨","Arte","Desde $8"],["👕","Ropa custom","Desde $25"],["🕯️","Hogar","Desde $20"]].map(([ico,n,p],i) => (
                            <div key={i} style={{ flexShrink:0, background:"#161616", border:"1px solid rgba(235,105,31,0.15)", borderRadius:12, padding:"10px 12px", display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", minWidth:70, textAlign:"center" }}>
                              <span style={{ fontSize:22 }}>{ico}</span>
                              <span style={{ fontSize:9.5, fontWeight:600, color:"white" }}>{n}</span>
                              <span style={{ fontSize:8, color:"#eb691f" }}>{p}</span>
                            </div>
                          ))}
                        </div>
                        {/* Paste link */}
                        <div style={{ display:"flex", gap:8, alignItems:"center", background:"#161616", border:"1px solid rgba(235,105,31,0.2)", borderRadius:11, padding:"10px 12px", marginTop:10 }}>
                          <span style={{ fontSize:13, opacity:.4 }}>🌐</span>
                          <input type="url" placeholder="https://www.etsy.com/listing/..." style={{ background:"none", border:"none", outline:"none", fontFamily:"inherit", fontSize:12, color:"#a0a2aa", flex:1 }} />
                          <div style={{ background:"rgba(235,105,31,0.12)", border:"1px solid rgba(235,105,31,0.25)", borderRadius:7, padding:"5px 10px", fontSize:10, color:"#eb691f", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>Buscar →</div>
                        </div>
                      </div>
                    )}

                    {/* Regular store tiles */}
                    {!isTk && !isEtsy && catStores.length > 0 && (
                      <div style={{ display:"flex", gap:9, padding:"12px 14px 14px", overflowX:"auto" }}>
                        {catStores.map(store => (
                          <div key={store.id} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:5, cursor:"pointer", width:68 }}>
                            <StoreIcon store={store} />
                            <div style={{ fontSize:8.5, color:"#a0a2aa", textAlign:"center", fontWeight:500, lineHeight:1.2, width:"100%" }}>{store.name}</div>
                            <div style={{ fontSize:7.5, color:"#4caf82", textAlign:"center", fontWeight:600 }}>{store.cashback_pct}% CB</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Empty state */}
                    {!isTk && !isEtsy && catStores.length === 0 && (
                      <div style={{ padding:"16px 14px", fontSize:11, color:"#555866", textAlign:"center" }}>Cargando tiendas...</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ height:10 }} />
      </div>
    </div>
  );
}

// ── STORES ────────────────────────────────────────────────────
function Stores({ onNav }) {
  const [stores, setStores] = useState([]);
  const [cat, setCat]       = useState("all");
  const CATS2 = [
    { id:"all", l:"Todas" },{ id:"moda", l:"👗 Moda" },{ id:"calzado", l:"👟 Calzado" },
    { id:"belleza", l:"💄 Belleza" },{ id:"tech", l:"💻 Tech" },{ id:"hogar", l:"🏠 Hogar" },
    { id:"deportes", l:"🏋️ Deportes" },{ id:"grandes", l:"🛒 Grandes" },
    { id:"tiktok", l:"🎵 TikTok" },{ id:"etsy", l:"🛍️ Etsy" },
  ];
  useEffect(() => {
    sb.from("stores").select("*").eq("is_active", true).order("sort_order")
      .then(({ data }) => setStores(data || []));
  }, []);
  const list = cat === "all" ? stores : stores.filter(s => s.category === cat);
  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <TopBar title="Tiendas" accent="USA" />
      <div style={{ display:"flex", gap:7, padding:"12px 14px", overflowX:"auto" }}>
        {CATS2.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:50, fontWeight:700, fontSize:10, cursor:"pointer", border:"none", background: cat === c.id ? "#4a8fff" : "#161616", color: cat === c.id ? "white" : "#555866", outline: cat === c.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>{c.l}</button>
        ))}
      </div>
      <div style={{ padding:"0 14px", display:"flex", flexDirection:"column", gap:8 }}>
        {list.map(store => (
          <div key={store.id} style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:"12px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{ width:44, height:44, borderRadius:11, background:STORE_COLORS[store.slug]||store.color||"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>
              {store.name.slice(0,3).toUpperCase()}
            </div>
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
  const { user } = useAuth();
  const rate     = useRate();
  const [url, setUrl]       = useState("");
  const [name, setName]     = useState("");
  const [price, setPrice]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState("");
  const usd   = parseFloat(price) || 0;
  const total = (usd + 27) * 1.18;

  async function submit() {
    if (!url || !price) return;
    setLoading(true); setError("");
    const { error } = await sb.from("orders").insert({
      user_id: user.id, product_url: url, product_name: name || "Producto",
      price_usd: usd, exchange_rate: rate, status: "pending"
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setDone(true); setLoading(false);
  }

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#0d0d0d", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, gap:16 }}>
      <style>{GS}</style>
      <div style={{ fontSize:56 }}>🎉</div>
      <div style={{ fontWeight:700, fontSize:22, color:"white", textAlign:"center" }}>¡Pedido creado!</div>
      <div style={{ fontSize:13, color:"#a0a2aa", textAlign:"center", lineHeight:1.6 }}>Tu pedido fue recibido. Te contactaremos por WhatsApp para confirmar el pago.</div>
      <button onClick={() => { setDone(false); setUrl(""); setName(""); setPrice(""); onNav("orders"); }} style={{ ...btnP, padding:"13px 32px" }}>Ver mis pedidos →</button>
    </div>
  );

  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <TopBar title="Nuevo" accent="Pedido" />
      <div style={{ padding:"16px 16px", display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ fontSize:11, color:"#a0a2aa", lineHeight:1.6 }}>Copia el link del producto desde cualquier tienda USA y nosotros lo compramos por ti.</div>
        {error && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355" }}>{error}</div>}
        {[
          { label:"🔗 Link del producto",   ph:"https://www.nike.com/...", val:url,   set:setUrl,   type:"url" },
          { label:"📦 Nombre del producto", ph:"Nike Air Force 1...",     val:name,  set:setName,  type:"text" },
          { label:"💵 Precio en USD",       ph:"90.00",                    val:price, set:setPrice, type:"number" },
        ].map((f,i) => (
          <div key={i}>
            <label style={{ fontSize:11, color:"#a0a2aa", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:7 }}>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inp} />
            {f.type === "number" && price && (
              <div style={{ fontSize:11, color:"#4a8fff", marginTop:5 }}>≈ RD${(usd * rate).toLocaleString("es-DO",{minimumFractionDigits:2})}</div>
            )}
          </div>
        ))}
        {price && (
          <div style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:14 }}>
            <div style={{ fontWeight:700, fontSize:12, color:"white", marginBottom:10 }}>Resumen del pedido</div>
            {[
              { l:"Producto", v:`$${usd.toFixed(2)}` },
              { l:"Servicio", v:"$15.00" },
              { l:"Envío Miami→RD", v:"$12.00" },
              { l:"ITBIS (18%)", v:`$${((usd+27)*0.18).toFixed(2)}` },
            ].map((r,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:12, color:"#a0a2aa" }}>
                <span>{r.l}</span><span>{r.v}</span>
              </div>
            ))}
            <div style={{ height:1, background:"rgba(255,255,255,0.04)", margin:"10px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontWeight:700, fontSize:14, color:"white" }}>Total</span>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, fontSize:16, color:"white" }}>${total.toFixed(2)}</div>
                <div style={{ fontSize:10, color:"#4a8fff" }}>≈ RD${(total*rate).toLocaleString("es-DO",{minimumFractionDigits:2})}</div>
              </div>
            </div>
          </div>
        )}
        <button onClick={submit} disabled={!url || !price || loading} style={{ ...btnP, opacity:(!url||!price||loading)?.5:1, cursor:(!url||!price)?"default":"pointer" }}>
          {loading ? "Enviando..." : "✅ Confirmar pedido →"}
        </button>
      </div>
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────
function Orders({ onNav }) {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");
  const STATUS = {
    pending:   { l:"⏳ Pendiente",  c:"#f0b429" }, confirmed: { l:"✅ Confirmado", c:"#4a8fff" },
    purchased: { l:"🛍️ Comprado",  c:"#4a8fff" }, in_miami:  { l:"📦 En Miami",   c:"#f97316" },
    in_flight: { l:"✈️ En vuelo",  c:"#f97316" }, customs:   { l:"🛃 En aduana",  c:"#a855f7" },
    delivered: { l:"✅ Entregado", c:"#4caf82" }, cancelled: { l:"❌ Cancelado",  c:"#ff3355" },
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
      <TopBar title="Mis" accent="Pedidos" />
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
                <div style={{ width:34, height:34, borderRadius:9, background:STORE_COLORS[order.stores?.slug]||order.stores?.color||"#1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"white", flexShrink:0 }}>
                  {(order.stores?.name||"?").slice(0,3).toUpperCase()}
                </div>
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
    { icon:"📍", label:"Direcciones de envío",  sub:"2 guardadas",             bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"💳", label:"Métodos de pago",       sub:"Transferencia · Tarjeta", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
    { icon:"📦", label:"Historial de pedidos",  sub:`${profile?.total_orders||0} pedidos`, bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)", nav:"orders" },
    { icon:"💰", label:"Mi cashback",           sub:`RD$${Number(profile?.cashback_balance||0).toLocaleString()} disponibles`, bg:"rgba(76,175,130,0.12)", br:"rgba(76,175,130,0.22)" },
    { icon:"🔔", label:"Notificaciones",        sub:"Pedidos, ofertas, alertas", bg:"rgba(74,143,255,0.10)", br:"rgba(74,143,255,0.20)" },
    { icon:"🥇", label:"Mi membresía Gold",     sub:"Ver beneficios · Subir a Elite", bg:"rgba(240,180,41,0.12)", br:"rgba(240,180,41,0.22)" },
  ];
  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", paddingBottom:100 }}>
      <style>{GS}</style>
      <TopBar title="Mi" accent="Perfil" right={<div style={{ width:33, height:33, background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>⚙️</div>} />
      <div style={{ background:"#161616", overflow:"hidden" }}>
        <div style={{ height:72, background:"linear-gradient(135deg,#002D72,#1a3d8a,#BF0A30)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"16px 16px" }}/>
        </div>
        <div style={{ padding:"0 16px 16px" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginTop:-26, marginBottom:10 }}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#4a8fff,#002D72)", border:"2.5px solid #161616", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>😊</div>
            <div style={{ background:"rgba(240,180,41,0.12)", border:"1px solid rgba(240,180,41,0.22)", borderRadius:50, padding:"5px 11px", display:"flex", alignItems:"center", gap:5 }}>
              <span style={{ fontSize:12 }}>🥇</span>
              <span style={{ fontSize:9, fontWeight:700, color:"#f0b429" }}>COMPRADOR GOLD</span>
            </div>
          </div>
          <div style={{ fontWeight:700, fontSize:17, color:"white" }}>{profile?.full_name||"Mi cuenta"}</div>
          <div style={{ fontSize:11, color:"#555866", marginBottom:12 }}>{profile?.email||""}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:10 }}>
            {[
              { n:profile?.trust_score||50, l:"Trust",   c:"#4a8fff" },
              { n:profile?.total_orders||0,  l:"Pedidos", c:"#f0b429" },
              { n:profile?.disputes||0,       l:"Disputas",c:"#4caf82" },
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
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:500, color:"white" }}>{item.label}</div>
                <div style={{ fontSize:10, color:"#555866" }}>{item.sub}</div>
              </div>
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
          <strong style={{ color:"#a0a2aa" }}>USAlinkRD</strong> v1.0.0 · Hecho con ❤️ en República Dominicana
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
  const [screen, setScreen]         = useState("home");
  const [authScreen, setAuthScreen] = useState("login");

  if (loading) return <Splash />;
  if (!user) return authScreen === "login"
    ? <Login    onRegister={() => setAuthScreen("register")} />
    : <Register onLogin={()    => setAuthScreen("login")} />;

  const SCREENS = { home:Home, stores:Stores, neworder:NewOrder, orders:Orders, profile:Profile };
  const Screen  = SCREENS[screen] || Home;

  return (
    <div style={{ background:"#0d0d0d", minHeight:"100vh", display:"flex", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:390, position:"relative" }}>
        <Screen onNav={setScreen} />
        <BottomNav screen={screen} onNav={setScreen} />
      </div>
    </div>
  );
}
