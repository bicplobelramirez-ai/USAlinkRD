import { useState, useEffect, useRef } from "react";

const NAVY = "#081B4B";
const RED  = "#E31E24";

/* ─── GEO RATES ─── */
const GEO_RATES = {
  DO:{name:"Rep. Dominicana", flag:"🇩🇴", rate:8.50, currency:"DOP", usd:75},
  MX:{name:"México",          flag:"🇲🇽", rate:9.00, currency:"MXN", usd:17},
  CO:{name:"Colombia",        flag:"🇨🇴", rate:9.50, currency:"COP", usd:4200},
  VE:{name:"Venezuela",       flag:"🇻🇪", rate:10.00,currency:"VES", usd:36},
  PE:{name:"Perú",            flag:"🇵🇪", rate:10.50,currency:"PEN", usd:3.7},
  CL:{name:"Chile",           flag:"🇨🇱", rate:11.00,currency:"CLP", usd:950},
  AR:{name:"Argentina",       flag:"🇦🇷", rate:11.50,currency:"ARS", usd:1000},
  BR:{name:"Brasil",          flag:"🇧🇷", rate:12.00,currency:"BRL", usd:5.2},
  US:{name:"Estados Unidos",  flag:"🇺🇸", rate:0,    currency:"USD", usd:1},
};

/* ─── STORES ─── */
const STORES = [
  {id:"coachoutlet",   name:"Coach Outlet",      cat:"outlets",      bg:"linear-gradient(135deg,#1a0a00,#8b5c2a)", badge:"hot",  rating:4.7, url:"https://www.coach.com/outlet",               desc:"Bolsos y accesorios Coach hasta 70% off."},
  {id:"shopsimon",     name:"ShopSimon",          cat:"outlets",      bg:"linear-gradient(135deg,#0a1a3d,#1e3a8a)", badge:"hot",  rating:4.6, url:"https://www.shopsimon.com/",                  desc:"Premium Outlets. Lujo a precio outlet."},
  {id:"rlfactory",     name:"RL Factory",         cat:"outlets",      bg:"linear-gradient(135deg,#002a5e,#1a4a8a)", badge:"sale", rating:4.7, url:"https://www.ralphlauren.com/factory-stores", desc:"Ralph Lauren Factory. Elegancia a precio reducido."},
  {id:"nikefactory",   name:"Nike Factory",       cat:"outlets",      bg:"linear-gradient(135deg,#111,#333)",        badge:"hot",  rating:4.8, url:"https://www.nike.com/nike-factory-store",    desc:"Sneakers Nike hasta 60% off."},
  {id:"nordstromrack", name:"Nordstrom Rack",     cat:"outlets",      bg:"linear-gradient(135deg,#1a0a30,#2d1a50)", badge:"hot",  rating:4.7, url:"https://www.nordstromrack.com/",             desc:"Diseñadores hasta 70% off."},
  {id:"marshalls",     name:"Marshalls",          cat:"outlets",      bg:"linear-gradient(135deg,#b22222,#7a0000)", badge:"sale", rating:4.5, url:"https://www.marshalls.com/",                  desc:"Marcas de nombre a precios bajos."},
  {id:"tjmaxx",        name:"TJ Maxx",            cat:"outlets",      bg:"linear-gradient(135deg,#8b0000,#cc2200)", badge:"sale", rating:4.6, url:"https://www.tjmaxx.tjx.com/",                desc:"Calidad hasta 60% menos."},
  {id:"saksoff5th",    name:"Saks OFF 5TH",       cat:"outlets",      bg:"linear-gradient(135deg,#1a1a1a,#4a4a4a)", badge:"hot",  rating:4.8, url:"https://www.saksoff5th.com/",                desc:"Lujo con descuentos hasta 70%."},
  {id:"zara",          name:"Zara",               cat:"moda",         bg:"linear-gradient(135deg,#1a1a1a,#555)",     badge:"hot",  rating:4.7, url:"https://www.zara.com/us/",                  desc:"Tendencias europeas cada dos semanas."},
  {id:"hm",            name:"H&M",                cat:"moda",         bg:"linear-gradient(135deg,#c8102e,#8b0020)", badge:"sale", rating:4.5, url:"https://www.hm.com/us/",                    desc:"Moda accesible para toda la familia."},
  {id:"uniqlo",        name:"UNIQLO",             cat:"moda",         bg:"linear-gradient(135deg,#e60012,#990000)", badge:"new",  rating:4.8, url:"https://www.uniqlo.com/us/",                desc:"LifeWear japonesa. HeatTech y AIRism."},
  {id:"forever21",     name:"Forever 21",         cat:"moda",         bg:"linear-gradient(135deg,#222,#555)",        badge:"sale", rating:4.2, url:"https://www.forever21.com/",                desc:"+500 estilos nuevos cada semana."},
  {id:"ralphlauren",   name:"Ralph Lauren",       cat:"moda",         bg:"linear-gradient(135deg,#002a5e,#004c99)", badge:"hot",  rating:4.9, url:"https://www.ralphlauren.com/",              desc:"El lujo americano por excelencia."},
  {id:"tommy",         name:"Tommy Hilfiger",     cat:"moda",         bg:"linear-gradient(135deg,#c8102e,#002868)", badge:null,   rating:4.7, url:"https://usa.tommy.com/",                    desc:"Estilo preppy americano clásico."},
  {id:"americaneagle", name:"American Eagle",     cat:"moda",         bg:"linear-gradient(135deg,#1a3d7c,#2e6fca)", badge:"sale", rating:4.6, url:"https://www.ae.com/",                       desc:"Jeans premium y línea Aerie."},
  {id:"oldnavy",       name:"Old Navy",           cat:"moda",         bg:"linear-gradient(135deg,#003087,#0050c8)", badge:null,   rating:4.4, url:"https://oldnavy.gap.com/",                  desc:"Moda familiar a precios accesibles."},
  {id:"shein",         name:"SHEIN",              cat:"moda",         bg:"linear-gradient(135deg,#0a0a14,#1a0a2e)", badge:"hot",  rating:4.3, url:"https://www.shein.com/",                    desc:"Miles de estilos nuevos diarios."},
  {id:"walmart",       name:"Walmart",            cat:"marketplaces", bg:"linear-gradient(135deg,#0071ce,#004c8c)", badge:"hot",  rating:4.6, url:"https://www.walmart.com/",                  desc:"El retailer más grande del mundo."},
  {id:"target",        name:"Target",             cat:"marketplaces", bg:"linear-gradient(135deg,#cc0000,#8b0000)", badge:"hot",  rating:4.7, url:"https://www.target.com/",                   desc:"One-stop-shop americano favorito."},
  {id:"amazon",        name:"Amazon",             cat:"marketplaces", bg:"linear-gradient(135deg,#131921,#232f3e)", badge:"hot",  rating:4.8, url:"https://www.amazon.com/",                   desc:"Millones de productos en un clic."},
  {id:"etsy",          name:"Etsy",               cat:"marketplaces", bg:"linear-gradient(135deg,#f1641e,#a33e00)", badge:"new",  rating:4.8, url:"https://www.etsy.com/",                     desc:"Hecho a mano, vintage, único."},
  {id:"tiktokshop",    name:"TikTok Shop",        cat:"marketplaces", bg:"linear-gradient(135deg,#010101,#2a0012)", badge:"new",  rating:4.5, url:"https://www.tiktok.com/tiktokshop",         desc:"Los productos virales de TikTok."},
  {id:"nike",          name:"Nike",               cat:"calzado",      bg:"linear-gradient(135deg,#111,#333)",        badge:"hot",  rating:4.9, url:"https://www.nike.com/",                     desc:"Air Max, Jordan, Dunk. Just Do It."},
  {id:"newbalance",    name:"New Balance",        cat:"calzado",      bg:"linear-gradient(135deg,#1a1a1a,#4a4a4a)", badge:"hot",  rating:4.8, url:"https://www.newbalance.com/",               desc:"990v6, 530, 2002R. Estilo y rendimiento."},
  {id:"hoka",          name:"HOKA",               cat:"calzado",      bg:"linear-gradient(135deg,#0057B8,#003d82)", badge:"new",  rating:4.8, url:"https://www.hoka.com/",                     desc:"Máxima amortiguación, mínimo peso."},
  {id:"oncloud",       name:"On Running",         cat:"calzado",      bg:"linear-gradient(135deg,#d0d0d0,#888)",    badge:"new",  rating:4.9, url:"https://www.on-running.com/en-us/",         desc:"CloudTec suiza. Running en nubes."},
  {id:"reebok",        name:"Reebok",             cat:"calzado",      bg:"linear-gradient(135deg,#cc0000,#880000)", badge:null,   rating:4.5, url:"https://www.reebok.com/",                   desc:"Club C, Classic. Íconos del streetwear."},
  {id:"vans",          name:"Vans",               cat:"calzado",      bg:"linear-gradient(135deg,#e31e24,#1a1a1a)", badge:null,   rating:4.6, url:"https://www.vans.com/",                     desc:"Off the Wall desde 1966."},
  {id:"levis",         name:"Levi's",             cat:"calzado",      bg:"linear-gradient(135deg,#e31e24,#8b0000)", badge:null,   rating:4.7, url:"https://www.levi.com/US/en_US/",            desc:"El jean más icónico desde 1853."},
  {id:"footlocker",    name:"Foot Locker",        cat:"calzado",      bg:"linear-gradient(135deg,#1a1a1a,#555)",    badge:"hot",  rating:4.6, url:"https://www.footlocker.com/",               desc:"La meca del sneaker. +100 marcas."},
  {id:"sephora",       name:"Sephora",            cat:"belleza",      bg:"linear-gradient(135deg,#1a0025,#3d0058)", badge:"hot",  rating:4.9, url:"https://www.sephora.com/",                  desc:"La meca de la belleza premium."},
  {id:"ulta",          name:"Ulta Beauty",        cat:"belleza",      bg:"linear-gradient(135deg,#e91e8c,#9c0b5e)", badge:"hot",  rating:4.8, url:"https://www.ulta.com/",                     desc:"+600 marcas de belleza."},
  {id:"bathandbody",   name:"Bath & Body Works",  cat:"belleza",      bg:"linear-gradient(135deg,#c8006b,#7a003e)", badge:"sale", rating:4.8, url:"https://www.bathandbodyworks.com/",         desc:"Velas, lociones y fragancias."},
  {id:"sallybeauty",   name:"Sally Beauty",       cat:"belleza",      bg:"linear-gradient(135deg,#003366,#0055aa)", badge:null,   rating:4.5, url:"https://www.sallybeauty.com/",              desc:"Productos de belleza profesional."},
  {id:"mac",           name:"MAC Cosmetics",      cat:"belleza",      bg:"linear-gradient(135deg,#1a1a1a,#3a3a3a)", badge:null,   rating:4.7, url:"https://www.maccosmetics.com/",             desc:"Maquillaje profesional. Ruby Woo."},
  {id:"apple",         name:"Apple",              cat:"tech",         bg:"linear-gradient(135deg,#1c1c1e,#3a3a3c)", badge:"hot",  rating:4.9, url:"https://www.apple.com/",                    desc:"iPhone, Mac, iPad, Watch, AirPods."},
  {id:"bestbuy",       name:"Best Buy",           cat:"tech",         bg:"linear-gradient(135deg,#003da5,#0056e0)", badge:"hot",  rating:4.6, url:"https://www.bestbuy.com/",                  desc:"La mayor tienda de electrónica USA."},
  {id:"homedepot",     name:"Home Depot",         cat:"hogar",        bg:"linear-gradient(135deg,#cc5500,#884400)", badge:"hot",  rating:4.7, url:"https://www.homedepot.com/",                desc:"Todo para hogar y construcción."},
  {id:"ikea",          name:"IKEA",               cat:"hogar",        bg:"linear-gradient(135deg,#003c8f,#0052cc)", badge:"new",  rating:4.6, url:"https://www.ikea.com/us/en/",               desc:"Muebles modernos a precios accesibles."},
  {id:"wayfair",       name:"Wayfair",            cat:"hogar",        bg:"linear-gradient(135deg,#7b2d8b,#4a1a55)", badge:null,   rating:4.5, url:"https://www.wayfair.com/",                  desc:"+14 millones de productos para el hogar."},
  {id:"lowes",         name:"Lowe's",             cat:"hogar",        bg:"linear-gradient(135deg,#003087,#004db3)", badge:null,   rating:4.6, url:"https://www.lowes.com/",                    desc:"Mejoras para el hogar y herramientas."},
  {id:"homegoods",     name:"HomeGoods",          cat:"hogar",        bg:"linear-gradient(135deg,#8b2200,#cc3300)", badge:"sale", rating:4.5, url:"https://www.homegoods.com/",                desc:"Decoración a precios de outlet."},
];

