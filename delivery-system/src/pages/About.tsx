// src/pages/About.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import { FaUsers, FaGlobe, FaAward, FaHistory } from "react-icons/fa"

export default function About() {
  const { user } = useAuth()

  const Content = (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "3rem", color: "#1e293b", marginBottom: "20px" }}>Про DeliveryCo</h1>
        <p style={{ color: "#64748b", fontSize: "1.2rem", maxWidth: "700px", margin: "0 auto", lineHeight: 1.6 }}>
          Ми створюємо майбутнє міжнародної логістики, роблячи доставку простою та доступною для кожного.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "60px" }}>
        <div style={{ padding: "30px", background: "white", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", background: "#eef2ff", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#4f46e5" }}>
            <FaHistory size={28} />
          </div>
          <h3 style={{ marginBottom: "15px" }}>Наша історія</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Заснована у 2018 році, DeliveryCo пройшла шлях від невеликого стартапу до провідного логістичного оператора.</p>
        </div>
        <div style={{ padding: "30px", background: "white", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", background: "#f0fdf4", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#10b981" }}>
            <FaGlobe size={28} />
          </div>
          <h3 style={{ marginBottom: "15px" }}>Глобальне охоплення</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Ми працюємо у понад 150 країнах світу, з'єднуючи людей та бізнеси незалежно від відстаней.</p>
        </div>
        <div style={{ padding: "30px", background: "white", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
          <div style={{ width: "60px", height: "60px", background: "#fffbeb", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#f59e0b" }}>
            <FaAward size={28} />
          </div>
          <h3 style={{ marginBottom: "15px" }}>Якість та довіра</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Понад 100,000 задоволених клієнтів довіряють нам свої найцінніші відправлення щороку.</p>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "20px", padding: "50px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", display: "flex", gap: "50px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ marginBottom: "20px", color: "#1e293b" }}>Наша місія</h2>
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "1.1rem", marginBottom: "20px" }}>
            Місія DeliveryCo полягає в усуненні бар'єрів для міжнародної торгівлі та особистих відправлень. Ми віримо, що логістика повинна бути прозорою, технологічною та екологічною.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#4f46e5" }}>10M+</div>
              <div style={{ color: "#64748b" }}>Посилок доставлено</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#4f46e5" }}>500+</div>
              <div style={{ color: "#64748b" }}>Працівників</div>
            </div>
            <div>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#4f46e5" }}>150+</div>
              <div style={{ color: "#64748b" }}>Країн</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team" style={{ width: "100%", borderRadius: "16px" }} />
        </div>
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
