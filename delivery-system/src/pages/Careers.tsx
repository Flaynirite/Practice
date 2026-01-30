// src/pages/Careers.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"
import { FaBriefcase, FaMapMarkerAlt, FaClock } from "react-icons/fa"

const jobs = [
  {
    id: 1,
    title: "Менеджер з логістики",
    location: "Київ, Україна / Віддалено",
    type: "Повна зайнятість",
    description: "Управління ланцюжками поставок та координація міжнародних перевезень."
  },
  {
    id: 2,
    title: "Frontend Розробник (React)",
    location: "Віддалено",
    type: "Повна зайнятість",
    description: "Розвиток та підтримка клієнтського інтерфейсу нашої платформи."
  }
]

export default function Careers() {
  const { user } = useAuth()

  const Content = (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Кар'єра в DeliveryCo</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Приєднуйтесь до нашої команди та змінюйте світ логістики разом з нами</p>
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: "50px" }}>
        <h2 style={{ marginBottom: "30px" }}>Відкриті вакансії</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {jobs.map(job => (
            <div key={job.id} style={{ padding: "25px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "10px" }}>{job.title}</h3>
              <div style={{ display: "flex", gap: "20px", marginBottom: "15px", color: "#64748b", fontSize: "0.9rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaMapMarkerAlt /> {job.location}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><FaBriefcase /> {job.type}</span>
              </div>
              <p style={{ color: "#475569", marginBottom: "20px" }}>{job.description}</p>
              <button style={{ padding: "10px 20px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Відгукнутися</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return user ? <Layout>{Content}<Footer /></Layout> : (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GuestHeader />
      {Content}
      <Footer />
    </div>
  )
}
