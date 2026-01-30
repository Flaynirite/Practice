// src/pages/Blog.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import { FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa"

const posts = [
  {
    id: 1,
    title: "Як заощадити на міжнародній доставці у 2026 році",
    excerpt: "Дізнайтеся про нові митні правила та способи оптимізації витрат на доставку товарів з-за кордону.",
    date: "2026-01-20",
    author: "Олександр Митний",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Топ-5 маркетплейсів Європи для вигідних покупок",
    excerpt: "Ми підготували список найкращих інтернет-магазинів Німеччини, Франції та Польщі з прямою доставкою.",
    date: "2026-01-15",
    author: "Марія Шопінг",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
]

export default function Blog() {
  const { user } = useAuth()

  const Content = (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Блог DeliveryCo</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Корисні статті про логістику, мито та закордонний шопінг</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
        {posts.map(post => (
          <div key={post.id} style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            <div style={{ padding: "25px" }}>
              <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", color: "#64748b", marginBottom: "15px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaCalendarAlt size={12} /> {post.date}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><FaUser size={12} /> {post.author}</span>
              </div>
              <h3 style={{ fontSize: "1.25rem", color: "#1e293b", marginBottom: "15px", lineHeight: 1.4 }}>{post.title}</h3>
              <p style={{ color: "#475569", marginBottom: "20px", fontSize: "0.95rem" }}>{post.excerpt}</p>
              <button style={{ background: "none", border: "none", color: "#4f46e5", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
                Читати далі <FaArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return user ? <Layout>{Content}</Layout> : (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GuestHeader />
      {Content}
    </div>
  )
}
