// src/pages/Tracking.tsx
import { useState } from "react"
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaExclamationTriangle,
  FaTruck,
  FaBox,
  FaCheckCircle,
  FaClock
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
    <div style={{ 
      maxWidth: "800px", 
      margin: "40px auto", 
      padding: "0 20px",
      width: "100%"
    }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Відстеження посилки</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Дізнайтеся, де знаходиться ваше замовлення в реальному часі</p>
      </div>

      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "20px", 
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)", 
        border: "1px solid #f1f5f9" 
      }}>
        <form onSubmit={handleTrack} style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              placeholder="Введіть номер відстеження (напр. ORD-12345)" 
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "15px 15px 15px 45px", 
                borderRadius: "12px", 
                border: "1px solid #e2e8f0", 
                fontSize: "1rem", 
                outline: "none",
                transition: "all 0.3s"
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = "#4f46e5";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: "0 30px", 
              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)", 
              color: "white", 
              border: "none", 
              borderRadius: "12px", 
              fontWeight: 600, 
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseOver={e => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(79, 70, 229, 0.3)";
              }
            }}
            onMouseOut={e => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {loading ? "Пошук..." : "Відстежити"}
          </button>
        </form>

        {result === "not_found" && (
          <div style={{ 
            padding: "30px", 
            background: "#fef2f2", 
            borderRadius: "12px", 
            color: "#dc2626", 
            textAlign: "center",
            border: "1px solid #fecaca"
          }}>
            <FaExclamationTriangle size={32} style={{ marginBottom: "15px" }} />
            <h3 style={{ marginBottom: "10px" }}>Замовлення не знайдено</h3>
            <p>Замовлення з таким номером не знайдено. Перевірте правильність вводу.</p>
          </div>
        )}

        {result && result !== "not_found" && (
          <div>
            <div style={{ 
              padding: "25px", 
              background: "#f0f9ff", 
              borderRadius: "16px", 
              border: "1px solid #bae6fd", 
              marginBottom: "30px",
              boxShadow: "0 4px 15px rgba(14, 165, 233, 0.1)"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "15px",
                flexWrap: "wrap",
                gap: "15px"
              }}>
                <div>
                  <span style={{ 
                    display: "inline-block",
                    padding: "8px 16px", 
                    background: "#3b82f6", 
                    color: "white",
                    borderRadius: "20px", 
                    fontWeight: 600,
                    fontSize: "0.9rem"
                  }}>
                    {result.status}
                  </span>
                </div>
                <span style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Останнє оновлення: {result.lastUpdate}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#1e293b" }}>
                <FaMapMarkerAlt color="#ef4444" size={20} />
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Поточне місцезнаходження</div>
                  <strong style={{ fontSize: "1.1rem" }}>{result.location}</strong>
                </div>
              </div>
            </div>

            <h3 style={{ 
              marginBottom: "20px", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px",
              color: "#1e293b"
            }}>
              <FaTruck /> Історія переміщення
            </h3>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "0",
              position: "relative",
              paddingLeft: "20px"
            }}>
              <div style={{
                position: "absolute",
                left: "29px",
                top: "12px",
                bottom: "12px",
                width: "2px",
                background: "linear-gradient(to bottom, #4f46e5, #3b82f6, #10b981)",
                zIndex: 0
              }} />
              
              {result.history.map((item: any, index: number) => (
                <div key={index} style={{ 
                  display: "flex", 
                  gap: "20px", 
                  position: "relative",
                  marginBottom: index < result.history.length - 1 ? "30px" : "0",
                  zIndex: 1
                }}>
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    minWidth: "40px"
                  }}>
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: index === 0 ? "linear-gradient(135deg, #4f46e5, #8b5cf6)" : 
                                 index === result.history.length - 1 ? "linear-gradient(135deg, #10b981, #34d399)" : "#e2e8f0", 
                      borderRadius: "50%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: "3px solid white",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}>
                      {index === 0 && <FaBox color="white" size={16} />}
                      {index === result.history.length - 1 && <FaCheckCircle color="white" size={16} />}
                      {index !== 0 && index !== result.history.length - 1 && <FaClock color="#64748b" size={16} />}
                    </div>
                  </div>
                  <div style={{ 
                    paddingBottom: index < result.history.length - 1 ? "0" : "10px",
                    background: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    flex: 1,
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ 
                      fontSize: "0.85rem", 
                      color: "#64748b",
                      marginBottom: "5px"
                    }}>
                      {item.time}
                    </div>
                    <div style={{ 
                      fontWeight: 600, 
                      color: "#1e293b",
                      marginBottom: "5px",
                      fontSize: "1.1rem"
                    }}>
                      {item.status}
                    </div>
                    <div style={{ 
                      fontSize: "0.9rem", 
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px"
                    }}>
                      <FaMapMarkerAlt size={12} /> {item.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return user ? (
    <Layout showSidebar={false}>
      {Content}
      <Footer />
    </Layout>
  ) : (
    <div style={{ 
      background: "#f8fafc", 
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    }}>
      <GuestHeader />
      <div style={{ flex: 1 }}>
        {Content}
      </div>
      <Footer />
    </div>
  )
}