const CATS = [
  {key:"all",icon:"🏪",label:"Todas"},
  {key:"outlets",icon:"🛍️",label:"Outlets"},
  {key:"moda",icon:"👗",label:"Moda"},
  {key:"marketplaces",icon:"🏬",label:"Markets"},
  {key:"calzado",icon:"👟",label:"Calzado"},
  {key:"belleza",icon:"💄",label:"Belleza"},
  {key:"tech",icon:"📱",label:"Tech"},
  {key:"hogar",icon:"🏠",label:"Hogar"},
];

const SLIDES = [
  {title:"Compra en USA.", em:"Recíbelo en tu país.", sub:"Accede a miles de tiendas y recibe en casa.", emoji:"✈️", bg:"linear-gradient(145deg,#050f2b,#081b4b)", cta:"Crear cuenta", page:"account"},
  {title:"Tiendas USA", em:"Destacadas.", sub:"Nike, Apple, Saks, Amazon, TikTok Shop y más.", emoji:"🛍️", bg:"linear-gradient(145deg,#0d1f4e,#0a2866)", cta:"Explorar", page:"stores"},
  {title:"Sneakers, tech", em:"y moda viral.", sub:"Los productos más pedidos desde USA.", emoji:"👟", bg:"linear-gradient(145deg,#0a1a3d,#061230)", cta:"Ver calzado", page:"stores"},
  {title:"Ahorra", em:"consolidando paquetes.", sub:"Juntamos tus compras en un solo envío.", emoji:"📦", bg:"linear-gradient(145deg,#0d2030,#071428)", cta:"Calcular", page:"calc"},
  {title:"Pega el link.", em:"Nosotros compramos.", sub:"Copia la URL de cualquier producto USA.", emoji:"🔗", bg:"linear-gradient(145deg,#1a0a3d,#0d0a2e)", cta:"Pegar link", page:"link"},
  {title:"Outlets de lujo", em:"a tu alcance.", sub:"Saks OFF 5TH, Nordstrom Rack, Coach Outlet.", emoji:"🏷️", bg:"linear-gradient(145deg,#7a2800,#f1641e)", cta:"Ver outlets", page:"stores"},
  {title:"Rastreo en", em:"tiempo real.", sub:"Sigue tu paquete desde Miami hasta tu puerta.", emoji:"📡", bg:"linear-gradient(145deg,#0a1a3d,#061230)", cta:"Rastrear", page:"track"},
];

