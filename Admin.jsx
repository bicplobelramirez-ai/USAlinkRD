import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL  = "https://kugdrwxthmcscrvlszws.supabase.co";
const SUPA_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Z2Ryd3h0aG1jc2NydmxzendzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NDU4NjIsImV4cCI6MjA5NDEyMTg2Mn0.G4qXcDgoLvarYC8fvr5TrkiigvKBXRxVYOXiauyADic";
const sb = createClient(SUPA_URL, SUPA_ANON);

const GS = `
  *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
  body{background:#0a0a0a;font-family:'DM Sans',sans-serif;color:#f0f0f0;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:#111;}
  ::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
  button{font-family:'DM Sans',sans-serif;cursor:pointer;}
  input,select,textarea{font-family:'DM Sans',sans-serif;}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
`;

const STATUS_CONFIG = {
  pending:   { label:"Pendiente",   color:"#f0b429", bg:"rgba(240,180,41,0.12)",  next:"confirmed" },
  confirmed: { label:"Confirmado",  color:"#4a8fff", bg:"rgba(74,143,255,0.12)", next:"purchased" },
  purchased: { label:"Comprado",    color:"#4a8fff", bg:"rgba(74,143,255,0.12)", next:"in_miami" },
  in_miami:  { label:"En Miami",    color:"#f97316", bg:"rgba(249,115,22,0.12)", next:"in_flight" },
  in_flight: { label:"En vuelo",    color:"#f97316", bg:"rgba(249,115,22,0.12)", next:"customs" },
  customs:   { label:"En aduana",   color:"#a855f7", bg:"rgba(168,85,247,0.12)", next:"delivered" },
  delivered: { label:"Entregado",   color:"#4caf82", bg:"rgba(76,175,130,0.12)", next:null },
  cancelled: { label:"Cancelado",   color:"#ff3355", bg:"rgba(255,51,85,0.12)",  next:null },
};

const STATUS_ICONS = {
  pending:"⏳", confirmed:"✅", purchased:"🛍️",
  in_miami:"📦", in_flight:"✈️", customs:"🛃",
  delivered:"🎉", cancelled:"❌"
};

