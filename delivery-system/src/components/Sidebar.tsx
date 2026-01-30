import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const menu = ["Dashboard"]
  if (user?.isAdmin) {
    menu.push("Admin")
  }

  return (
    <aside style={{
      width:"220px",
      background:"#ffffff",
      padding:"24px",
      boxShadow:"2px 0 10px rgba(0,0,0,0.05)",
      height:"calc(100vh - 60px)"
    }}>
      <ul style={{listStyle:"none", padding:0}}>
        {menu.map(item => {
          const active = location.pathname.includes(item.toLowerCase())
          return (
            <li key={item} style={{
              marginBottom:"18px",
              padding:"8px 12px",
              borderRadius:"8px",
              background: active ? "#f0ebff" : "transparent",
              transition:"background 0.2s ease"
            }}>
              <Link to={"/"+item.toLowerCase()} style={{color:"#4f46e5", fontWeight:600}}>
                {item}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
