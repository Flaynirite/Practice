// src/pages/Tracking.tsx
import { useState } from "react"
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"
import { 
  FaSearch, 
  FaMapMarkerAlt, FaExclamationTriangle 
} from "react-icons/fa"

export default function Tracking() {
  const { user } = useAuth()
  const [trackingId, setTrackingId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId) return

    setLoading(true)
    // Симуляція пошуку
    setTimeout(() => {
      if (trackingId.length > 5) {
        setResult({
          id: trackingId,
          status: "В дорозі",
          location: "Сортувальний центр, Польща",
          lastUpdate: new Date().toLocaleString(),
          history: [
            { time: "2026-01-25 10:00", status: "Відправлено з магазину", location: "Берлін, Німеччина" },
            { time: "2026-01-26 14:30", status: "Прибуло на склад DeliveryCo", location: "Берлін, Німеччина" },
            { time: "2026-01-27 09:15", status: "Виїхало в напрямку країни призначення", location: "Берлін, Німеччина" },
            { time: "2026-01-28 11:00", status: "Прибуло до сортувального центру", location: "Польща" }
          ]
        })
      } else {
        setResult("not_found")
      }
      setLoading(false)
    }, 1000)
  }

  const Content = (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Відстеження посилки</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Дізнайтеся, де знаходиться ваше замовлення в реальному часі</p>
      </div>

      <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
        <form onSubmit={handleTrack} style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Введіть номер відстеження (напр. ORD-12345)" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              style={{ width: "100%", padding: "15px 15px 15px 45px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem", outline: "none" }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: "0 30px", background: "#4f46e5", color: "white", border: "none", borderRadius: "12px", fontWeight: 600, cursor: "pointer" }}
          >
            {loading ? "Пошук..." : "Відстежити"}
          </button>
        </form>

        {result === "not_found" && (
          <div style={{ padding: "20px", background: "#fef2f2", borderRadius: "12px", color: "#dc2626", textAlign: "center" }}>
            <FaExclamationTriangle size={24} style={{ marginBottom: "10px" }} />
            <p>Замовлення з таким номером не знайдено. Перевірте правильність вводу.</p>
          </div>
        )}

        {result && result !== "not_found" && (
          <div>
            <div style={{ padding: "20px", background: "#f0f9ff", borderRadius: "12px", border: "1px solid #bae6fd", marginBottom: "30px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span style={{ color: "#0369a1", fontWeight: 600 }}>Статус: {result.status}</span>
                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Останнє оновлення: {result.lastUpdate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#1e293b" }}>
                <FaMapMarkerAlt color="#ef4444" />
                <strong>Поточне місцезнаходження: {result.location}</strong>
              </div>
            </div>

            <h3 style={{ marginBottom: "20px" }}>Історія переміщення</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {result.history.map((item: any, index: number) => (
                <div key={index} style={{ display: "flex", gap: "20px", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "24px", height: "24px", background: index === 0 ? "#4f46e5" : "#e2e8f0", borderRadius: "50%", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {index === 0 && <div style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%" }} />}
                    </div>
                    {index < result.history.length - 1 && <div style={{ width: "2px", flex: 1, background: "#e2e8f0" }} />}
                  </div>
                  <div style={{ paddingBottom: "30px" }}>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{item.time}</div>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{item.status}</div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>{item.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
