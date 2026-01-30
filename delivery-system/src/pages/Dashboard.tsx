// src/pages/Dashboard.tsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { OrderService } from "../services/orderService"
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartLine,
  FaExclamationTriangle
} from "react-icons/fa"
import OrderProgressWidget from "../components/OrderProgressWidget"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [filteredOrders, setFilteredOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stats, setStats] = useState({
    total: 0,
    created: 0,
    processing: 0,
    delivered: 0,
    cancelled: 0
  })

  useEffect(() => {
    loadOrders()
  }, [user])

  const loadOrders = () => {
    if (!user) return

    setLoading(true)
    try {
      const userOrders = OrderService.getUserOrders(user.id)

      // Сортуємо за датою (новіші перші)
      const sortedOrders = [...userOrders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )

      setOrders(sortedOrders)
      setFilteredOrders(sortedOrders)
      calculateStats(sortedOrders)
    } catch (error) {
      console.error('Помилка завантаження замовлень:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersList: any[]) => {
    const stats = {
      total: ordersList.length,
      created: ordersList.filter(o => o.status === 'Створено').length,
      processing: ordersList.filter(o => o.status === 'В обробці').length,
      delivered: ordersList.filter(o => o.status === 'Доставлено').length,
      cancelled: ordersList.filter(o => o.status === 'Скасовано').length
    }
    setStats(stats)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    
    let filtered = [...orders]
    
    if (term) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryCountry.toLowerCase().includes(term.toLowerCase()) ||
        order.items.some((item: any) => 
          item.title.toLowerCase().includes(term.toLowerCase())
        )
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    setFilteredOrders(filtered)
  }

  const handleFilterChange = (status: string) => {
    setStatusFilter(status)
    
    let filtered = [...orders]
    
    if (status !== "all") {
      filtered = filtered.filter(order => order.status === status)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryCountry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item: any) => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Створено": return "linear-gradient(135deg, #f59e0b, #fbbf24)"
      case "В обробці": return "linear-gradient(135deg, #3b82f6, #60a5fa)"
      case "Доставлено": return "linear-gradient(135deg, #10b981, #34d399)"
      case "Скасовано": return "linear-gradient(135deg, #ef4444, #f87171)"
      default: return "#ddd"
    }
  }

  const getTotalPrice = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  if (loading) {
    return (
      <Layout showSidebar={false}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </Layout>
    )
  }

  return (
    <Layout showSidebar={false}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        width: '100%'
      }}>
        {/* Заголовок та статистика */}
        <div style={{
          marginBottom: "40px",
          background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
          borderRadius: "20px",
          padding: "40px",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)"
          }} />
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            position: "relative",
            zIndex: 1
          }}>
            <div>
              <h1 style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                marginBottom: "10px"
              }}>
                Мої замовлення
              </h1>
              <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
                Управляйте та відстежуйте всі ваші відправлення
              </p>
            </div>
            
            <div style={{
              background: "rgba(255,255,255,0.15)",
              padding: "20px 30px",
              borderRadius: "16px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                <FaBox />
                <span style={{ fontWeight: 600 }}>Всього замовлень</span>
              </div>
              <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>{stats.total}</div>
            </div>
          </div>

          {/* Статистика */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "20px",
            position: "relative",
            zIndex: 1
          }}>
            {[
              { label: "Створено", value: stats.created, icon: <FaBox />, color: "#f59e0b" },
              { label: "В обробці", value: stats.processing, icon: <FaClock />, color: "#3b82f6" },
              { label: "Доставлено", value: stats.delivered, icon: <FaCheckCircle />, color: "#10b981" },
              { label: "Скасовано", value: stats.cancelled, icon: <FaExclamationTriangle />, color: "#ef4444" }
            ].map((stat, index) => (
              <div key={index} style={{
                background: "rgba(255,255,255,0.1)",
                padding: "20px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  marginBottom: "10px"
                }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color
                  }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{stat.label}</div>
                </div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Пошук та фільтри */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
          border: "1px solid #f1f5f9"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto auto",
            gap: "20px",
            alignItems: "center"
          }}>
            <div style={{ position: "relative" }}>
              <FaSearch style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8"
              }} />
              <input
                type="text"
                placeholder="Пошук за ID, країні або товару..."
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  padding: "14px 14px 14px 45px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b",
                  fontSize: "1rem",
                  width: "100%",
                  boxSizing: "border-box",
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

            <div style={{
              display: "flex",
              gap: "10px",
              alignItems: "center"
            }}>
              <FaFilter style={{ color: "#64748b" }} />
              <select
                value={statusFilter}
                onChange={e => handleFilterChange(e.target.value)}
                style={{
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  color: "#1e293b",
                  fontSize: "1rem",
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

            <button
              onClick={() => navigate('/create')}
              style={{
                padding: "14px 28px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.3s",
                fontSize: "1rem"
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(79, 70, 229, 0.3)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <FaPlus /> Створити замовлення
            </button>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid #f1f5f9"
          }}>
            <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Знайдено {filteredOrders.length} замовлень
            </div>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#f8fafc",
                color: "#475569",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.2s"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#f1f5f9";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#f8fafc";
              }}
            >
              <FaDownload /> Експорт
            </button>
          </div>
        </div>

        {/* Віджет прогресів для останнього замовлення */}
        {orders.length > 0 && (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            border: "1px solid #f1f5f9"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px"
            }}>
              <h3 style={{
                fontSize: "1.3rem",
                color: "#1e293b",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaChartLine /> Прогрес останнього замовлення
              </h3>
              <div style={{
                padding: "8px 16px",
                background: "#f0ebff",
                color: "#4f46e5",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: 600
              }}>
                #{orders[0].id.slice(-8)}
              </div>
            </div>
            
            <OrderProgressWidget order={orders[0]} />
          </div>
        )}

        {/* Список замовлень */}
        <div>
          <h2 style={{
            fontSize: "1.5rem",
            color: "#1e293b",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <FaTruck /> Список замовлень
          </h2>

          {filteredOrders.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 40px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                background: "#f8fafc",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: "#94a3b8"
              }}>
                <FaBox size={32} />
              </div>
              <h3 style={{ marginBottom: "10px", color: "#475569" }}>Замовлень не знайдено</h3>
              <p style={{ color: "#94a3b8", marginBottom: "25px" }}>
                {orders.length === 0 
                  ? "У вас ще немає замовлень. Створіть перше замовлення!"
                  : "Спробуйте змінити параметри пошуку"}
              </p>
              {orders.length === 0 && (
                <button
                  onClick={() => navigate('/create')}
                  style={{
                    padding: "14px 28px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                    color: "white",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "0 auto"
                  }}
                >
                  <FaPlus /> Створити перше замовлення
                </button>
              )}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "25px"
            }}>
              {filteredOrders.map(order => (
                <div 
                  key={order.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "25px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                    border: "1px solid #f1f5f9",
                    transition: "all 0.3s",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
                  }}
                >
                  {/* Акцентна смужка */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "5px",
                    background: getStatusColor(order.status)
                  }} />

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px"
                  }}>
                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: "5px"
                      }}>
                        ID замовлення
                      </div>
                      <div style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        color: "#1e293b",
                        fontFamily: "'Courier New', monospace"
                      }}>
                        #{order.id.slice(-8)}
                      </div>
                    </div>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      {getStatusIcon(order.status)}
                      <div style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: order.status === "Створено" ? "#fef3c7" :
                                    order.status === "В обробці" ? "#dbeafe" :
                                    order.status === "Доставлено" ? "#d1fae5" : "#f3f4f6",
                        color: order.status === "Створено" ? "#92400e" :
                               order.status === "В обробці" ? "#1e40af" :
                               order.status === "Доставлено" ? "#065f46" : "#6b7280",
                        fontSize: "0.8rem",
                        fontWeight: "600"
                      }}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "15px",
                    marginBottom: "20px"
                  }}>
                    <div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "5px",
                        fontSize: "0.85rem",
                        color: "#64748b"
                      }}>
                        <FaMapMarkerAlt /> Країна
                      </div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>
                        {order.deliveryCountry}
                      </div>
                    </div>

                    <div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "5px",
                        fontSize: "0.85rem",
                        color: "#64748b"
                      }}>
                        <FaCalendarAlt /> Дата
                      </div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>
                        {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <div style={{
                      fontSize: "0.85rem",
                      color: "#64748b",
                      marginBottom: "8px"
                    }}>
                      Товари ({order.items.length})
                    </div>
                    <div style={{
                      maxHeight: "60px",
                      overflowY: "auto",
                      paddingRight: "5px"
                    }}>
                      {order.items.map((item: any, index: number) => (
                        <div 
                          key={index}
                          style={{
                            padding: "6px 10px",
                            background: "#f8fafc",
                            borderRadius: "8px",
                            marginBottom: "6px",
                            fontSize: "0.85rem",
                            display: "flex",
                            justifyContent: "space-between"
                          }}
                        >
                          <span style={{ color: "#475569" }}>{item.title}</span>
                          <span style={{ fontWeight: "600", color: "#1e293b" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "15px",
                    borderTop: "1px solid #f1f5f9"
                  }}>
                    <div>
                      <div style={{
                        fontSize: "0.85rem",
                        color: "#64748b",
                        marginBottom: "3px"
                      }}>
                        Загальна вартість
                      </div>
                      <div style={{
                        fontSize: "1.3rem",
                        fontWeight: "bold",
                        color: "#4f46e5"
                      }}>
                        ${getTotalPrice(order.items).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        navigate(`/orders/${order.id}`)
                      }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "10px",
                        background: "#f8fafc",
                        color: "#475569",
                        border: "1px solid #e2e8f0",
                        fontWeight: "600",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.background = "#4f46e5";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "#4f46e5";
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.background = "#f8fafc";
                        e.currentTarget.style.color = "#475569";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      Детальніше
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}