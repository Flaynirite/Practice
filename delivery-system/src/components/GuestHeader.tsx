// src/components/GuestHeader.tsx
import { Link } from "react-router-dom"

export default function GuestHeader() {
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
      <nav style={{ display: "flex", gap: "25px", alignItems: "center" }}>
        <Link 
          to="/tracking" 
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
          Відстеження
        </Link>
        <Link 
          to="/login" 
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
          Увійти
        </Link>
        <Link 
          to="/create-account"
          style={{
            color:"#4f46e5",  // ВИПРАВЛЕНО: лише один color
            fontWeight:600,
            textDecoration:"none",
            padding:"8px 18px",
            borderRadius:"8px",
            background:"white",
            transition:"all 0.2s"
          }}
          onMouseOver={e=>{
            const link = e.currentTarget as HTMLAnchorElement;
            link.style.background="#f0f0f0";
            link.style.transform="translateY(-2px)";
          }}
          onMouseOut={e=>{
            const link = e.currentTarget as HTMLAnchorElement;
            link.style.background="white";
            link.style.transform="translateY(0)";
          }}
        >
          Реєстрація
        </Link>
      </nav>
    </header>
  )
}