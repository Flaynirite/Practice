// src/pages/Orders.tsx
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { OrderService } from "../services/orderService"
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExclamationTriangle
} from "react-icons/fa"

export default function Orders() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadOrders()
  }, [user])

  const loadOrders = () => {
    if (!user) return
    setLoading(true)
    try {
      const userOrders = OrderService.getUserOrders(user.id)
      const sortedOrders = [...userOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sortedOrders)
      setFilteredOrders(sortedOrders)
    } catch (error) {
      console.error('Помилка завантаження замовлень:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterOrders(term, statusFilter)
  }

  const handleFilterChange = (status: string) => {
    setStatusFilter(status)
    filterOrders(searchTerm, status)
  }

  const filterOrders = (term: string, status: string) => {
    let filtered = [...orders]
    if (term) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryCountry.toLowerCase().includes(term.toLowerCase())
      )
    }
    if (status !== "all") {
      filtered = filtered.filter(order => order.status === status)
    }
    setFilteredOrders(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Створено": return <FaBox style={{ color: "#f59e0b" }} />
      case "В обробці": return <FaClock style={{ color: "#3b82f6" }} />
      case "Доставлено": return <FaCheckCircle style={{ color: "#10b981" }} />
      case "Скасовано": return <FaExclamationTriangle style={{ color: "#ef4444" }} />
      default: return <FaBox />
    }
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "30px" }}>Всі замовлення</h1>

        {/* Пошук та фільтри */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          border: "1px solid #f1f5f9",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
            <FaSearch style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Пошук за ID або країною..."
              value={searchTerm}
              onChange={handleSearch}
              style={{
                padding: "14px 14px 14px 45px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                width: "100%",
                outline: "none"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <FaFilter style={{ color: "#64748b" }} />
            <select
              value={statusFilter}
              onChange={e => handleFilterChange(e.target.value)}
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "white",
                outline: "none",
                cursor: "pointer",
                minWidth: "180px"
              }}
            >
              <option value="all">Всі статуси</option>
              <option value="Створено">Створено</option>
              <option value="В обробці">В обробці</option>
              <option value="Доставлено">Доставлено</option>
              <option value="Скасовано">Скасовано</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 40px", background: "white", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)" }}>
            <FaBox size={48} style={{ color: "#cbd5e1", marginBottom: "20px" }} />
            <h3 style={{ color: "#475569" }}>Замовлень не знайдено</h3>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9",
                transition: "transform 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>ID замовлення</div>
                    <div style={{ fontWeight: "bold", color: "#1e293b" }}>#{order.id.slice(-8)}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "20px", background: "#f8fafc" }}>
                    {getStatusIcon(order.status)}
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{order.status}</span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FaMapMarkerAlt size={12} /> Країна
                    </div>
                    <div style={{ fontWeight: "600" }}>{order.deliveryCountry}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
                      <FaCalendarAlt size={12} /> Дата
                    </div>
                    <div style={{ fontWeight: "600" }}>{new Date(order.createdAt).toLocaleDateString('uk-UA')}</div>
                  </div>
                </div>

                <div style={{ paddingTop: "15px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Сума</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4f46e5" }}>${order.totalPrice?.toFixed(2)}</div>
                  </div>
                  <Link to={`/orders/${order.id}`} style={{ padding: "10px 20px", borderRadius: "10px", background: "#f8fafc", color: "#475569", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem" }}>
                    Детальніше <FaArrowRight size={10} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
