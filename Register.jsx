import { useState } from "react";
import { useAuth } from "./AuthContext";

const RED = "#E31E24";

const COUNTRIES = [
  {code:"DO", flag:"🇩🇴", name:"Rep. Dominicana"},
  {code:"MX", flag:"🇲🇽", name:"México"},
  {code:"CO", flag:"🇨🇴", name:"Colombia"},
  {code:"VE", flag:"🇻🇪", name:"Venezuela"},
  {code:"PE", flag:"🇵🇪", name:"Perú"},
  {code:"CL", flag:"🇨🇱", name:"Chile"},
  {code:"AR", flag:"🇦🇷", name:"Argentina"},
  {code:"BR", flag:"🇧🇷", name:"Brasil"},
  {code:"GT", flag:"🇬🇹", name:"Guatemala"},
  {code:"HN", flag:"🇭🇳", name:"Honduras"},
  {code:"SV", flag:"🇸🇻", name:"El Salvador"},
  {code:"CR", flag:"🇨🇷", name:"Costa Rica"},
  {code:"PA", flag:"🇵🇦", name:"Panamá"},
  {code:"EC", flag:"🇪🇨", name:"Ecuador"},
  {code:"BO", flag:"🇧🇴", name:"Bolivia"},
  {code:"PY", flag:"🇵🇾", name:"Paraguay"},
  {code:"UY", flag:"🇺🇾", name:"Uruguay"},
  {code:"US", flag:"🇺🇸", name:"Estados Unidos"},
];

