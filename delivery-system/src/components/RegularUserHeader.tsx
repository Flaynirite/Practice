// src/components/RegularUserHeader.tsx
import { Link } from "react-router-dom"
import { FaUser, FaSignOutAlt } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"

export default function RegularUserHeader() {
  const { user, logout } = useAuth()
  
  const links = [
    { name: "Головна", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Відстеження", path: "/tracking" }
  ]

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
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700, color: "white" }}>DeliveryCo</h1>
      </Link>
      <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {links.map((link, i) => (
          <Link 
            key={i} 
            to={link.path} 
            style={{
              color:"white",
              fontWeight:600,
              textDecoration:"none",
              padding:"6px 12px",
              borderRadius:"8px",
              transition:"all 0.2s"
            }}
            onMouseOver={e=>{
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background="rgba(255,255,255,0.2)";
              el.style.transform="translateY(-2px)";
            }}
            onMouseOut={e=>{
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background="transparent";
              el.style.transform="translateY(0)";
            }}
          >
            {link.name}
          </Link>
        ))}
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}>
          <span style={{ color: "white", fontWeight: 600 }}>{user?.name}</span>
          <Link to="/profile" style={{ color:"white", fontSize:"1.2rem", padding:"6px", borderRadius:"50%", display:"flex", alignItems:"center", transition:"all 0.2s" }}
            onMouseOver={e=>{
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background="rgba(255,255,255,0.2)";
            }}
            onMouseOut={e=>{
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background="transparent";
            }}
          >
            <FaUser />
          </Link>
          <button onClick={logout} style={{ background: "none", border: "none", color: "white", fontSize:"1.2rem", cursor: "pointer", padding:"6px", borderRadius:"50%", display:"flex", alignItems:"center", transition:"all 0.2s" }}
            onMouseOver={e=>{
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background="rgba(255,255,255,0.2)";
            }}
            onMouseOut={e=>{
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background="transparent";
            }}
            title="Вийти"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </nav>
    </header>
  )
}
