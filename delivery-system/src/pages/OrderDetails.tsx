// src/pages/OrderDetails.tsx
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { OrderService, Order } from "../services/orderService"
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaReceipt,
  FaWeightHanging,
  FaGlobe,
  FaUser,
  FaShippingFast,
  FaExclamationTriangle,
  FaPrint,
  FaDownload
} from "react-icons/fa"
import OrderProgressWidget from "../components/OrderProgressWidget"

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const orderData = OrderService.getOrderDetails(id)
      setOrder(orderData)
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '100px 20px', background: 'white', borderRadius: '20px', boxShadow: '0 8px 25px rgba(0,0,0,0.05)' }}>
          <FaExclamationTriangle size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
          <h2>Замовлення не знайдено</h2>
          <p style={{ color: '#64748b', marginBottom: '25px' }}>Замовлення з ID #{id?.slice(-8)} не існує або у вас немає доступу до нього.</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
            Повернутися до дашборду
          </button>
        </div>
      </Layout>
    )
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Створено": return "#f59e0b"
      case "В обробці": return "#3b82f6"
      case "Доставлено": return "#10b981"
      case "Скасовано": return "#ef4444"
      default: return "#6b7280"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Хлібні крихти та дії */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "#4f46e5", fontWeight: 600, cursor: "pointer", fontSize: "1rem" }}
          >
            <FaArrowLeft /> Назад до списку
          </button>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#475569", fontWeight: 600, cursor: "pointer" }}>
              <FaPrint /> Друкувати
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#4f46e5", border: "none", borderRadius: "10px", color: "white", fontWeight: 600, cursor: "pointer" }}>
              <FaDownload /> Завантажити інвойс
            </button>
          </div>
        </div>

        {/* Основна інформація */}
        <div style={{ background: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "1px" }}>Замовлення</div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>#{order.id.slice(-12).toUpperCase()}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "10px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.95rem" }}>
                  <FaCalendarAlt /> {formatDate(order.createdAt)}
                </span>
                <span style={{ height: "4px", width: "4px", background: "#cbd5e1", borderRadius: "50%" }} />
                <span style={{ 
                  padding: "6px 16px", 
                  borderRadius: "20px", 
                  background: getStatusColor(order.status) + "15", 
                  color: getStatusColor(order.status), 
                  fontWeight: 700, 
                  fontSize: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  {order.status === "Створено" && <FaBox />}
                  {order.status === "В обробці" && <FaTruck />}
                  {order.status === "Доставлено" && <FaCheckCircle />}
                  {order.status === "Скасовано" && <FaExclamationTriangle />}
                  {order.status}
                </span>
              </div>
            </div>
            
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "5px" }}>Загальна сума</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#4f46e5" }}>${order.totalPrice?.toFixed(2)}</div>
            </div>
          </div>

          <OrderProgressWidget order={order} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "30px" }}>
          <div>
            {/* Товари */}
            <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FaBox color="#4f46e5" /> Товари в замовленні
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {order.items.map((item, index) => (
                  <div key={index} style={{ display: "flex", gap: "20px", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                    <div style={{ width: "80px", height: "80px", background: "#eef2ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyCenter: "center", color: "#4f46e5" }}>
                      <FaBox size={32} style={{margin:"auto"}} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "1.1rem", color: "#1e293b" }}>{item.title}</h4>
                      <div style={{ display: "flex", gap: "20px", fontSize: "0.9rem", color: "#64748b" }}>
                        <span>Кількість: <strong>{item.quantity}</strong></span>
                        <span>Ціна за од.: <strong>${item.price.toFixed(2)}</strong></span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontWeight: 700, color: "#1e293b", fontSize: "1.1rem" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Деталі доставки */}
            <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FaTruck color="#4f46e5" /> Інформація про доставку
              </h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaUser size={12} /> Отримувач
                  </div>
                  <div style={{ fontWeight: 600, color: "#1e293b" }}>{order.userName}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaGlobe size={12} /> Країна призначення
                  </div>
                  <div style={{ fontWeight: 600, color: "#1e293b" }}>{order.deliveryCountry}</div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <FaMapMarkerAlt size={12} /> Адреса доставки
                  </div>
                  <div style={{ fontWeight: 600, color: "#1e293b" }}>м. Київ, вул. Доставкова, 123 (Пункт видачі DeliveryCo)</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Підсумок */}
            <div style={{ background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: "30px" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "25px" }}>Підсумок оплати</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                  <span>Вартість товарів</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>
                    ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                  <span>Доставка</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>${(order.shippingCost || 15.00).toFixed(2)}</span>
                </div>
                {order.customsDetails && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                      <span>Митні платежі</span>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>${order.customsDetails.totalDuties.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div style={{ height: "1px", background: "#f1f5f9", margin: "10px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 800, color: "#4f46e5" }}>
                  <span>Разом</span>
                  <span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginTop: "30px", padding: "15px", background: "#f0f9ff", borderRadius: "12px", border: "1px solid #bae6fd", display: "flex", gap: "12px" }}>
                <FaReceipt color="#0ea5e9" size={20} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "0.85rem", color: "#0369a1", margin: 0, lineHeight: 1.5 }}>
                  Оплачено банківською картою **** 4242. <br />
                  Дата транзакції: {formatDate(order.createdAt)}
                </p>
              </div>
            </div>

            {/* Потрібна допомога */}
            <div style={{ background: "linear-gradient(135deg, #4f46e5, #8b5cf6)", borderRadius: "20px", padding: "30px", color: "white" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FaClock /> Потрібна допомога?
              </h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.9, lineHeight: 1.6, marginBottom: "20px" }}>
                Якщо у вас виникли питання щодо цього замовлення, наша служба підтримки готова допомогти 24/7.
              </p>
              <button style={{ width: "100%", padding: "12px", background: "white", border: "none", borderRadius: "10px", color: "#4f46e5", fontWeight: 700, cursor: "pointer" }}>
                Зв'язатися з підтримкою
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