export default function Register({ onSwitch, onSuccess }) {
  const { signUp } = useAuth();
  const [step, setStep]         = useState(1); // 1: info, 2: password, 3: success
  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [country, setCountry]   = useState("DO");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const nextStep = () => {
    setError("");
    if (!fullName.trim()) { setError("Ingresa tu nombre completo"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Ingresa un email válido"); return; }
    if (!country) { setError("Selecciona tu país"); return; }
    setStep(2);
  };

  const handle = async () => {
    setError("");
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    setLoading(true);
    const { error: err } = await signUp(email.trim(), password, fullName.trim(), country);
    if (err) { setError(err.message.includes("already") ? "Este email ya está registrado" : "Error al crear la cuenta"); setLoading(false); }
    else { setStep(3); }
  };

  if (step === 3) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#050f2b,#0a1f55,#0d2560)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px",textAlign:"center"}}>
      <div style={{fontSize:72,marginBottom:20}}>🎉</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:"#fff",letterSpacing:"0.04em",marginBottom:10}}>¡Cuenta creada!</div>
      <div style={{fontSize:14,color:"rgba(255,255,255,0.55)",marginBottom:8,maxWidth:300}}>
        Revisa tu email <span style={{color:"#fff",fontWeight:700}}>{email}</span> para verificar tu cuenta.
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:32}}>
        Tu casillero en Miami está listo 📦
      </div>
      <button onClick={onSuccess}
        style={{padding:"14px 40px",borderRadius:14,background:RED,color:"#fff",fontSize:15,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 8px 24px rgba(227,30,36,0.4)"}}>
        Ir al inicio →
      </button>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#050f2b 0%,#0a1f55 50%,#0d2560 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>

      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:56,height:56,background:RED,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 6px 20px rgba(227,30,36,0.4)"}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:"#fff",letterSpacing:"0.08em"}}>USALINK</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:4}}>Crea tu cuenta gratis</div>
      </div>

      {/* Steps indicator */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:24}}>
        {[1,2].map(s => (
          <div key={s} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:step>=s?RED:"rgba(255,255,255,0.1)",color:"#fff",fontSize:12,fontWeight:800,border:`2px solid ${step>=s?RED:"rgba(255,255,255,0.2)"}`}}>
              {step>s ? "✓" : s}
            </div>
            {s<2 && <div style={{width:40,height:2,background:step>s?"rgba(227,30,36,0.5)":"rgba(255,255,255,0.1)"}}/>}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{width:"100%",maxWidth:380,background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,padding:"28px 24px"}}>

        {error && (
          <div style={{background:"rgba(227,30,36,0.12)",border:"1px solid rgba(227,30,36,0.3)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"#ff6b6b",marginBottom:18,textAlign:"center"}}>
            ⚠️ {error}
          </div>
        )}

        {step === 1 && (
          <>
            <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>Tus datos</div>

            {/* Name */}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Nombre completo</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Juan Pérez"
                style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
            </div>

            {/* Email */}
            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
            </div>

            {/* Country */}
            <div style={{marginBottom:24}}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>País</label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {COUNTRIES.slice(0,9).map(c => (
                  <button key={c.code} onClick={() => setCountry(c.code)}
                    style={{padding:"10px 6px",borderRadius:12,border:`1.5px solid ${country===c.code?RED:"rgba(255,255,255,0.1)"}`,background:country===c.code?"rgba(227,30,36,0.15)":"rgba(255,255,255,0.04)",cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
                    <div style={{fontSize:20}}>{c.flag}</div>
                    <div style={{fontSize:9,fontWeight:700,color:country===c.code?"#fff":"rgba(255,255,255,0.5)",marginTop:3,lineHeight:1.2}}>{c.name}</div>
                  </button>
                ))}
              </div>
              <select value={country} onChange={e => setCountry(e.target.value)}
                style={{width:"100%",marginTop:8,padding:"11px 14px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:12,fontSize:13,color:"rgba(255,255,255,0.7)",outline:"none",WebkitAppearance:"none"}}>
                <option value="">Otro país...</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>

            <button onClick={nextStep}
              style={{width:"100%",padding:"14px",borderRadius:14,background:RED,color:"#fff",fontSize:15,fontWeight:800,border:"none",cursor:"pointer",boxShadow:"0 8px 24px rgba(227,30,36,0.4)"}}>
              Continuar →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button onClick={() => setStep(1)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",marginBottom:16,padding:0,display:"flex",alignItems:"center",gap:6}}>
              ‹ Volver
            </button>
            <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:6}}>Crea tu contraseña</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginBottom:20}}>Para <span style={{color:"rgba(255,255,255,0.7)"}}>{email}</span></div>

            <div style={{marginBottom:14}}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Contraseña</label>
              <div style={{position:"relative"}}>
                <input type={showPass?"text":"password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  style={{width:"100%",padding:"13px 44px 13px 16px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
                <button onClick={() => setShowPass(!showPass)}
                  style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:16,padding:0}}>
                  {showPass?"🙈":"👁️"}
                </button>
              </div>
            </div>

            <div style={{marginBottom:8}}>
              <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Confirmar contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key==="Enter" && handle()}
                placeholder="Repite tu contraseña"
                style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.07)",border:`1.5px solid ${confirm && confirm!==password?"rgba(227,30,36,0.5)":confirm&&confirm===password?"rgba(16,185,129,0.5)":"rgba(255,255,255,0.12)"}`,borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}/>
              {confirm && confirm===password && <div style={{fontSize:11,color:"#10b981",marginTop:5}}>✓ Las contraseñas coinciden</div>}
            </div>

            {/* Password strength */}
            {password && (
              <div style={{marginBottom:22}}>
                <div style={{display:"flex",gap:4,marginTop:8}}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{flex:1,height:3,borderRadius:2,background:password.length>=(i*3)?i<=1?"#ef4444":i<=2?"#f97316":i<=3?"#eab308":"#10b981":"rgba(255,255,255,0.1)"}}/>
                  ))}
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:4}}>
                  {password.length<4?"Muy corta":password.length<6?"Corta":password.length<10?"Buena":"Excelente"}
                </div>
              </div>
            )}

            <button onClick={handle} disabled={loading}
              style={{width:"100%",padding:"14px",borderRadius:14,background:loading?"rgba(227,30,36,0.5)":RED,color:"#fff",fontSize:15,fontWeight:800,border:"none",cursor:loading?"default":"pointer",boxShadow:loading?"none":"0 8px 24px rgba(227,30,36,0.4)",marginBottom:14}}>
              {loading ? "Creando cuenta..." : "Crear cuenta gratis 🎉"}
            </button>

            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",textAlign:"center",lineHeight:1.6}}>
              Al registrarte aceptas nuestros Términos de servicio
            </div>
          </>
        )}
      </div>

      <div style={{marginTop:20,display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:13,color:"rgba(255,255,255,0.35)"}}>¿Ya tienes cuenta?</span>
        <button onClick={onSwitch} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:700,cursor:"pointer",textDecoration:"underline"}}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
