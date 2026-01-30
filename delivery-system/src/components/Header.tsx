import { Link } from "react-router-dom"
import { FaUser, FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"

export default function Header() {
  const { user, logout } = useAuth()
  
  const links = ["Головна", "Dashboard", "Tracking"]
  if (user?.isAdmin) {
    links.push("Admin")
  }

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 40px",
      background: "rgba(79, 70, 229, 0.7)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      borderBottom: "1px solid rgba(255,255,255,0.2)",
      transition: "all 0.3s"
    }}>
      <h1 style={{margin:0, fontSize:"1.8rem", fontWeight:700, color:"white"}}>DeliveryCo</h1>
      <nav style={{display:"flex", gap:"20px", alignItems:"center"}}>
        {links.map((text, i) => (
          <Link 
            key={i} 
            to={i === 0 ? "/" : `/${text.toLowerCase()}`} 
            style={{
              color:"white",
              fontWeight:600,
              textDecoration:"none",
              padding:"6px 12px",
              borderRadius:"8px",
              transition:"all 0.2s"
            }}
            onMouseOver={e=>{
              const link = e.currentTarget as HTMLAnchorElement;
              link.style.background="rgba(255,255,255,0.2)";
              link.style.transform="translateY(-2px)";
            }}
            onMouseOut={e=>{
              const link = e.currentTarget as HTMLAnchorElement;
              link.style.background="transparent";
              link.style.transform="translateY(0)";
            }}
          >
            {text}
          </Link>
        ))}
        {/* Іконка профілю */}
        {user ? (
          <>
            <Link to="/profile" style={{
              color:"white",
              fontSize:"1.5rem",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              padding:"6px",
              borderRadius:"50%",
              transition:"all 0.2s"
            }}
            onMouseOver={e=>{
              const link = e.currentTarget as HTMLAnchorElement;
              link.style.background="rgba(255,255,255,0.2)";
              link.style.transform="translateY(-2px)";
            }}
            onMouseOut={e=>{
              const link = e.currentTarget as HTMLAnchorElement;
              link.style.background="transparent";
              link.style.transform="translateY(0)";
            }}
            >
              <FaUser />
            </Link>
            <button 
              onClick={logout}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "50%",
                transition: "all 0.2s"
              }}
              onMouseOver={e=>{
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background="rgba(255,255,255,0.2)";
                btn.style.transform="translateY(-2px)";
              }}
              onMouseOut={e=>{
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background="transparent";
                btn.style.transform="translateY(0)";
              }}
            >
              <FaSignOutAlt />
            </button>
          </>
        ) : (
          <Link to="/login" style={{
            color:"white",
            fontWeight:600,
            textDecoration:"none",
            padding:"6px 12px",
            borderRadius:"8px",
            transition:"all 0.2s"
          }}
          onMouseOver={e=>{
            const link = e.currentTarget as HTMLAnchorElement;
            link.style.background="rgba(255,255,255,0.2)";
            link.style.transform="translateY(-2px)";
          }}
          onMouseOut={e=>{
            const link = e.currentTarget as HTMLAnchorElement;
            link.style.background="transparent";
            link.style.transform="translateY(0)";
          }}
          >
            Увійти
          </Link>
        )}
      </nav>
    </header>
  )
}