// ============================================================
//  USAlinkRD — App.jsx principal
//  React + Supabase + Vercel
// ============================================================

import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────
const SUPABASE_URL = "https://kugdrwxthmcscrvlszws.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z2Ryd3h0aG1jc2NydmxzendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDU4NjIsImV4cCI6MjA5NDEyMTg2Mn0.G4qXcDgoLvarYC8fvr5TrkiigvKBXRxVYOXiauyADic";
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Auth Context ─────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) await loadProfile(session.user.id);
        else { setProfile(null); setLoading(false); }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Exchange Rate Context ────────────────────────────────────
const RateContext = createContext(75);
export const useRate = () => useContext(RateContext);

function RateProvider({ children }) {
  const [rate, setRate] = useState(75);
  useEffect(() => {
    supabase
      .from("exchange_rates")
      .select("rate")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => { if (data) setRate(data.rate); });
  }, []);
  return <RateContext.Provider value={rate}>{children}</RateContext.Provider>;
}

// ── Screens (lazy imports simulados — un archivo por pantalla) ──
// Nota: en producción usar React.lazy + Suspense
import Login    from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Home     from "./screens/Home";
import Stores   from "./screens/Stores";
import NewOrder from "./screens/NewOrder";
import Orders   from "./screens/Orders";
import Profile  from "./screens/Profile";

// ── Bottom Nav ───────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",     label: "Inicio",  icon: "🏠" },
  { id: "stores",   label: "Tiendas", icon: "🏪" },
  { id: "neworder", label: "Pedir",   icon: "➕" },
  { id: "orders",   label: "Pedidos", icon: "📦" },
  { id: "profile",  label: "Perfil",  icon: "◎"  },
];

function BottomNav({ screen, onNav }) {
  return (
    <nav style={{
      position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:390, zIndex:200, padding:"0 14px 22px"
    }}>
      <div style={{
        background:"rgba(18,18,18,0.97)", backdropFilter:"blur(24px)",
        border:"1px solid rgba(255,255,255,0.07)", borderRadius:20,
        display:"flex", padding:5,
        boxShadow:"0 -2px 30px rgba(0,0,0,0.6)"
      }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", gap:3, cursor:"pointer",
              padding:"8px 0", borderRadius:14, border:"none",
              background: screen === item.id
                ? "rgba(74,143,255,0.10)" : "transparent",
              transition:"background 0.2s"
            }}
          >
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{
              fontSize:8, textTransform:"uppercase", letterSpacing:"0.4px",
              fontWeight: screen === item.id ? 700 : 500,
              color: screen === item.id ? "#4a8fff" : "#555866"
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <RateProvider>
        <AppRouter />
      </RateProvider>
    </AuthProvider>
  );
}

function AppRouter() {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState("home");
  const [authScreen, setAuthScreen] = useState("login");

  // Loading splash
  if (loading) return <Splash />;

  // No autenticado → pantallas de auth
  if (!user) {
    return authScreen === "login"
      ? <Login onRegister={() => setAuthScreen("register")} />
      : <Register onLogin={() => setAuthScreen("login")} />;
  }

  // Autenticado → app principal
  const renderScreen = () => {
    switch (screen) {
      case "home":     return <Home     onNav={setScreen} />;
      case "stores":   return <Stores   onNav={setScreen} />;
      case "neworder": return <NewOrder onNav={setScreen} />;
      case "orders":   return <Orders   onNav={setScreen} />;
      case "profile":  return <Profile  onNav={setScreen} />;
      default:         return <Home     onNav={setScreen} />;
    }
  };

  return (
    <div style={{
      background:"#0d0d0d", minHeight:"100vh",
      display:"flex", justifyContent:"center"
    }}>
      <div style={{ width:"100%", maxWidth:390, position:"relative" }}>
        {renderScreen()}
        <BottomNav screen={screen} onNav={setScreen} />
      </div>
    </div>
  );
}

// ── Splash screen ────────────────────────────────────────────
function Splash() {
  return (
    <div style={{
      minHeight:"100vh", background:"#0d0d0d",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:16
    }}>
      <div style={{
        width:64, height:64, background:"#002D72",
        borderRadius:16, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:28,
        boxShadow:"0 8px 24px rgba(0,45,114,0.4)"
      }}>🔗</div>
      <div style={{
        fontFamily:"sans-serif", fontWeight:700, fontSize:22, color:"white"
      }}>
        <span style={{ color:"#4a8fff" }}>USA</span>link
        <span style={{ color:"#ff3355", fontSize:16 }}>RD</span>
      </div>
      <div style={{
        width:32, height:32, border:"2px solid rgba(74,143,255,0.2)",
        borderTop:"2px solid #4a8fff", borderRadius:"50%",
        animation:"spin 0.8s linear infinite"
      }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
