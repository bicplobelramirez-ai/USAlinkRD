import { useState } from "react";
import { useAuth } from "./AuthContext";

const NAVY = "#081B4B";
const RED  = "#E31E24";

export default function Login({ onSwitch, onSuccess }) {
  const { signIn } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handle = async () => {
    if (!email.trim() || !password.trim()) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    const { error: err } = await signIn(email.trim(), password);
    if (err) { setError("Email o contraseña incorrectos"); setLoading(false); }
    else onSuccess();
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(155deg,#050f2b 0%,#0a1f55 50%,#0d2560 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px"}}>

      {/* Logo */}
      <div style={{textAlign:"center",marginBottom:36}}>
        <div style={{width:68,height:68,background:RED,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",boxShadow:"0 8px 28px rgba(227,30,36,0.45)"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#fff",letterSpacing:"0.08em",lineHeight:1}}>USALINK</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.45)",marginTop:6}}>Bienvenido de vuelta</div>
      </div>

      {/* Card */}
      <div style={{width:"100%",maxWidth:380,background:"rgba(255,255,255,0.04)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,padding:"28px 24px"}}>

        {error && (
          <div style={{background:"rgba(227,30,36,0.12)",border:"1px solid rgba(227,30,36,0.3)",borderRadius:12,padding:"11px 14px",fontSize:13,color:"#ff6b6b",marginBottom:18,textAlign:"center"}}>
            ⚠️ {error}
          </div>
        )}

        {/* Email */}
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Email</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key==="Enter" && handle()}
            placeholder="tu@email.com"
            style={{width:"100%",padding:"13px 16px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
          />
        </div>

        {/* Password */}
        <div style={{marginBottom:22}}>
          <label style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:"0.08em",display:"block",marginBottom:7}}>Contraseña</label>
          <div style={{position:"relative"}}>
            <input
              type={showPass?"text":"password"} value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key==="Enter" && handle()}
              placeholder="••••••••"
              style={{width:"100%",padding:"13px 44px 13px 16px",background:"rgba(255,255,255,0.07)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:14,fontSize:14,color:"#fff",outline:"none",boxSizing:"border-box"}}
            />
            <button onClick={() => setShowPass(!showPass)}
              style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:16,padding:0}}>
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>
          <div style={{textAlign:"right",marginTop:8}}>
            <button style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:12,cursor:"pointer"}}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Submit */}
        <button onClick={handle} disabled={loading}
          style={{width:"100%",padding:"14px",borderRadius:14,background:loading?"rgba(227,30,36,0.5)":RED,color:"#fff",fontSize:15,fontWeight:800,border:"none",cursor:loading?"default":"pointer",boxShadow:loading?"none":"0 8px 24px rgba(227,30,36,0.4)",transition:"all 0.2s",marginBottom:18}}>
          {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
        </button>

        {/* Divider */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.3)"}}>¿No tienes cuenta?</span>
          <div style={{flex:1,height:1,background:"rgba(255,255,255,0.1)"}}/>
        </div>

        {/* Switch to register */}
        <button onClick={onSwitch}
          style={{width:"100%",padding:"13px",borderRadius:14,background:"transparent",color:"rgba(255,255,255,0.75)",fontSize:14,fontWeight:700,border:"1.5px solid rgba(255,255,255,0.15)",cursor:"pointer"}}>
          Crear cuenta gratis
        </button>
      </div>

      <div style={{marginTop:24,fontSize:11,color:"rgba(255,255,255,0.25)",textAlign:"center",lineHeight:1.6}}>
        Al usar USALINK aceptas nuestros<br/>
        <span style={{color:"rgba(255,255,255,0.4)"}}>Términos de servicio</span> y <span style={{color:"rgba(255,255,255,0.4)"}}>Política de privacidad</span>
      </div>
    </div>
  );
}