/* ─── APHRODITE SYSTEM PROMPT ─── */
const buildSystem = (mode, geo) => {
  const country = geo ? geo.name : "Latinoamérica";
  const rate = geo ? `$${geo.rate}/lb` : "$8.50-$12/lb";
  const base = `Eres Aphrodite, la asistente personal de USALINK. Tienes una personalidad cálida, empática y profesional. Hablas como una amiga que sabe mucho de compras en USA. Usas emojis con moderación. El usuario está en ${country} y su tarifa de envío es ${rate} desde Miami. Siempre respondes en español natural y conversacional.`;
  const modes = {
    shop:    `${base} Tu misión es ayudar a encontrar los mejores productos y tiendas en USA. Haces recomendaciones específicas y personalizadas. Máximo 3 párrafos cortos.`,
    support: `${base} Resuelves dudas sobre envíos (3-7 días hábiles), consolidación de paquetes, casillero en Miami, rastreo y aduanas. Eres tranquilizadora y precisa. Máximo 3 párrafos.`,
    quote:   `${base} Eres experta en cotizaciones. Cuando te dan peso y destino calculas: peso × tarifa + $3 manejo. Tarifas: RD $8.50, MX $9.00, CO $9.50, VE $10.00, PE $10.50, CL $11.00, AR $11.50, BR $12.00. Siempre muestras el desglose completo.`,
    link:    `${base} El usuario te pega links de productos de tiendas USA. Analiza la URL para identificar la tienda y el tipo de producto. Pregunta el peso estimado y calcula el costo total (precio del producto + envío + tu ganancia como servicio). Sé entusiasta con los buenos deals. Máximo 3 párrafos.`,
    agent:   `${base} Eres una agente proactiva. Puedes cotizar, recomendar tiendas, analizar links, calcular ahorros versus precios locales en ${country}, y sugerir qué consolidar. Tomas la iniciativa y ofreces opciones concretas. Máximo 4 párrafos.`,
  };
  return modes[mode] || modes.shop;
};

/* ─── AI CALL ─── */
const callAI = (messages, system, onReply, onError) => {
  fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({model:"claude-sonnet-4-20250514", max_tokens:700, system, messages})
  })
  .then(r => r.json())
  .then(d => {
    const text = d.content && d.content[0] ? d.content[0].text : "Lo siento, intenta de nuevo. 🙏";
    onReply(text);
  })
  .catch(() => onError());
};

/* ─── COMPONENTS ─── */

function AphroditeAvatar({size=40, pulse=false}) {
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <div style={{
        width:size, height:size, borderRadius:"50%",
        background:"linear-gradient(135deg,#E31E24,#ff6b9d,#081B4B)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.45, boxShadow:`0 4px 16px rgba(227,30,36,0.4)`,
        border:"2px solid rgba(255,255,255,0.2)",
      }}>
        👩🏻‍💼
      </div>
      {pulse && <div style={{
        position:"absolute", bottom:0, right:0,
        width:size*0.28, height:size*0.28, borderRadius:"50%",
        background:"#10b981", border:"2px solid #fff",
      }}/>}
    </div>
  );
}

function GeoBar({geo, onNavigate}) {
  if (!geo) return null;
  return (
    <div style={{background:"linear-gradient(90deg,#081B4B,#0d2560)",padding:"8px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:16}}>{geo.flag}</span>
        <div>
          <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>{geo.name}</span>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginLeft:6}}>✈ ${geo.rate}/lb</span>
        </div>
      </div>
      <button onClick={() => onNavigate("link")}
        style={{background:"rgba(227,30,36,0.15)",border:"1px solid rgba(227,30,36,0.4)",borderRadius:999,padding:"5px 12px",fontSize:11,fontWeight:700,color:RED,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
        🔗 Pegar link
      </button>
    </div>
  );
}

function StoreCard({store, onClick}) {
  return (
    <div onClick={() => onClick(store)}
      style={{background:"#fff",borderRadius:20,border:"1.5px solid #dde2f0",overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(8,27,75,0.07)"}}>
      <div style={{height:100,background:store.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.2)"}}/>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#fff",letterSpacing:"0.04em",position:"relative",zIndex:2,textShadow:"0 2px 8px rgba(0,0,0,0.4)",textAlign:"center",padding:"0 8px"}}>
          {store.name}
        </span>
        {store.badge && (
          <div style={{position:"absolute",top:7,left:7,zIndex:3,fontSize:9,fontWeight:800,padding:"3px 7px",borderRadius:999,background:store.badge==="hot"?RED:store.badge==="new"?"#10b981":"#F5A623",color:"#fff",textTransform:"uppercase",letterSpacing:"0.07em"}}>
            {store.badge==="hot"?"🔥 Popular":store.badge==="new"?"✨ Nuevo":"💸 Oferta"}
          </div>
        )}
      </div>
      <div style={{padding:"10px 12px 12px"}}>
        <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:3}}>{store.name}</div>
        <div style={{fontSize:11,color:"#8b96b8",marginBottom:8,lineHeight:1.4}}>{store.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:"#F5A623",fontWeight:700}}>★ {store.rating}</span>
          <span style={{fontSize:10,fontWeight:700,color:"#10b981"}}>✈ $8.50/lb</span>
        </div>
      </div>
    </div>
  );
}