export default function Admin() {
  const [user, setUser]         = useState(null);
  const [isAdmin, setIsAdmin]   = useState(false);
 const [loading, setLoading] = useState(false);
  const [tab, setTab]           = useState("orders");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) checkAdmin(session.user);
      else setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) await checkAdmin(session.user);
      else { setUser(null); setIsAdmin(false); setLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAdmin(u) {
    const { data } = await sb.from("admins").select("role").eq("id", u.id).single();
    setUser(u);
    setIsAdmin(!!data);
    setLoading(false);
  }

  async function handleLogin(e) {
    e.preventDefault(); setLoginError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setLoginError(error.message);
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <style>{GS}</style>
      <div style={{ width:40, height:40, border:"2px solid rgba(74,143,255,0.2)", borderTop:"2px solid #4a8fff", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <div style={{ color:"#555", fontSize:13 }}>Cargando panel...</div>
    </div>
  );

  if (!user) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ background:"#161616", borderRadius:16, border:"1px solid rgba(255,255,255,0.07)", padding:"28px 24px", width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:700, fontSize:20, color:"white", marginBottom:4, textAlign:"center" }}>🔐 Panel Admin</div>
        <div style={{ fontSize:12, color:"#555", textAlign:"center", marginBottom:24 }}>USAlinkRD — Acceso restringido</div>
        {loginError && <div style={{ background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", borderRadius:10, padding:"10px 12px", fontSize:12, color:"#ff3355", marginBottom:14 }}>{loginError}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:11, color:"#666", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@usalinkrd.com" style={{ width:"100%", background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px", color:"white", fontSize:13, outline:"none", boxSizing:"border-box" }} required />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:11, color:"#666", textTransform:"uppercase", letterSpacing:".8px", display:"block", marginBottom:6 }}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width:"100%", background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"12px 14px", color:"white", fontSize:13, outline:"none", boxSizing:"border-box" }} required />
          </div>
          <button type="submit" style={{ width:"100%", padding:13, borderRadius:11, background:"#4a8fff", color:"white", fontWeight:700, fontSize:14, border:"none" }}>
            Entrar al panel →
          </button>
        </form>
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <style>{GS}</style>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚫</div>
        <div style={{ fontWeight:700, fontSize:18, color:"white", marginBottom:8 }}>Acceso denegado</div>
        <div style={{ fontSize:13, color:"#666", marginBottom:20 }}>Tu cuenta no tiene permisos de administrador.</div>
        <button onClick={() => sb.auth.signOut()} style={{ padding:"10px 24px", borderRadius:10, background:"#1e1e1e", border:"1px solid rgba(255,255,255,0.07)", color:"#a0a2aa", fontWeight:600, fontSize:13 }}>Cerrar sesión</button>
      </div>
    </div>
  );

  const TABS = [
    { id:"orders",    label:"📦 Pedidos" },
    { id:"users",     label:"👥 Usuarios" },
    { id:"dashboard", label:"📊 Dashboard" },
  ];

  return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh" }}>
      <style>{GS}</style>

      {/* Header */}
      <div style={{ background:"#111", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"#002D72", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🔗</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"white" }}><span style={{ color:"#4a8fff" }}>USA</span>link<span style={{ color:"#ff3355" }}>RD</span> <span style={{ color:"#555", fontSize:12 }}>Admin</span></div>
          </div>
        </div>
        <button onClick={() => sb.auth.signOut()} style={{ padding:"6px 14px", borderRadius:8, background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", color:"#ff3355", fontWeight:600, fontSize:12 }}>
          Salir
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, borderBottom:"1px solid rgba(255,255,255,0.06)", background:"#111", padding:"0 20px" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:"12px 16px", background:"none", border:"none", color: tab === t.id ? "#4a8fff" : "#555", fontWeight: tab === t.id ? 700 : 500, fontSize:13, borderBottom: tab === t.id ? "2px solid #4a8fff" : "2px solid transparent", marginBottom:-1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding:"20px" }}>
        {tab === "orders"    && <OrdersTab />}
        {tab === "users"     && <UsersTab />}
        {tab === "dashboard" && <DashboardTab />}
      </div>
    </div>
  );
}

// ── ORDERS TAB ────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [note, setNote]         = useState("");

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await sb.from("orders")
      .select("*, users(full_name,email,phone), stores(name,color,slug)")
      .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(orderId, newStatus) {
    setUpdating(true);
    const update = { status: newStatus };
    if (newStatus === "confirmed")  update.confirmed_at  = new Date().toISOString();
    if (newStatus === "purchased")  update.purchased_at  = new Date().toISOString();
    if (newStatus === "in_miami")   update.miami_at       = new Date().toISOString();
    if (newStatus === "in_flight")  update.flight_at      = new Date().toISOString();
    if (newStatus === "customs")    update.customs_at     = new Date().toISOString();
    if (newStatus === "delivered")  update.delivered_at   = new Date().toISOString();
    if (newStatus === "cancelled")  update.cancelled_at   = new Date().toISOString();
    await sb.from("orders").update(update).eq("id", orderId);
    await loadOrders();
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  }

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const STATUS_FILTERS = [
    { id:"all", label:"Todos" },
    { id:"pending", label:"⏳ Pendientes" },
    { id:"confirmed", label:"✅ Confirmados" },
    { id:"purchased", label:"🛍️ Comprados" },
    { id:"in_miami", label:"📦 Miami" },
    { id:"in_flight", label:"✈️ En vuelo" },
    { id:"customs", label:"🛃 Aduana" },
    { id:"delivered", label:"🎉 Entregados" },
    { id:"cancelled", label:"❌ Cancelados" },
  ];

  if (selected) {
    const st = STATUS_CONFIG[selected.status];
    const nextStatus = st?.next;
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:"#4a8fff", fontWeight:600, fontSize:13, marginBottom:16, padding:0 }}>
          ← Volver a pedidos
        </button>

        {/* Order header */}
        <div style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:16, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ fontWeight:700, fontSize:16, color:"white" }}>#{selected.order_number}</div>
            <div style={{ background:st?.bg, border:`1px solid ${st?.color}40`, borderRadius:7, padding:"4px 10px", fontSize:11, fontWeight:700, color:st?.color }}>
              {STATUS_ICONS[selected.status]} {st?.label}
            </div>
          </div>

          {/* Customer */}
          <div style={{ background:"#1e1e1e", borderRadius:10, padding:"12px", marginBottom:10 }}>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Cliente</div>
            <div style={{ fontWeight:700, fontSize:14, color:"white", marginBottom:2 }}>{selected.users?.full_name || "—"}</div>
            <div style={{ fontSize:12, color:"#a0a2aa" }}>{selected.users?.email}</div>
            {selected.users?.phone && <div style={{ fontSize:12, color:"#a0a2aa" }}>{selected.users?.phone}</div>}
          </div>

          {/* Product */}
          <div style={{ background:"#1e1e1e", borderRadius:10, padding:"12px", marginBottom:10 }}>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Producto</div>
            <div style={{ fontWeight:600, fontSize:13, color:"white", marginBottom:4 }}>{selected.product_name || "Sin nombre"}</div>
            <div style={{ fontSize:11, color:"#4a8fff", wordBreak:"break-all", marginBottom:6 }}>{selected.product_url}</div>
            <div style={{ display:"flex", gap:16 }}>
              <div><span style={{ color:"#555", fontSize:11 }}>Precio: </span><span style={{ color:"white", fontWeight:600, fontSize:13 }}>${selected.price_usd}</span></div>
              {selected.total_dop && <div><span style={{ color:"#555", fontSize:11 }}>Total RD: </span><span style={{ color:"#4a8fff", fontWeight:600, fontSize:13 }}>RD${Number(selected.total_dop).toLocaleString()}</span></div>}
            </div>
          </div>

          {/* Dates */}
          <div style={{ background:"#1e1e1e", borderRadius:10, padding:"12px" }}>
            <div style={{ fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Fechas</div>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {[
                { l:"Creado", v:selected.created_at },
                { l:"Confirmado", v:selected.confirmed_at },
                { l:"Comprado", v:selected.purchased_at },
                { l:"En Miami", v:selected.miami_at },
                { l:"En vuelo", v:selected.flight_at },
                { l:"En aduana", v:selected.customs_at },
                { l:"Entregado", v:selected.delivered_at },
              ].filter(d => d.v).map((d,i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:11, color:"#555" }}>{d.l}</span>
                  <span style={{ fontSize:11, color:"#a0a2aa" }}>{new Date(d.v).toLocaleString("es-DO")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        {nextStatus && (
          <div style={{ background:"#161616", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:16, marginBottom:12 }}>
            <div style={{ fontSize:12, color:"#555", textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Avanzar estado</div>
            <button onClick={() => updateStatus(selected.id, nextStatus)} disabled={updating} style={{ width:"100%", padding:13, borderRadius:11, background:"#4a8fff", color:"white", fontWeight:700, fontSize:14, border:"none", opacity:updating?.6:1 }}>
              {updating ? "Actualizando..." : `${STATUS_ICONS[nextStatus]} Marcar como ${STATUS_CONFIG[nextStatus]?.label} →`}
            </button>
          </div>
        )}

        {/* Cancel */}
        {selected.status !== "cancelled" && selected.status !== "delivered" && (
          <button onClick={() => updateStatus(selected.id, "cancelled")} disabled={updating} style={{ width:"100%", padding:12, borderRadius:11, background:"rgba(255,51,85,0.1)", border:"1px solid rgba(255,51,85,0.2)", color:"#ff3355", fontWeight:700, fontSize:13 }}>
            ❌ Cancelar pedido
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
        {STATUS_FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:"6px 12px", borderRadius:50, fontWeight:700, fontSize:11, border:"none", background: filter === f.id ? "#4a8fff" : "#161616", color: filter === f.id ? "white" : "#555", outline: filter === f.id ? "none" : "1px solid rgba(255,255,255,0.07)" }}>
            {f.label} {filter === f.id && filtered.length > 0 ? `(${filtered.length})` : ""}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign:"center", color:"#555", padding:40 }}>Cargando pedidos...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign:"center", color:"#555", padding:40 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
          <div>Sin pedidos {filter !== "all" ? `en estado "${STATUS_CONFIG[filter]?.label}"` : ""}</div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.map(order => {
          const st = STATUS_CONFIG[order.status] || { label:order.status, color:"#555", bg:"rgba(85,85,85,0.1)" };
          return (
            <div key={order.id} onClick={() => setSelected(order)} style={{ background:"#161616", borderRadius:14, border:`1px solid rgba(255,255,255,0.07)`, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"white" }}>#{order.order_number}</div>
                  <div style={{ background:st.bg, border:`1px solid ${st.color}40`, borderRadius:5, padding:"2px 7px", fontSize:10, fontWeight:700, color:st.color }}>
                    {STATUS_ICONS[order.status]} {st.label}
                  </div>
                </div>
                <div style={{ fontSize:12, color:"#a0a2aa", marginBottom:2 }}>{order.users?.full_name || order.users?.email || "Usuario"}</div>
                <div style={{ fontSize:11, color:"#555" }}>{order.product_name || "Producto"} · ${order.price_usd}</div>
                <div style={{ fontSize:10, color:"#444", marginTop:3 }}>{new Date(order.created_at).toLocaleDateString("es-DO")}</div>
              </div>
              <div style={{ fontSize:16, color:"#333" }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── USERS TAB ─────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    sb.from("users").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const PLAN_COLORS = { guest:"#555", silver:"#b0bdd0", gold:"#f0b429", elite:"#a855f7" };

  return (
    <div>
      <div style={{ background:"#161616", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, display:"flex", alignItems:"center", gap:8, padding:"10px 13px", marginBottom:16 }}>
        <span style={{ fontSize:14, opacity:.4 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..." style={{ background:"none", border:"none", outline:"none", fontSize:13, color:"#a0a2aa", width:"100%" }} />
      </div>

      <div style={{ fontSize:12, color:"#555", marginBottom:12 }}>{filtered.length} usuarios registrados</div>

      {loading && <div style={{ textAlign:"center", color:"#555", padding:40 }}>Cargando usuarios...</div>}

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.map(user => (
          <div key={user.id} style={{ background:"#161616", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", padding:"12px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"white" }}>{user.full_name || "Sin nombre"}</div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <div style={{ background:`${PLAN_COLORS[user.plan]}20`, border:`1px solid ${PLAN_COLORS[user.plan]}40`, borderRadius:5, padding:"2px 8px", fontSize:9, fontWeight:700, color:PLAN_COLORS[user.plan], textTransform:"uppercase" }}>
                  {user.plan}
                </div>
                {user.is_verified && <div style={{ background:"rgba(76,175,130,0.12)", border:"1px solid rgba(76,175,130,0.22)", borderRadius:5, padding:"2px 7px", fontSize:9, fontWeight:700, color:"#4caf82" }}>✓ Verificado</div>}
              </div>
            </div>
            <div style={{ fontSize:11, color:"#a0a2aa", marginBottom:6 }}>{user.email}</div>
            {user.phone && <div style={{ fontSize:11, color:"#555", marginBottom:6 }}>{user.phone}</div>}
            <div style={{ display:"flex", gap:16 }}>
              <div style={{ fontSize:11 }}><span style={{ color:"#555" }}>Trust: </span><span style={{ color:"#4a8fff", fontWeight:700 }}>{user.trust_score}</span></div>
              <div style={{ fontSize:11 }}><span style={{ color:"#555" }}>Pedidos: </span><span style={{ color:"#f0b429", fontWeight:700 }}>{user.total_orders}</span></div>
              <div style={{ fontSize:11 }}><span style={{ color:"#555" }}>Cashback: </span><span style={{ color:"#4caf82", fontWeight:700 }}>RD${Number(user.cashback_balance || 0).toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── DASHBOARD TAB ─────────────────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [ordersRes, usersRes] = await Promise.all([
        sb.from("orders").select("status, price_usd, total_dop, created_at"),
        sb.from("users").select("plan, created_at"),
      ]);
      const orders = ordersRes.data || [];
      const users  = usersRes.data  || [];
      const today  = new Date().toDateString();

      setStats({
        total_orders:     orders.length,
        pending:          orders.filter(o => o.status === "pending").length,
        in_transit:       orders.filter(o => ["confirmed","purchased","in_miami","in_flight","customs"].includes(o.status)).length,
        delivered:        orders.filter(o => o.status === "delivered").length,
        cancelled:        orders.filter(o => o.status === "cancelled").length,
        revenue_usd:      orders.filter(o => o.status !== "cancelled").reduce((s,o) => s + Number(o.price_usd||0), 0),
        revenue_dop:      orders.filter(o => o.status !== "cancelled").reduce((s,o) => s + Number(o.total_dop||0), 0),
        orders_today:     orders.filter(o => new Date(o.created_at).toDateString() === today).length,
        total_users:      users.length,
        gold_users:       users.filter(u => u.plan === "gold").length,
        elite_users:      users.filter(u => u.plan === "elite").length,
        new_users_today:  users.filter(u => new Date(u.created_at).toDateString() === today).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ textAlign:"center", color:"#555", padding:40 }}>Cargando estadísticas...</div>;

  const CARDS = [
    { icon:"📦", label:"Total pedidos",    val:stats.total_orders,       color:"#4a8fff" },
    { icon:"⏳", label:"Pendientes",       val:stats.pending,            color:"#f0b429" },
    { icon:"✈️", label:"En tránsito",      val:stats.in_transit,         color:"#f97316" },
    { icon:"✅", label:"Entregados",        val:stats.delivered,          color:"#4caf82" },
    { icon:"❌", label:"Cancelados",        val:stats.cancelled,          color:"#ff3355" },
    { icon:"🛍️", label:"Pedidos hoy",      val:stats.orders_today,       color:"#a855f7" },
    { icon:"👥", label:"Usuarios",         val:stats.total_users,        color:"#4a8fff" },
    { icon:"🥇", label:"Clientes Gold",    val:stats.gold_users,         color:"#f0b429" },
    { icon:"✦",  label:"Black Elite",      val:stats.elite_users,        color:"#a855f7" },
    { icon:"🆕", label:"Nuevos hoy",       val:stats.new_users_today,    color:"#4caf82" },
  ];

  return (
    <div>
      {/* Revenue */}
      <div style={{ background:"linear-gradient(135deg,#002D72,#1a3d8a)", borderRadius:16, padding:"18px 18px", marginBottom:16, border:"1px solid rgba(74,143,255,0.2)" }}>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:1.5, marginBottom:6 }}>Ingresos totales</div>
        <div style={{ fontWeight:700, fontSize:28, color:"white", marginBottom:4 }}>${stats.revenue_usd.toLocaleString("en-US", { minimumFractionDigits:2 })} USD</div>
        <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>≈ RD${stats.revenue_dop.toLocaleString("es-DO", { minimumFractionDigits:0 })}</div>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
        {CARDS.map((card,i) => (
          <div key={i} style={{ background:"#161616", borderRadius:12, border:"1px solid rgba(255,255,255,0.07)", padding:"14px 14px", borderBottom:`2px solid ${card.color}` }}>
            <div style={{ fontSize:18, marginBottom:6 }}>{card.icon}</div>
            <div style={{ fontWeight:700, fontSize:22, color:card.color, marginBottom:2 }}>{card.val}</div>
            <div style={{ fontSize:11, color:"#555" }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:"center", fontSize:11, color:"#333", marginTop:20 }}>
        Última actualización: {new Date().toLocaleString("es-DO")}
      </div>
    </div>
  );
}
