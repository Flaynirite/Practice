// src/pages/UserHome.tsx
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  FaPlus, FaBox, FaUser, FaTruck, FaClock, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaHistory, 
  FaShieldAlt, FaQuestionCircle, 
  FaArrowRight, FaStar, FaCheckCircle, FaShippingFast, FaGlobe,
  FaFileInvoiceDollar, FaHeadset, FaCalendarAlt, FaTag
} from "react-icons/fa"
import UserHeader from "../components/UserHeader"
import { useAuth } from "../contexts/AuthContext"
import { OrderService } from "../services/orderService"

export default function UserHome() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
    averageDeliveryTime: 0
  })
  

  useEffect(() => {
    loadUserData()
  }, [user])

  const loadUserData = () => {
    if (!user) return

    const userOrders = OrderService.getUserOrders(user.id)
    
    // Сортуємо за датою (новіші перші)
    const sortedOrders = [...userOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 4)

    setRecentOrders(sortedOrders)

    // Розраховуємо статистику
    const totalOrders = userOrders.length
    const activeOrders = userOrders.filter((o: any) => 
      o.status !== 'Доставлено' && o.status !== 'Скасовано'
    ).length
    const deliveredOrders = userOrders.filter((o: any) => o.status === 'Доставлено').length
    
    // Розраховуємо загальну вартість
    const totalSpent = userOrders.reduce((sum: number, order: any) => {
      return sum + (order.totalPrice || 0)
    }, 0)

    setStats({
      totalOrders,
      activeOrders,
      deliveredOrders,
      totalSpent,
      averageDeliveryTime: 3.5 // Днів (імітовані дані)
    })

  }

  // Швидкі дії
  const quickActions = [
    {
      id: 1,
      title: "Створити замовлення",
      description: "Оформити нову доставку",
      icon: <FaPlus size={24} />,
      color: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
      link: "/create"
    },
    {
      id: 2,
      title: "Мої замовлення",
      description: "Переглянути всі замовлення",
      icon: <FaBox size={24} />,
      color: "linear-gradient(135deg, #10b981, #34d399)",
      link: "/dashboard"
    },
    {
      id: 3,
      title: "Профіль",
      description: "Налаштування акаунта",
      icon: <FaUser size={24} />,
      color: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      link: "/profile"
    },
    {
      id: 4,
      title: "Історія",
      description: "Журнал дій",
      icon: <FaHistory size={24} />,
      color: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      link: "/profile?tab=history"
    }
  ]

  // Статуси замовлень для візуалізації
  const orderStatuses = [
    { status: "Створено", color: "#f59e0b", count: stats.activeOrders },
    { status: "В обробці", color: "#3b82f6", count: Math.floor(stats.activeOrders * 0.6) },
    { status: "Доставлено", color: "#10b981", count: stats.deliveredOrders },
    { status: "Скасовано", color: "#ef4444", count: 0 }
  ]

  // Переваги сервісу
  const features = [
    {
      icon: <FaShippingFast size={40} />,
      title: "Швидка доставка",
      description: "Експрес-доставка по всьому світу за 3-7 днів",
      gradient: "linear-gradient(135deg, #4f46e5, #8b5cf6)"
    },
    {
      icon: <FaGlobe size={40} />,
      title: "Міжнародна доставка",
      description: "Доставляємо в понад 150 країн світу",
      gradient: "linear-gradient(135deg, #10b981, #34d399)"
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Гарантія безпеки",
      description: "Страхування вантажу та гарантія збереження",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)"
    },
    {
      icon: <FaFileInvoiceDollar size={40} />,
      title: "Прозорі ціни",
      description: "Фіксовані тарифи без прихованих платежів",
      gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)"
    }
  ]

  // Останні активності
  const recentActivities = [
    { id: 1, action: "Ви успішно увійшли", time: "сьогодні о 10:30", icon: <FaCheckCircle /> },
    { id: 2, action: "Створено замовлення #ORD-78945", time: "вчора о 14:20", icon: <FaBox /> },
    { id: 3, action: "Доставлено замовлення #ORD-78942", time: "2 дні тому", icon: <FaTruck /> }
  ]

  return (
    <div style={{ 
      fontFamily: "Inter, sans-serif", 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)"
    }}>
      <UserHeader />
      
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "30px 20px 60px" }}>
        {/* Вітальний заголовок */}
        <div style={{ 
          marginBottom: "40px",
          background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
          borderRadius: "20px",
          padding: "40px",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "rgba(79, 70, 229, 0.05)",
            borderRadius: "50%",
            filter: "blur(40px)"
          }}/>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                <div style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "5px" }}>
                    Вітаємо, {user?.name}!
                  </h1>
                  <p style={{ fontSize: "1.1rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCalendarAlt /> {new Date().toLocaleDateString('uk-UA', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <p style={{ fontSize: "1.2rem", color: "#475569", maxWidth: "600px", lineHeight: "1.6" }}>
                Раді вас бачити у системі DeliveryCo. Ось огляд вашої активності та доступні можливості.
              </p>
            </div>
            
            <div style={{
              background: "white",
              padding: "20px 30px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              minWidth: "200px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <FaStar style={{ color: "#f59e0b" }} />
                <span style={{ fontWeight: "600", color: "#1e293b" }}>Рейтинг користувача</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#4f46e5" }}>4.8/5</div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "5px" }}>Надійний клієнт</p>
            </div>
          </div>
        </div>

        {/* Швидкі дії */}
        <section style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#1e293b" }}>
              Швидкий доступ
            </h2>
            <Link to="/dashboard" style={{ 
              color: "#4f46e5", 
              fontWeight: "600", 
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              Всі функції <FaArrowRight />
            </Link>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
            gap: "20px" 
          }}>
            {quickActions.map((action) => (
              <Link 
                key={action.id} 
                to={action.link} 
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: action.color,
                  color: "white",
                  padding: "25px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.25)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                }}>
                  <div style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "80px",
                    height: "80px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    filter: "blur(20px)"
                  }}/>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "15px",
                    marginBottom: "15px"
                  }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>{action.title}</h3>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem" }}>{action.description}</p>
                    </div>
                  </div>
                  
                  <div style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    opacity: 0.7
                  }}>
                    <FaArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Статистика та останні замовлення */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "30px", marginBottom: "40px" }}>
          {/* Статистика */}
          <div>
            <h2 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "25px" }}>
              Статистика
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "20px" 
            }}>
              {/* Статистичні картки */}
              <div style={{ 
                background: "white", 
                padding: "25px", 
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                borderLeft: "4px solid #4f46e5"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(79, 70, 229, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#4f46e5"
                  }}>
                    <FaBox />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Всього замовлень</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b" }}>{stats.totalOrders}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: "25px", 
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                borderLeft: "4px solid #10b981"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#10b981"
                  }}>
                    <FaCheckCircle />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Доставлено</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b" }}>{stats.deliveredOrders}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: "25px", 
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                borderLeft: "4px solid #f59e0b"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(245, 158, 11, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b"
                  }}>
                    <FaClock />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Активних</div>
                    <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b" }}>{stats.activeOrders}</div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                background: "white", 
                padding: "25px", 
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                borderLeft: "4px solid #8b5cf6"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(139, 92, 246, 0.1)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8b5cf6"
                  }}>
                    <FaTag />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Загальна вартість</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#1e293b" }}>
                      ${stats.totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Статуси замовлень (діаграма) */}
            <div style={{ 
              background: "white", 
              borderRadius: "16px",
              padding: "25px",
              marginTop: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: "1.2rem", color: "#1e293b", marginBottom: "20px" }}>
                Статуси замовлень
              </h3>
              
              <div style={{ display: "flex", alignItems: "center", height: "8px", marginBottom: "20px" }}>
                {orderStatuses.map((status, index) => (
                  <div 
                    key={index}
                    style={{
                      flex: status.count || 1,
                      height: "100%",
                      background: status.color,
                      marginRight: "2px",
                      borderRadius: "4px"
                    }}
                  />
                ))}
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                {orderStatuses.map((status, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "12px",
                      height: "12px",
                      background: status.color,
                      borderRadius: "50%"
                    }}/>
                    <span style={{ color: "#64748b" }}>{status.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Останні замовлення */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
              <h2 style={{ fontSize: "1.8rem", color: "#1e293b" }}>
                Останні замовлення
              </h2>
              <Link to="/dashboard" style={{ 
                color: "#4f46e5", 
                fontWeight: "600", 
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                Всі замовлення <FaArrowRight />
              </Link>
            </div>
            
            <div style={{ 
              background: "white", 
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
            }}>
              {recentOrders.length > 0 ? (
                <>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr 1fr auto", 
                    padding: "20px 25px",
                    background: "#f8fafc",
                    borderBottom: "1px solid #e2e8f0",
                    fontWeight: "600",
                    color: "#475569"
                  }}>
                    <div>ID замовлення</div>
                    <div>Статус</div>
                    <div>Країна</div>
                    <div>Детальніше</div>
                  </div>
                  
                  {recentOrders.map((order: any) => (
                    <div 
                      key={order.id}
                      style={{ 
                        padding: "20px 25px",
                        borderBottom: "1px solid #f1f5f9",
                        transition: "all 0.2s",
                        cursor: "pointer"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "white";
                      }}
                    >
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "1fr 1fr 1fr auto",
                        alignItems: "center"
                      }}>
                        <div>
                          <div style={{ fontWeight: "600", color: "#1e293b" }}>#{order.id.slice(-8)}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                            {new Date(order.createdAt).toLocaleDateString('uk-UA')}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: 
                              order.status === "Створено" ? "#fef3c7" :
                              order.status === "В обробці" ? "#dbeafe" :
                              order.status === "Доставлено" ? "#d1fae5" : "#f3f4f6",
                            color: 
                              order.status === "Створено" ? "#92400e" :
                              order.status === "В обробці" ? "#1e40af" :
                              order.status === "Доставлено" ? "#065f46" : "#6b7280",
                            fontWeight: "600",
                            fontSize: "0.85rem"
                          }}>
                            {order.status}
                          </div>
                        </div>
                        
                        <div style={{ color: "#475569" }}>{order.deliveryCountry}</div>
                        
                        <div>
                          <Link 
                            to={`/orders/${order.id}`} 
                            style={{
                              color: "#4f46e5",
                              textDecoration: "none",
                              fontWeight: "600",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px"
                            }}
                          >
                            Деталі <FaArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ padding: "60px 40px", textAlign: "center", color: "#64748b" }}>
                  <FaBox size={48} style={{ marginBottom: "20px", opacity: 0.5 }} />
                  <h3 style={{ marginBottom: "10px", color: "#475569" }}>Немає замовлень</h3>
                  <p style={{ marginBottom: "20px" }}>Створіть своє перше замовлення для початку роботи</p>
                  <Link to="/create">
                    <button style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      background: "#4f46e5",
                      color: "white",
                      border: "none",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}>
                      Створити замовлення
                    </button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Останні активності */}
            <div style={{ 
              background: "white", 
              borderRadius: "16px",
              padding: "25px",
              marginTop: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
            }}>
              <h3 style={{ fontSize: "1.2rem", color: "#1e293b", marginBottom: "20px" }}>
                Останні активності
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {recentActivities.map(activity => (
                  <div key={activity.id} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "15px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #f1f5f9"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      background: "#f8fafc",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#4f46e5"
                    }}>
                      {activity.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>{activity.action}</div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Переваги сервісу */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ 
            fontSize: "1.8rem", 
            color: "#1e293b", 
            marginBottom: "30px",
            textAlign: "center"
          }}>
            Чому обирають DeliveryCo?
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "25px" 
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  background: "white",
                  padding: "30px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  height: "4px",
                  background: feature.gradient
                }}/>
                
                <div style={{ 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: "100%"
                }}>
                  <div style={{
                    marginBottom: "20px",
                    color: "#4f46e5"
                  }}>
                    {feature.icon}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: "1.3rem", 
                    color: "#1e293b", 
                    marginBottom: "12px" 
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{ 
                    color: "#64748b", 
                    lineHeight: "1.6",
                    marginBottom: "20px"
                  }}>
                    {feature.description}
                  </p>
                  
                  <Link to="/about" style={{ 
                    marginTop: "auto", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    color: "#4f46e5",
                    fontWeight: "600",
                    textDecoration: "none"
                  }}>
                    <span>Дізнатися більше</span>
                    <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Довідка та підтримка */}
        <section>
          <div style={{ 
            background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
            borderRadius: "20px",
            padding: "50px",
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "300px",
              height: "300px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              filter: "blur(40px)"
            }}/>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "40px",
              position: "relative",
              zIndex: 1
            }}>
              <div>
                <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>
                  Потрібна допомога?
                </h2>
                <p style={{ fontSize: "1.1rem", opacity: 0.9, marginBottom: "30px", lineHeight: "1.6" }}>
                  Наша служба підтримки доступна 24/7 для відповіді на ваші питання щодо доставки, відстеження замовлень чи будь-яких інших питань.
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                  <button style={{
                    padding: "14px 28px",
                    borderRadius: "10px",
                    background: "white",
                    color: "#4f46e5",
                    border: "none",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  >
                    <FaHeadset /> Зв'язатися з підтримкою
                  </button>
                  
                  <button 
                    onClick={() => navigate('/faq')}
                    style={{
                      padding: "14px 28px",
                      borderRadius: "10px",
                      background: "transparent",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.3)",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <FaQuestionCircle /> FAQ
                  </button>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Контактна інформація</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FaPhone />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Телефон</div>
                      <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>+38 (099) 123-45-67</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FaEnvelope />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Email</div>
                      <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>support@deliveryco.com</div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <div style={{
                      width: "48px",
                      height: "48px",
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Адреса</div>
                      <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>м. Київ, вул. Доставкова, 123</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: "40px 20px",
        textAlign: "center",
        background: "#1e1e2f",
        color: "white",
        marginTop: "60px"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>© 2026 DeliveryCo. Всі права захищені.</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "20px" }}>
            Міжнародна служба доставки посилок по всьому світу
          </p>
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "30px",
            fontSize: "0.9rem",
            opacity: 0.7
          }}>
            <Link to="/privacy" style={{ color: "white", textDecoration: "none" }}>Політика конфіденційності</Link>
            <Link to="/terms" style={{ color: "white", textDecoration: "none" }}>Умови використання</Link>
            <Link to="/careers" style={{ color: "white", textDecoration: "none" }}>Кар'єра</Link>
            <Link to="/blog" style={{ color: "white", textDecoration: "none" }}>Блог</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