/* ─── PEGAR LINK PAGE ─── */
function LinkPage({geo}) {
  const [url, setUrl] = useState("");
  const [chat, setChat] = useState([{
    bot:true,
    text:`¡Hola! 👋 Soy Aphrodite. Pega el link de cualquier producto que quieras comprar en USA y te calculo el costo total con envío a ${geo ? geo.name : "tu país"}. 🛍️`
  }]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const analyze = () => {
    if (!url.trim() || loading) return;
    const link = url.trim();
    setUrl("");
    const newChat = [...chat, {bot:false, text:link}];
    setChat(newChat);
    setLoading(true);

    const msgs = [{role:"user", content:`Analiza este link de producto: ${link}\n\nDime: 1) De qué tienda es y qué tipo de producto parece ser. 2) Pregúntame el precio si no lo puedes ver en la URL. 3) Pídeme el peso estimado del producto. 4) Con esa info calcularé el costo total de envío a ${geo ? geo.name : "mi país"} a una tarifa de ${geo ? `$${geo.rate}` : "$8.50"}/lb.`}];

    callAI(msgs, buildSystem("link", geo),
      reply => { setChat(c => [...c, {bot:true, text:reply}]); setLoading(false); setTimeout(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100); },
      () => { setChat(c => [...c, {bot:true, text:"Sin conexión. Intenta de nuevo. 🙏"}]); setLoading(false); }
    );
  };

  const sendMsg = (msg) => {
    if (!msg.trim() || loading) return;
    const newChat = [...chat, {bot:false, text:msg}];
    setChat(newChat);
    setLoading(true);
    const msgs = newChat.map(m => ({role: m.bot ? "assistant" : "user", content: m.text}));
    callAI(msgs, buildSystem("link", geo),
      reply => { setChat(c => [...c, {bot:true, text:reply}]); setLoading(false); setTimeout(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100); },
      () => { setChat(c => [...c, {bot:true, text:"Sin conexión. 🙏"}]); setLoading(false); }
    );
  };

  const [followUp, setFollowUp] = useState("");

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#081B4B,#1a0a3d)",padding:"20px 18px 18px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <AphroditeAvatar size={46} pulse/>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#fff",letterSpacing:"0.04em"}}>Pega el Link</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Aphrodite analiza y cotiza por ti</div>
          </div>
        </div>
        {/* URL input */}
        <div style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:16,padding:"12px 14px"}}>
          <div style={{fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.45)",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>🔗 URL del producto</div>
          <input value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key==="Enter" && analyze()}
            placeholder="https://amazon.com/dp/... o cualquier tienda USA"
            style={{width:"100%",background:"transparent",border:"none",outline:"none",fontSize:13,color:"#fff",marginBottom:10,fontFamily:"monospace"}}/>
          <button onClick={analyze} disabled={!url.trim() || loading}
            style={{width:"100%",padding:"11px",borderRadius:12,background:url.trim()?RED:"rgba(255,255,255,0.1)",color:"#fff",fontSize:13,fontWeight:800,border:"none",cursor:url.trim()?"pointer":"default",opacity:url.trim()?1:0.5,transition:"all 0.2s"}}>
            {loading ? "Analizando..." : "🔍 Analizar producto"}
          </button>
        </div>
        {/* Quick stores */}
        <div style={{display:"flex",gap:8,marginTop:10,overflowX:"auto"}}>
          {["amazon.com","nike.com","apple.com","sephora.com","target.com"].map(s => (
            <div key={s} style={{flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"4px 10px",fontSize:10,color:"rgba(255,255,255,0.5)",fontFamily:"monospace"}}>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:12,background:"#F3F5FB"}}>
        {chat.map((m,i) => (
          <div key={i} style={{display:"flex",justifyContent:m.bot?"flex-start":"flex-end",gap:8,alignItems:"flex-end"}}>
            {m.bot && <AphroditeAvatar size={28}/>}
            <div style={{maxWidth:"80%",padding:"11px 14px",borderRadius:18,background:m.bot?"#fff":NAVY,color:m.bot?"#1a2240":"#fff",fontSize:13,lineHeight:1.6,boxShadow:m.bot?"0 2px 8px rgba(8,27,75,0.07)":"none",wordBreak:"break-all"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <AphroditeAvatar size={28}/>
            <div style={{background:"#fff",borderRadius:18,padding:"12px 16px",boxShadow:"0 2px 8px rgba(8,27,75,0.07)"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i => <span key={i} style={{width:7,height:7,borderRadius:"50%",background:RED,display:"inline-block",animation:`bounce ${0.4+i*0.15}s ease-in-out infinite alternate`}}/>)}
                <span style={{fontSize:11,color:"#8b96b8",marginLeft:4}}>Aphrodite está analizando...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Follow-up input */}
      <div style={{display:"flex",gap:8,padding:"10px 14px",background:"#fff",borderTop:"1px solid #dde2f0",flexShrink:0}}>
        <input value={followUp} onChange={e => setFollowUp(e.target.value)}
          onKeyDown={e => { if(e.key==="Enter" && followUp.trim()){ sendMsg(followUp); setFollowUp(""); } }}
          placeholder="Responde a Aphrodite..."
          style={{flex:1,padding:"10px 14px",border:"1.5px solid #dde2f0",borderRadius:999,fontSize:13,outline:"none"}}/>
        <button onClick={() => { if(followUp.trim()){ sendMsg(followUp); setFollowUp(""); } }}
          style={{width:40,height:40,borderRadius:"50%",background:RED,color:"#fff",border:"none",cursor:"pointer",fontSize:14,flexShrink:0}}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* ─── HERO SLIDER ─── */
function HeroSlider({onNavigate}) {
  const [idx, setIdx] = useState(0);
  const touchX = useRef(0);
  const timer = useRef(null);

  const reset = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setIdx(i => (i+1) % SLIDES.length), 5000);
  };

  useEffect(() => { reset(); return () => clearInterval(timer.current); }, []);

  const go = (n) => { setIdx((idx + n + SLIDES.length) % SLIDES.length); reset(); };
  const s = SLIDES[idx];

  return (
    <div style={{height:200,position:"relative",overflow:"hidden",background:s.bg,transition:"background 0.5s"}}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchX.current; if(Math.abs(dx)>40) go(dx<0?1:-1); }}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"44px 44px"}}/>
      <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",background:"radial-gradient(circle,rgba(227,30,36,0.2) 0%,transparent 70%)",top:-60,right:-40}}/>
      <div style={{position:"absolute",top:18,right:18,fontSize:44,zIndex:2,filter:"drop-shadow(0 3px 10px rgba(0,0,0,0.3))"}}>{s.emoji}</div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 20px 18px",zIndex:3}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:6,display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#10b981",display:"inline-block",animation:"pulse 2s infinite"}}/>
          PLATAFORMA #1 EN RD
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#fff",lineHeight:0.95,letterSpacing:"0.02em",marginBottom:7}}>
          {s.title}<br/><span style={{color:RED}}>{s.em}</span>
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginBottom:12}}>{s.sub}</div>
        <button onClick={() => onNavigate(s.page)}
          style={{background:RED,color:"#fff",fontSize:11,fontWeight:800,padding:"9px 16px",borderRadius:999,border:"none",cursor:"pointer",boxShadow:"0 6px 20px rgba(227,30,36,0.4)"}}>
          {s.cta} →
        </button>
      </div>
      <div style={{position:"absolute",bottom:8,right:14,display:"flex",gap:4,zIndex:4}}>
        {SLIDES.map((_,i) => (
          <div key={i} onClick={() => { setIdx(i); reset(); }}
            style={{width:i===idx?18:6,height:6,borderRadius:3,background:i===idx?RED:"rgba(255,255,255,0.3)",cursor:"pointer",transition:"all 0.3s"}}/>
        ))}
      </div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#B22234 0%,#B22234 33%,#fff 33%,#fff 66%,#3C3B6E 66%)",opacity:0.5}}/>
    </div>
  );
}

/* ─── STORE DETAIL ─── */
function StoreDetail({store, geo, onBack, onNavigate}) {
  const [aiMsg, setAiMsg] = useState("");
  const [chat, setChat] = useState([{bot:true, text:`¡Hola! 👩🏻‍💼 Soy Aphrodite. Estoy aquí para ayudarte con ${store.name}. ¿Qué te interesa comprar? Te digo si es un buen deal y cuánto te costará enviarlo a ${geo ? geo.name : "tu país"} 😊`}]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const send = () => {
    if (!aiMsg.trim() || loading) return;
    const m = aiMsg.trim();
    setAiMsg("");
    const newChat = [...chat, {bot:false, text:m}];
    setChat(newChat);
    setLoading(true);
    const msgs = newChat.map(c => ({role: c.bot ? "assistant" : "user", content: c.text}));
    callAI(msgs, buildSystem("shop", geo) + ` El usuario está viendo la tienda ${store.name} (${store.url}).`,
      reply => { setChat(c => [...c, {bot:true, text:reply}]); setLoading(false); setTimeout(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100); },
      () => { setChat(c => [...c, {bot:true, text:"Sin conexión 🙏"}]); setLoading(false); }
    );
  };

  return (
    <div style={{minHeight:"100%"}}>
      <div style={{height:180,background:store.bg,position:"relative",display:"flex",alignItems:"flex-end"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/>
        <button onClick={onBack} style={{position:"absolute",top:12,left:12,zIndex:3,width:32,height:32,borderRadius:"50%",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",fontSize:18,cursor:"pointer",backdropFilter:"blur(6px)"}}>‹</button>
        <div style={{position:"relative",zIndex:2,padding:"0 18px 18px"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,color:"#fff",letterSpacing:"0.03em",textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>{store.name}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>★ {store.rating} · ✈ Desde ${geo ? geo.rate : "8.50"}/lb</div>
        </div>
      </div>

      <div style={{display:"flex",gap:10,padding:"12px 16px",background:"#fff",borderBottom:"1px solid #dde2f0"}}>
        <a href={store.url} target="_blank" rel="noreferrer"
          style={{flex:1,background:NAVY,color:"#fff",fontSize:13,fontWeight:800,padding:12,borderRadius:14,textAlign:"center",textDecoration:"none"}}>
          🔗 Ir a la tienda
        </a>
        <button onClick={() => onNavigate("account")}
          style={{flex:1,background:RED,color:"#fff",fontSize:13,fontWeight:800,padding:12,borderRadius:14,border:"none",cursor:"pointer"}}>
          🤝 Compra asistida
        </button>
      </div>

      <div style={{display:"flex",background:"#F3F5FB",borderBottom:"1px solid #dde2f0"}}>
        {[["✈",`$${geo ? geo.rate : "8.50"}/lb`,"Envío desde"],["⏱","3-7 días","Entrega"],["🛡️","Incluido","Seguro"],["⭐",store.rating,"Rating"]].map(([icon,val,lbl]) => (
          <div key={lbl} style={{flex:1,textAlign:"center",padding:"12px 4px",borderRight:"1px solid #dde2f0"}}>
            <div style={{fontSize:16}}>{icon}</div>
            <div style={{fontSize:11,fontWeight:800,color:NAVY}}>{val}</div>
            <div style={{fontSize:9,color:"#8b96b8",textTransform:"uppercase",letterSpacing:"0.07em"}}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"16px 16px 0",background:"#fff",borderBottom:"1px solid #dde2f0"}}>
        <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:6}}>Sobre {store.name}</div>
        <div style={{fontSize:13,color:"#5d6a8e",lineHeight:1.65,marginBottom:14}}>{store.desc}</div>
      </div>

      {/* Aphrodite chat in store */}
      <div style={{margin:"14px 16px 0",background:"linear-gradient(135deg,#081B4B,#0a2070)",borderRadius:20,padding:16,boxShadow:"0 6px 24px rgba(8,27,75,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
          <AphroditeAvatar size={38} pulse/>
          <div>
            <div style={{fontWeight:800,fontSize:14,color:"#fff"}}>Aphrodite AI</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>● En línea · Experta en {store.name}</div>
          </div>
        </div>
        <div ref={chatRef} style={{maxHeight:160,overflowY:"auto",marginBottom:10,display:"flex",flexDirection:"column",gap:8}}>
          {chat.map((m,i) => (
            <div key={i} style={{display:"flex",justifyContent:m.bot?"flex-start":"flex-end",gap:6,alignItems:"flex-end"}}>
              {m.bot && <AphroditeAvatar size={22}/>}
              <div style={{maxWidth:"80%",padding:"9px 12px",borderRadius:14,background:m.bot?"rgba(255,255,255,0.1)":RED,color:"#fff",fontSize:12,lineHeight:1.5}}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:"flex",gap:6,alignItems:"flex-end"}}>
              <AphroditeAvatar size={22}/>
              <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:"9px 12px"}}>
                <div style={{display:"flex",gap:3}}>{[0,1,2].map(i => <span key={i} style={{width:5,height:5,borderRadius:"50%",background:"rgba(255,255,255,0.5)",display:"inline-block",animation:`bounce ${0.4+i*0.15}s ease-in-out infinite alternate`}}/>)}</div>
              </div>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={aiMsg} onChange={e => setAiMsg(e.target.value)}
            onKeyDown={e => e.key==="Enter" && send()}
            placeholder="Pregunta algo..."
            style={{flex:1,background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:999,padding:"9px 14px",fontSize:13,color:"#fff",outline:"none"}}/>
          <button onClick={send} disabled={loading}
            style={{width:38,height:38,borderRadius:"50%",background:RED,color:"#fff",border:"none",cursor:"pointer",fontSize:14,flexShrink:0}}>➤</button>
        </div>
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

/* ─── HOME PAGE ─── */
function HomePage({onNavigate, geo}) {
  return (
    <div>
      <HeroSlider onNavigate={onNavigate}/>
      <GeoBar geo={geo} onNavigate={onNavigate}/>
      <div style={{background:"#fff",borderBottom:"1px solid #dde2f0",display:"flex",overflowX:"auto"}}>
        {[["🔒","Pagos seguros"],["✈️","3-7 días"],["📍","Miami, FL"],["📦","Rastreo live"],["💬","Soporte 24/7"]].map(([icon,txt]) => (
          <div key={txt} style={{flexShrink:0,display:"flex",alignItems:"center",gap:6,padding:"10px 14px",fontSize:11,fontWeight:600,color:"#5d6a8e",borderRight:"1px solid #dde2f0",whiteSpace:"nowrap"}}>
            <span>{icon}</span>{txt}
          </div>
        ))}
      </div>

      <div style={{padding:"16px 16px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:NAVY,letterSpacing:"0.02em"}}>🛍️ Tiendas USA</span>
          <button onClick={() => onNavigate("stores")} style={{fontSize:12,fontWeight:700,color:RED,background:"none",border:"none",cursor:"pointer"}}>Ver todas →</button>
        </div>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8}}>
          {[["🛍️","Outlets","outlets"],["👗","Moda","moda"],["🏬","Marketplaces","marketplaces"],["👟","Calzado","calzado"],["💄","Belleza","belleza"],["📱","Tech","tech"],["🏠","Hogar","hogar"]].map(([icon,lbl,cat]) => (
            <button key={cat} onClick={() => onNavigate("stores", cat)}
              style={{flexShrink:0,background:"#fff",border:"1.5px solid #dde2f0",borderRadius:20,padding:"8px 14px",display:"flex",alignItems:"center",gap:7,fontSize:12,fontWeight:700,color:NAVY,cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(8,27,75,0.07)"}}>
              <span style={{fontSize:16}}>{icon}</span>{lbl}
            </button>
          ))}
        </div>
      </div>

      <div style={{display:"flex",background:"linear-gradient(135deg,#081B4B,#0a1f55)",margin:"14px 0 0"}}>
        {[["+50K","Clientes"],["+1M","Paquetes"],["+20","Países"],["99%","Satisfacción"]].map(([num,lbl]) => (
          <div key={lbl} style={{flex:1,textAlign:"center",padding:"14px 6px",borderRight:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#fff"}}><span style={{color:RED}}>{num[0]}</span>{num.slice(1)}</div>
            <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.09em"}}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Pega tu link promo */}
      <div style={{margin:"14px 16px 0",background:"linear-gradient(135deg,#1a0a3d,#0d0a2e)",borderRadius:20,padding:20,boxShadow:"0 6px 24px rgba(0,0,0,0.2)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.1}}>🔗</div>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.5)",marginBottom:7}}>✨ NUEVO</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#fff",marginBottom:6}}>Pega el link.<br/><span style={{color:RED}}>Nosotros compramos.</span></div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6,marginBottom:14}}>Copia cualquier URL de Amazon, Nike, Apple o donde sea. Aphrodite calcula el total.</div>
        <button onClick={() => onNavigate("link")}
          style={{background:RED,color:"#fff",fontSize:12,fontWeight:800,padding:"10px 20px",borderRadius:999,border:"none",cursor:"pointer",boxShadow:"0 6px 20px rgba(227,30,36,0.4)"}}>
          🔗 Pegar link ahora
        </button>
      </div>

      <div style={{padding:"18px 16px 0"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:NAVY,letterSpacing:"0.02em",marginBottom:12}}>⚡ Cómo Funciona</div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>
          {[["🏠","01","Tu dirección en USA","Personal en Miami, FL. Gratis."],["🛍️","02","Compra donde quieras","Amazon, Nike, Apple, cualquier tienda."],["📦","03","Recibimos tu pedido","Llega a Miami. Te avisamos."],["🔧","04","Consolidamos","Optimizamos el empaque."],["🎉","05","Lo recibes en casa","3-7 días a tu puerta."]].map(([icon,num,title,desc]) => (
            <div key={num} style={{flexShrink:0,width:170,background:"#fff",borderRadius:20,padding:"16px 14px",border:"1.5px solid #dde2f0",boxShadow:"0 2px 8px rgba(8,27,75,0.07)",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:8,right:10,fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#eef0f8",lineHeight:1}}>{num}</div>
              <div style={{fontSize:26,marginBottom:8,position:"relative"}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:800,color:NAVY,marginBottom:4,position:"relative"}}>{title}</div>
              <div style={{fontSize:11,color:"#5d6a8e",lineHeight:1.5,position:"relative"}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:NAVY,letterSpacing:"0.02em",marginBottom:12}}>✦ Beneficios</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["📍","Dirección en USA","Tu casillero personal en Miami, FL."],["🛡️","100% Seguro","Paquetes asegurados siempre."],["📦","Consolidación","Ahorra hasta 60% en envío."],["✈️","+20 países","Toda Latinoamérica y el Caribe."]].map(([icon,title,desc]) => (
            <div key={title} style={{background:"#fff",borderRadius:20,padding:"16px 14px",border:"1.5px solid #dde2f0",boxShadow:"0 2px 8px rgba(8,27,75,0.07)"}}>
              <div style={{fontSize:28,marginBottom:8}}>{icon}</div>
              <div style={{fontSize:12,fontWeight:800,color:NAVY,marginBottom:4}}>{title}</div>
              <div style={{fontSize:11,color:"#5d6a8e",lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

/* ─── STORES PAGE ─── */
function StoresPage({initialCat, onStoreSelect}) {
  const [cat, setCat] = useState(initialCat || "all");
  const [query, setQuery] = useState("");
  const filtered = STORES.filter(s => (cat==="all"||s.cat===cat) && (!query||s.name.toLowerCase().includes(query.toLowerCase())));

  return (
    <div>
      <div style={{background:"#0d2560",padding:"10px 14px 12px"}}>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(255,255,255,0.35)",fontSize:14}}>🔍</span>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Busca Nike, Apple, Zara..."
            style={{width:"100%",padding:"11px 38px",background:"rgba(255,255,255,0.09)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:999,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:7,padding:"10px 14px",overflowX:"auto",background:"#fff",borderBottom:"1px solid #dde2f0"}}>
        {CATS.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            style={{flexShrink:0,padding:"7px 14px",borderRadius:999,fontSize:12,fontWeight:600,border:"1.5px solid transparent",cursor:"pointer",background:cat===c.key?NAVY:"#eef0f8",color:cat===c.key?"#fff":"#5d6a8e",whiteSpace:"nowrap"}}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>
      <div style={{padding:"8px 14px 2px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:13,color:"#8b96b8"}}><strong style={{color:NAVY}}>{filtered.length}</strong> tiendas</span>
      </div>
      {filtered.length===0 && (
        <div style={{textAlign:"center",padding:"60px 20px",color:"#8b96b8"}}>
          <div style={{fontSize:40,marginBottom:12}}>🔍</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:NAVY}}>Sin resultados</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:"10px 14px"}}>
        {filtered.map(s => <StoreCard key={s.id} store={s} onClick={onStoreSelect}/>)}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

/* ─── AI PAGE ─── */
function AIPage({geo}) {
  const [mode, setMode] = useState("shop");
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const MODES = [
    {key:"shop",    icon:"🛍️", label:"Compras"},
    {key:"support", icon:"💬", label:"Soporte"},
    {key:"quote",   icon:"📦", label:"Cotizar"},
    {key:"link",    icon:"🔗", label:"Link"},
    {key:"agent",   icon:"⚡", label:"Agente"},
  ];

  const SUGGESTIONS = {
    shop:    ["¿Qué tiendas recomendás?","Mejores sneakers baratos","¿Vale la pena comprar en Sephora?"],
    support: ["¿Cuánto tarda mi paquete?","¿Cómo consolido?","¿Cómo obtengo mi dirección?"],
    quote:   [`Cotizar 2 lbs a ${geo?geo.name:"Rep. Dom."}`,`Cotizar zapatos a ${geo?geo.name:"mi país"}`,`Cotizar laptop a ${geo?geo.name:"mi país"}`],
    link:    ["Tengo un link de Amazon","Quiero analizar un producto","¿Cómo funciona esto?"],
    agent:   ["Quiero comprar un iPhone","Ayúdame a consolidar","¿Cuánto ahorro vs precio local?"],
  };

  const getWelcome = (m) => {
    const name = geo ? geo.name : "tu país";
    const welcomes = {
      shop:    `¡Hola! 👋 Soy Aphrodite, tu guía de compras en USA. ¿Qué andas buscando hoy? Te ayudo a encontrar el mejor deal y te digo cuánto te costará enviarlo a ${name} 🛍️`,
      support: `¡Hola! Estoy aquí para resolver tus dudas 💙 Cuéntame qué necesitas saber sobre tus envíos, el casillero o el proceso de compra.`,
      quote:   `¡Hola! Soy tu cotizadora personal 📦 Dame el peso de tu paquete y te doy el precio exacto al instante para ${name}.`,
      link:    `¡Hola! 🔗 Pégame el link de cualquier producto de USA — Amazon, Nike, Apple, donde sea — y te analizo el deal y te digo cuánto te cuesta traerlo a ${name}.`,
      agent:   `¡Hola! Soy tu agente proactiva de USALINK ⚡ Dime qué quieres comprar, qué tienes en tu casillero o qué dudas tienes. ¡Estoy aquí para ayudarte a optimizar todo!`,
    };
    return welcomes[m] || welcomes.shop;
  };

  const send = (msg) => {
    if (!msg.trim() || loading) return;
    const m = msg.trim();
    setInput("");
    const newChat = [...chat, {bot:false, text:m}];
    setChat(newChat);
    setLoading(true);
    const msgs = newChat.map(c => ({role: c.bot ? "assistant" : "user", content: c.text}));
    callAI(msgs, buildSystem(mode, geo),
      reply => { setChat(c => [...c, {bot:true, text:reply}]); setLoading(false); setTimeout(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100); },
      () => { setChat(c => [...c, {bot:true, text:"Sin conexión en este momento. Intenta de nuevo 🙏"}]); setLoading(false); }
    );
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(160deg,#050f2b,#0a1f4e)",padding:"20px 20px 16px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <AphroditeAvatar size={58} pulse/>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#fff",letterSpacing:"0.04em",lineHeight:1}}>Aphrodite</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>Tu asistente personal de compras</div>
            <div style={{fontSize:11,color:"#10b981",fontWeight:700,marginTop:3}}>● En línea ahora {geo ? `· ${geo.flag} ${geo.name}` : ""}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:7,overflowX:"auto"}}>
          {MODES.map(m => (
            <button key={m.key} onClick={() => { setMode(m.key); setChat([]); }}
              style={{flexShrink:0,padding:"7px 13px",borderRadius:999,fontSize:12,fontWeight:700,cursor:"pointer",border:"1.5px solid",borderColor:mode===m.key?RED:"rgba(255,255,255,0.15)",background:mode===m.key?RED:"rgba(255,255,255,0.08)",color:mode===m.key?"#fff":"rgba(255,255,255,0.7)"}}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div style={{display:"flex",gap:8,padding:"10px 14px",overflowX:"auto",background:"#F3F5FB",borderBottom:"1px solid #dde2f0",flexShrink:0}}>
        {(SUGGESTIONS[mode]||[]).map(s => (
          <button key={s} onClick={() => send(s)}
            style={{flexShrink:0,padding:"7px 13px",borderRadius:999,fontSize:12,fontWeight:600,cursor:"pointer",background:"#fff",color:NAVY,border:"1.5px solid #dde2f0",whiteSpace:"nowrap"}}>
            {s}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:"14px 14px 8px",display:"flex",flexDirection:"column",gap:12,background:"#F3F5FB"}}>
        {chat.length===0 && (
          <div style={{background:"#fff",borderRadius:20,padding:18,boxShadow:"0 2px 8px rgba(8,27,75,0.07)",display:"flex",gap:12,alignItems:"flex-start"}}>
            <AphroditeAvatar size={40} pulse/>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:NAVY,marginBottom:4}}>Aphrodite</div>
              <div style={{fontSize:13,color:"#5d6a8e",lineHeight:1.6}}>{getWelcome(mode)}</div>
            </div>
          </div>
        )}
        {chat.map((m,i) => (
          <div key={i} style={{display:"flex",justifyContent:m.bot?"flex-start":"flex-end",gap:8,alignItems:"flex-end"}}>
            {m.bot && <AphroditeAvatar size={30}/>}
            <div style={{maxWidth:"78%",padding:"11px 14px",borderRadius:18,background:m.bot?"#fff":NAVY,color:m.bot?"#1a2240":"#fff",fontSize:13,lineHeight:1.6,boxShadow:m.bot?"0 2px 8px rgba(8,27,75,0.07)":"none"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <AphroditeAvatar size={30}/>
            <div style={{background:"#fff",borderRadius:18,padding:"12px 16px",boxShadow:"0 2px 8px rgba(8,27,75,0.07)"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i => <span key={i} style={{width:7,height:7,borderRadius:"50%",background:RED,display:"inline-block",animation:`bounce ${0.4+i*0.15}s ease-in-out infinite alternate`}}/>)}
                <span style={{fontSize:11,color:"#8b96b8",marginLeft:6}}>Aphrodite está escribiendo...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{display:"flex",gap:8,padding:"10px 14px",background:"#fff",borderTop:"1px solid #dde2f0",flexShrink:0}}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send(input)}
          placeholder={mode==="link"?"Pega tu link aquí...":"Pregúntame algo..."}
          style={{flex:1,padding:"10px 14px",border:"1.5px solid #dde2f0",borderRadius:999,fontSize:14,outline:"none"}}/>
        <button onClick={() => send(input)} disabled={loading}
          style={{width:40,height:40,borderRadius:"50%",background:RED,color:"#fff",border:"none",cursor:"pointer",fontSize:14,flexShrink:0,boxShadow:"0 4px 12px rgba(227,30,36,0.35)"}}>
          ➤
        </button>
      </div>
    </div>
  );
}

/* ─── TRACKING PAGE ─── */
function TrackPage() {
  const [trackId, setTrackId] = useState("");
  const [result, setResult] = useState(null);
  const doTrack = () => { if(trackId.trim().length>=3) setResult(trackId.toUpperCase()); };
  return (
    <div>
      <div style={{background:"linear-gradient(155deg,#050f2b,#0a1f55)",padding:"28px 20px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(227,30,36,0.15) 0%,transparent 70%)",top:-80,right:-60}}/>
        <div style={{position:"relative",zIndex:2}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#10b981",display:"inline-block"}}/>RASTREO EN VIVO
          </div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:34,color:"#fff",marginBottom:8}}>Rastrea tu paquete</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",marginBottom:22}}>Ingresa tu número de rastreo USALINK</div>
          <div style={{display:"flex",gap:8}}>
            <input value={trackId} onChange={e => setTrackId(e.target.value)} onKeyDown={e => e.key==="Enter" && doTrack()}
              placeholder="USL-2024-XXXXXXX"
              style={{flex:1,background:"rgba(255,255,255,0.09)",border:"1.5px solid rgba(255,255,255,0.15)",borderRadius:999,padding:"13px 16px",fontSize:13,color:"#fff",outline:"none",fontFamily:"monospace"}}/>
            <button onClick={doTrack}
              style={{background:RED,color:"#fff",fontSize:13,fontWeight:800,padding:"13px 20px",borderRadius:999,border:"none",cursor:"pointer",flexShrink:0}}>
              Buscar
            </button>
          </div>
          {result && (
            <div style={{marginTop:18,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:20,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14,borderBottom:"1px solid rgba(255,255,255,0.1)",marginBottom:14}}>
                <span style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.55)"}}>{result}</span>
                <span style={{background:"rgba(16,185,129,0.2)",color:"#34d399",fontSize:10,fontWeight:800,padding:"4px 12px",borderRadius:999}}>En Camino ✈</span>
              </div>
              {[["done","✅ Recibido en Miami, FL","28 May 2026 · 09:42 AM"],["done","✅ Procesado y consolidado","29 May 2026 · 02:15 PM"],["now","✈ En vuelo hacia destino","30 May 2026 · En progreso"],["","📋 Aduana & Despacho","Estimado: 1 Jun 2026"],["","🏠 Entrega en domicilio","Estimado: 2 Jun 2026"]].map(([st,lbl,date],i) => (
                <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:12}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:st==="done"?"#10b981":st==="now"?"#F5A623":"rgba(255,255,255,0.2)",flexShrink:0,marginTop:3}}/>
                  <div><div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{lbl}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.38)",marginTop:2,fontFamily:"monospace"}}>{date}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CALCULATOR PAGE ─── */
function CalcPage({geo}) {
  const [weight, setWeight] = useState("");
  const [country, setCountry] = useState(geo ? String(geo.rate) : "");
  const [result, setResult] = useState(null);
  const calc = () => {
    const w = parseFloat(weight)||0, r = parseFloat(country)||0;
    if(!w||!r){alert("Ingresa el peso y selecciona el país");return;}
    setResult({bill:w.toFixed(2),base:(w*r).toFixed(2),total:(w*r+3).toFixed(2)});
  };
  return (
    <div>
      <div style={{background:"#050f2b",padding:"24px 20px 28px"}}>
        <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:10}}>📦 CALCULADORA</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:"#fff",marginBottom:6}}>¿Cuánto costará?</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>Cotización instantánea sin sorpresas</div>
      </div>
      <div style={{margin:"14px 16px 0",background:"#fff",borderRadius:20,padding:20,boxShadow:"0 6px 24px rgba(8,27,75,0.11)",border:"1.5px solid #dde2f0"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label style={{fontSize:10,fontWeight:800,color:"#5d6a8e",textTransform:"uppercase",letterSpacing:"0.09em",display:"block",marginBottom:6}}>Peso (lbs)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="0.0" min="0" step="0.1"
              style={{width:"100%",padding:"11px 14px",border:"1.5px solid #dde2f0",borderRadius:14,fontSize:14,color:NAVY,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:800,color:"#5d6a8e",textTransform:"uppercase",letterSpacing:"0.09em",display:"block",marginBottom:6}}>País destino</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              style={{width:"100%",padding:"11px 14px",border:"1.5px solid #dde2f0",borderRadius:14,fontSize:13,color:NAVY,outline:"none",background:"#fff",WebkitAppearance:"none",boxSizing:"border-box"}}>
              <option value="">Seleccionar...</option>
              {Object.entries(GEO_RATES).filter(([k])=>k!=="US").map(([k,v]) => (
                <option key={k} value={v.rate}>{v.flag} {v.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={calc}
          style={{width:"100%",padding:15,borderRadius:14,background:RED,color:"#fff",fontSize:14,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 6px 20px rgba(227,30,36,0.35)"}}>
          📦 Calcular
        </button>
        {result && (
          <div style={{marginTop:14,background:"linear-gradient(135deg,#081B4B,#050f2b)",borderRadius:14,padding:16}}>
            {[["Peso facturado",result.bill+" lbs"],["Tarifa base","$"+result.base],["Manejo y seguro","$3.00"]].map(([lbl,val]) => (
              <div key={lbl} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(255,255,255,0.55)",marginBottom:8}}>
                <span>{lbl}</span><span style={{color:"rgba(255,255,255,0.85)",fontWeight:600}}>{val}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,color:"#fff",paddingTop:10,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
              <span>💰 Total</span><span style={{color:"#34d399",fontSize:20}}>${result.total}</span>
            </div>
          </div>
        )}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

/* ─── ACCOUNT PAGE ─── */
function AccountPage({onNavigate, geo}) {
  return (
    <div>
      <div style={{background:"linear-gradient(155deg,#050f2b,#0d2560)",padding:"28px 20px 32px",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",background:"linear-gradient(135deg,#E31E24,#0d2560)",margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#fff",border:"3px solid rgba(255,255,255,0.15)"}}>B</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#fff",letterSpacing:"0.03em"}}>Bruce Ramírez</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:8}}>bruce@usalinkrd.com</div>
        {geo && <div style={{fontSize:12,color:"rgba(255,255,255,0.4)",marginBottom:16}}>{geo.flag} {geo.name} · ✈ ${geo.rate}/lb</div>}
        <div style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:16,padding:"14px 16px",textAlign:"left"}}>
          <div style={{fontSize:9,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:6}}>📍 Tu dirección en USA</div>
          <div style={{fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.85)",lineHeight:1.7}}>
            Bruce Ramírez — USL-00423<br/>
            3250 NW 107th Ave Suite 500<br/>
            Doral, FL 33172<br/>
            United States
          </div>
        </div>
      </div>
      <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #dde2f0"}}>
        {[["12","Paquetes"],["3","En camino"],["$148","Ahorrado"]].map(([num,lbl]) => (
          <div key={lbl} style={{flex:1,textAlign:"center",padding:"16px 8px",borderRight:"1px solid #dde2f0"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:NAVY}}>{num}</div>
            <div style={{fontSize:10,fontWeight:600,color:"#8b96b8",textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{lbl}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"16px 16px 0",display:"flex",flexDirection:"column",gap:8}}>
        {[["📦","Mis paquetes","3 paquetes en tránsito","track"],["🔗","Pegar link","Compra asistida por IA","link"],["🛍️","Tiendas USA","48 tiendas disponibles","stores"],["🧮","Calcular envío","Cotización instantánea","calc"],["🤖","Hablar con Aphrodite","Tu asistente personal","ai"]].map(([icon,title,sub,pg]) => (
          <div key={title} onClick={() => onNavigate(pg)}
            style={{background:"#fff",borderRadius:16,padding:16,display:"flex",alignItems:"center",gap:14,border:"1.5px solid #dde2f0",boxShadow:"0 2px 8px rgba(8,27,75,0.07)",cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:12,background:"rgba(8,27,75,0.07)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:NAVY,marginBottom:2}}>{title}</div>
              <div style={{fontSize:11,color:"#8b96b8"}}>{sub}</div>
            </div>
            <div style={{color:"#c4cce0",fontSize:18}}>›</div>
          </div>
        ))}
      </div>
      <div style={{height:16}}/>
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN APP
══════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [storeCat, setStoreCat] = useState("all");
  const [selectedStore, setSelectedStore] = useState(null);
  const [geo, setGeo] = useState(null);

  /* ─── GEOLOCATION ─── */
  useEffect(() => {
    // Try browser geolocation first, then IP fallback
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => {
        const code = d.country_code;
        if (code && GEO_RATES[code]) {
          setGeo({...GEO_RATES[code], code});
        } else {
          setGeo({...GEO_RATES["DO"], code:"DO"}); // Default to DR
        }
      })
      .catch(() => {
        setGeo({...GEO_RATES["DO"], code:"DO"}); // Default to DR
      });
  }, []);

  const navigate = (p, cat) => {
    setPage(p);
    if (cat) setStoreCat(cat);
    setSelectedStore(null);
  };

  const NAV = [
    {id:"home",    icon:"🏠", label:"Inicio"},
    {id:"stores",  icon:"🛍️", label:"Tiendas"},
    {id:"ai",      icon:"👩🏻‍💼", label:"IA", special:true},
    {id:"track",   icon:"📡", label:"Rastreo"},
    {id:"account", icon:"👤", label:"Cuenta"},
  ];

  const currentPage = selectedStore ? "stores" : page;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
        input::placeholder { color:rgba(255,255,255,0.35); }
        ::-webkit-scrollbar { display:none; }
        @keyframes bounce { from{transform:translateY(0);opacity:0.5} to{transform:translateY(-6px);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#F3F5FB",fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
        <div style={{height:"env(safe-area-inset-top,0px)",background:"#050f2b",flexShrink:0}}/>

        {/* Top nav */}
        <nav style={{flexShrink:0,height:56,background:"rgba(8,27,75,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",padding:"0 14px",justifyContent:"space-between",zIndex:200}}>
          <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={() => navigate("home")}>
            <div style={{width:34,height:34,background:RED,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 12px rgba(227,30,36,0.45)",flexShrink:0}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            </div>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#fff",letterSpacing:"0.08em",lineHeight:1}}>USALINK</div>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",letterSpacing:"0.06em",textTransform:"uppercase",marginTop:2}}>1k tiendas a un clic</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {geo && <span style={{fontSize:16}}>{geo.flag}</span>}
            <a href="https://app.usalinkrd.com" target="_blank" rel="noreferrer"
              style={{background:RED,color:"#fff",fontSize:12,fontWeight:700,padding:"7px 14px",borderRadius:999,boxShadow:"0 3px 10px rgba(227,30,36,0.4)",textDecoration:"none"}}>
              Entrar
            </a>
          </div>
        </nav>

        {/* Pages */}
        <div style={{flex:1,overflow:"hidden",position:"relative"}}>
          {[
            {id:"home",    show: !selectedStore && page==="home",    el: <HomePage onNavigate={navigate} geo={geo}/>},
            {id:"stores",  show: !selectedStore && page==="stores",  el: <StoresPage initialCat={storeCat} onStoreSelect={s => { setSelectedStore(s); }}/>},
            {id:"store-d", show: !!selectedStore,                    el: selectedStore ? <StoreDetail store={selectedStore} geo={geo} onBack={() => setSelectedStore(null)} onNavigate={navigate}/> : null},
            {id:"ai",      show: !selectedStore && page==="ai",      el: <AIPage geo={geo}/>},
            {id:"link",    show: !selectedStore && page==="link",    el: <LinkPage geo={geo}/>},
            {id:"track",   show: !selectedStore && page==="track",   el: <TrackPage/>},
            {id:"calc",    show: !selectedStore && page==="calc",    el: <CalcPage geo={geo}/>},
            {id:"account", show: !selec
