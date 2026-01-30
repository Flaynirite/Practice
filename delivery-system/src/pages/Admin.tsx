// src/pages/Admin.tsx
import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import { useAuth } from "../contexts/AuthContext"
import { OrderService } from "../services/orderService"
import { AdminService } from "../services/adminService"
import { 
  FaUsers, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDownload,
  FaChartLine,
  FaUserShield,
  FaUserPlus,
  FaUserMinus,
  FaCog,
  FaGlobe,
  FaCalendar,
  FaDollarSign,
  FaRedo,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa"

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  phone: string;
  address: string;
  avatar: string;
  ordersCount: number;
}

interface OrderData {
  id: string;
  userId: string;
  userName: string;
  deliveryCountry: string;
  items: any[];
  status: string;
  createdAt: string;
  updatedAt?: string;
  totalPrice?: number;
}

export default function Admin() {
  const { user, getAllUsers, updateUserAdminStatus, deleteUser, getStatistics } = useAuth()
  const [activeTab, setActiveTab] = useState<'orders' | 'users' | 'admins' | 'stats'>('orders')
  const [users, setUsers] = useState<UserData[]>([])
  const [orders, setOrders] = useState<OrderData[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [stats, setStats] = useState<any>(null)
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [editOrderId, setEditOrderId] = useState<string | null>(null)
  const [editOrderStatus, setEditOrderStatus] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Завантажуємо всі дані
      const allUsers = await getAllUsers()
      setUsers(allUsers)
      
      const allOrders = OrderService.getAllOrders()
      // Перетворюємо замовлення, щоб гарантувати наявність userName
      const ordersData: OrderData[] = allOrders.map(order => ({
        id: order.id,
        userId: order.userId,
        userName: order.userName || "Невідомий користувач",
        deliveryCountry: order.deliveryCountry,
        items: order.items,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        totalPrice: order.totalPrice
      }))
      setOrders(ordersData)
      setFilteredOrders(ordersData)
      
      const statistics = await getStatistics()
      setStats(statistics)
      
      const admins = AdminService.getAdminsList()
      setAdminEmails(admins)
      
    } catch (error) {
      console.error('Помилка завантаження даних:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    
    let filtered = [...orders]
    
    if (term) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(term.toLowerCase()) ||
        order.userName.toLowerCase().includes(term.toLowerCase()) ||
        order.deliveryCountry.toLowerCase().includes(term.toLowerCase())
      )
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }
    
    if (userFilter !== "all") {
      filtered = filtered.filter(order => order.userId === userFilter)
    }
    
    setFilteredOrders(filtered)
  }

  const handleFilterChange = (filterType: 'status' | 'user', value: string) => {
    if (filterType === 'status') {
      setStatusFilter(value)
    } else {
      setUserFilter(value)
    }
    
    let filtered = [...orders]
    
    if (value !== "all") {
      if (filterType === 'status') {
        filtered = filtered.filter(order => order.status === value)
      } else {
        filtered = filtered.filter(order => order.userId === value)
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.deliveryCountry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredOrders(filtered)
  }

  const handleUpdateOrderStatus = (orderId: string) => {
    if (!editOrderStatus) return
    
    const success = OrderService.updateOrderStatus(orderId, editOrderStatus as any)
    if (success) {
      alert('Статус замовлення оновлено')
      loadData()
      setEditOrderId(null)
      setEditOrderStatus("")
    } else {
      alert('Помилка оновлення статусу')
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Видалити це замовлення? Цю дію не можна скасувати.')) {
      const success = OrderService.deleteOrder(orderId)
      if (success) {
        alert('Замовлення видалено')
        loadData()
      } else {
        alert('Помилка видалення замовлення')
      }
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserAdminStatus(userId, !currentStatus)
      AdminService.syncAdminPermissions()
      loadData()
      alert('Права адміна змінено')
    } catch (error) {
      alert('Помилка: ' + (error as Error).message)
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Видалити користувача "${userName}"? Всі його замовлення також будуть видалені.`)) {
      try {
        // Спочатку видаляємо замовлення користувача
        const userOrders = orders.filter(order => order.userId === userId)
        userOrders.forEach(order => {
          OrderService.deleteOrder(order.id)
        })
        
        await deleteUser(userId)
        alert('Користувача видалено')
        loadData()
      } catch (error) {
        alert('Помилка: ' + (error as Error).message)
      }
    }
  }

  const handleAddAdmin = () => {
    if (!newAdminEmail.includes('@')) {
      alert('Введіть коректний email')
      return
    }
    
    const success = AdminService.addAdmin(newAdminEmail)
    if (success) {
      AdminService.syncAdminPermissions()
      setAdminEmails(AdminService.getAdminsList())
      setNewAdminEmail("")
      alert('Адміна додано')
      loadData()
    } else {
      alert('Цей email вже є в списку адмінів')
    }
  }

  const handleRemoveAdmin = (email: string) => {
    if (adminEmails.length <= 1) {
      alert('Не можна видалити останнього адміна')
      return
    }
    
    if (email.toLowerCase() === user?.email?.toLowerCase()) {
      alert('Не можна видалити самого себе')
      return
    }
    
    const success = AdminService.removeAdmin(email)
    if (success) {
      AdminService.syncAdminPermissions()
      setAdminEmails(AdminService.getAdminsList())
      alert('Адміна видалено')
      loadData()
    } else {
      alert('Помилка видалення адміна')
    }
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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "Створено": return <FaBox style={{ color: "#f59e0b" }} />
      case "В обробці": return <FaTruck style={{ color: "#3b82f6" }} />
      case "Доставлено": return <FaCheckCircle style={{ color: "#10b981" }} />
      case "Скасовано": return <FaTimesCircle style={{ color: "#ef4444" }} />
      default: return <FaBox />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    )
  }

  if (!user?.isAdmin) {
    return (
      <Layout>
        <div style={{
          textAlign: 'center',
          padding: '100px 20px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
          border: '1px solid #f1f5f9'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#ef4444'
          }}>
            <FaUserShield size={32} />
          </div>
          <h2 style={{ color: '#1e293b', marginBottom: '15px' }}>Доступ заборонено</h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 25px' }}>
            Ви не маєте прав адміністратора для доступу до цієї сторінки.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Заголовок адмін панелі */}
      <div style={{
        marginBottom: "40px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "20px",
        padding: "40px",
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
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
          filter: "blur(40px)"
        }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "10px"
            }}>
              Адмін панель
            </h1>
            <p style={{ opacity: 0.9, fontSize: "1.1rem" }}>
              Управління користувачами та замовленнями
            </p>
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <button
              onClick={loadData}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.1)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
            >
              <FaRedo /> Оновити дані
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
          position: "relative",
          zIndex: 1
        }}>
          {[
            { label: "Користувачів", value: stats?.totalUsers || 0, icon: <FaUsers />, color: "#4f46e5" },
            { label: "Замовлень", value: stats?.totalOrders || 0, icon: <FaBox />, color: "#10b981" },
            { label: "Доходів", value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`, icon: <FaDollarSign />, color: "#f59e0b" },
            { label: "Адмінів", value: stats?.totalAdmins || 0, icon: <FaUserShield />, color: "#8b5cf6" }
          ].map((stat, index) => (
            <div key={index} style={{
              background: "rgba(255,255,255,0.05)",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              transition: "transform 0.3s"
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = "translateY(-5px)"
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = "translateY(0)"
            }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "5px" }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
                    {stat.value}
                  </div>
                </div>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  background: stat.color + "20",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stat.color,
                  fontSize: "1.5rem"
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Навігаційні вкладки */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        background: "white",
        padding: "10px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        border: "1px solid #f1f5f9"
      }}>
        {[
          { id: 'orders', label: 'Замовлення', icon: <FaBox /> },
          { id: 'users', label: 'Користувачі', icon: <FaUsers /> },
          { id: 'admins', label: 'Адміністратори', icon: <FaUserShield /> },
          { id: 'stats', label: 'Статистика', icon: <FaChartLine /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "15px 25px",
              borderRadius: "12px",
              border: "none",
              background: activeTab === tab.id ? "#4f46e5" : "transparent",
              color: activeTab === tab.id ? "white" : "#64748b",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "all 0.3s",
              flex: 1,
              justifyContent: "center"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Вміст вкладок */}
      <div>
        {/* Вкладка Замовлення */}
        {activeTab === 'orders' && (
          <div>
            {/* Панель пошуку та фільтрів */}
            <div style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              marginBottom: "30px"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "20px",
                alignItems: "center",
                marginBottom: "20px"
              }}>
                <div style={{ position: "relative" }}>
                  <FaSearch style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8"
                  }} />
                  <input
                    type="text"
                    placeholder="Пошук за ID, ім'ям або країною..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                      width: "100%",
                      padding: "15px 15px 15px 45px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "16px",
                      transition: "all 0.3s"
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = "#4f46e5";
                      e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div style={{ position: "relative" }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    style={{
                      padding: "15px 45px 15px 15px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "white",
                      fontSize: "16px",
                      appearance: "none",
                      cursor: "pointer",
                      minWidth: "200px"
                    }}
                  >
                    <option value="all">Всі статуси</option>
                    <option value="Створено">Створено</option>
                    <option value="В обробці">В обробці</option>
                    <option value="Доставлено">Доставлено</option>
                    <option value="Скасовано">Скасовано</option>
                  </select>
                  <FaFilter style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none"
                  }} />
                </div>

                <div style={{ position: "relative" }}>
                  <select
                    value={userFilter}
                    onChange={(e) => handleFilterChange('user', e.target.value)}
                    style={{
                      padding: "15px 45px 15px 15px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      background: "white",
                      fontSize: "16px",
                      appearance: "none",
                      cursor: "pointer",
                      minWidth: "200px"
                    }}
                  >
                    <option value="all">Всі користувачі</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  <FaUsers style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                    pointerEvents: "none"
                  }} />
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "20px",
                borderTop: "1px solid #f1f5f9"
              }}>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Знайдено {filteredOrders.length} замовлень
                </div>
                <button
                  onClick={() => {
                    const csvContent = filteredOrders.map(order => 
                      `${order.id},${order.userName},${order.deliveryCountry},${order.status},${order.totalPrice}`
                    ).join('\n')
                    const blob = new Blob([csvContent], { type: 'text/csv' })
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'orders.csv'
                    a.click()
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "10px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.3s"
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = "#0da271";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = "#10b981";
                  }}
                >
                  <FaDownload /> Експорт CSV
                </button>
              </div>
            </div>

            {/* Список замовлень */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9"
            }}>
              {filteredOrders.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: "#64748b"
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
                    color: "#cbd5e1"
                  }}>
                    <FaBox size={32} />
                  </div>
                  <h3 style={{ marginBottom: "10px", color: "#475569" }}>
                    Замовлень не знайдено
                  </h3>
                  <p>Спробуйте змінити параметри пошуку або фільтри</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "1000px"
                  }}>
                    <thead>
                      <tr style={{
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0"
                      }}>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>ID</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Користувач</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Країна</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Статус</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Дата</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Сума</th>
                        <th style={{
                          padding: "20px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "#475569",
                          fontSize: "14px"
                        }}>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr 
                          key={order.id}
                          style={{
                            borderBottom: "1px solid #f1f5f9",
                            transition: "all 0.3s"
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = "#f8fafc";
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = "white";
                          }}
                        >
                          <td style={{ padding: "20px", color: "#1e293b", fontWeight: 500 }}>
                            #{order.id.slice(0, 8)}
                          </td>
                          <td style={{ padding: "20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                background: "#4f46e5",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 600
                              }}>
                                {order.userName.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, color: "#1e293b" }}>
                                  {order.userName}
                                </div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>
                                  ID: {order.userId.slice(0, 8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "20px", color: "#475569" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <FaGlobe color="#94a3b8" />
                              {order.deliveryCountry}
                            </div>
                          </td>
                          <td style={{ padding: "20px" }}>
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              background: getStatusColor(order.status) + "15",
                              color: getStatusColor(order.status),
                              fontWeight: 500,
                              fontSize: "14px"
                            }}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </td>
                          <td style={{ padding: "20px", color: "#64748b" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <FaCalendar color="#94a3b8" size={14} />
                              {formatDate(order.createdAt)}
                            </div>
                          </td>
                          <td style={{ padding: "20px", fontWeight: 600, color: "#1e293b" }}>
                            ${order.totalPrice?.toFixed(2) || '0.00'}
                          </td>
                          <td style={{ padding: "20px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                              {editOrderId === order.id ? (
                                <>
                                  <select
                                    value={editOrderStatus}
                                    onChange={(e) => setEditOrderStatus(e.target.value)}
                                    style={{
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      border: "1px solid #e2e8f0",
                                      background: "white",
                                      fontSize: "14px"
                                    }}
                                  >
                                    <option value="">Оберіть статус</option>
                                    <option value="Створено">Створено</option>
                                    <option value="В обробці">В обробці</option>
                                    <option value="Доставлено">Доставлено</option>
                                    <option value="Скасовано">Скасовано</option>
                                  </select>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id)}
                                    style={{
                                      padding: "8px 16px",
                                      borderRadius: "8px",
                                      background: "#10b981",
                                      color: "white",
                                      border: "none",
                                      cursor: "pointer"
                                    }}
                                  >
                                    Зберегти
                                  </button>
                                  <button
                                    onClick={() => setEditOrderId(null)}
                                    style={{
                                      padding: "8px 16px",
                                      borderRadius: "8px",
                                      background: "#ef4444",
                                      color: "white",
                                      border: "none",
                                      cursor: "pointer"
                                    }}
                                  >
                                    Скасувати
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditOrderId(order.id);
                                      setEditOrderStatus(order.status);
                                    }}
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "8px",
                                      background: "#f1f5f9",
                                      border: "none",
                                      color: "#475569",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "all 0.3s"
                                    }}
                                    onMouseOver={e => {
                                      e.currentTarget.style.background = "#4f46e5";
                                      e.currentTarget.style.color = "white";
                                    }}
                                    onMouseOut={e => {
                                      e.currentTarget.style.background = "#f1f5f9";
                                      e.currentTarget.style.color = "#475569";
                                    }}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      borderRadius: "8px",
                                      background: "#fef2f2",
                                      border: "none",
                                      color: "#ef4444",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      transition: "all 0.3s"
                                    }}
                                    onMouseOver={e => {
                                      e.currentTarget.style.background = "#ef4444";
                                      e.currentTarget.style.color = "white";
                                    }}
                                    onMouseOut={e => {
                                      e.currentTarget.style.background = "#fef2f2";
                                      e.currentTarget.style.color = "#ef4444";
                                    }}
                                  >
                                    <FaTrash />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Вкладка Користувачі */}
        {activeTab === 'users' && (
          <div>
            <div style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              marginBottom: "30px"
            }}>
              <div style={{
                padding: "25px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b" }}>
                  Користувачі ({users.length})
                </h3>
                <div style={{ position: "relative" }}>
                  <FaSearch style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8"
                  }} />
                  <input
                    type="text"
                    placeholder="Пошук користувачів..."
                    style={{
                      padding: "12px 12px 12px 45px",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "16px",
                      minWidth: "300px"
                    }}
                  />
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "1000px"
                }}>
                  <thead>
                    <tr style={{
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Користувач</th>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Контакти</th>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Реєстрація</th>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Замовлення</th>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Права адміна</th>
                      <th style={{
                        padding: "20px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "#475569",
                        fontSize: "14px"
                      }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => (
                      <tr 
                        key={userData.id}
                        style={{
                          borderBottom: "1px solid #f1f5f9",
                          transition: "all 0.3s"
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.background = "#f8fafc";
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.background = "white";
                        }}
                      >
                        <td style={{ padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background: "#4f46e5",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              fontSize: "1.2rem"
                            }}>
                              {userData.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500, color: "#1e293b" }}>
                                {userData.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#64748b" }}>
                                ID: {userData.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{ color: "#1e293b", fontWeight: 500, marginBottom: "5px" }}>
                            {userData.email}
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b" }}>
                            {userData.phone || "Без телефону"}
                          </div>
                        </td>
                        <td style={{ padding: "20px", color: "#64748b" }}>
                          {new Date(userData.createdAt).toLocaleDateString('uk-UA')}
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: userData.ordersCount > 0 ? "#10b98115" : "#f1f5f9",
                            color: userData.ordersCount > 0 ? "#10b981" : "#64748b",
                            fontWeight: 500,
                            fontSize: "14px"
                          }}>
                            <FaBox size={12} />
                            {userData.ordersCount} замовлень
                          </div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            background: userData.isAdmin ? "#8b5cf615" : "#f1f5f9",
                            color: userData.isAdmin ? "#8b5cf6" : "#64748b",
                            fontWeight: 500,
                            fontSize: "14px"
                          }}>
                            <FaUserShield size={12} />
                            {userData.isAdmin ? "Адміністратор" : "Користувач"}
                          </div>
                        </td>
                        <td style={{ padding: "20px" }}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => handleToggleAdmin(userData.id, userData.isAdmin)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: "8px",
                                background: userData.isAdmin ? "#f59e0b" : "#4f46e5",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "14px",
                                transition: "all 0.3s"
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.opacity = "0.9";
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              {userData.isAdmin ? <FaUserMinus /> : <FaUserPlus />}
                              {userData.isAdmin ? "Забрати права" : "Зробити адміном"}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(userData.id, userData.name)}
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "8px",
                                background: "#fef2f2",
                                border: "none",
                                color: "#ef4444",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.3s"
                              }}
                              onMouseOver={e => {
                                e.currentTarget.style.background = "#ef4444";
                                e.currentTarget.style.color = "white";
                              }}
                              onMouseOut={e => {
                                e.currentTarget.style.background = "#fef2f2";
                                e.currentTarget.style.color = "#ef4444";
                              }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{
              background: "#fefce8",
              border: "1px solid #fef08a",
              borderRadius: "16px",
              padding: "20px",
              marginTop: "30px"
            }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <FaExclamationTriangle color="#ca8a04" size={20} />
                <div>
                  <h4 style={{ color: "#854d0e", marginBottom: "8px" }}>
                    Важлива інформація
                  </h4>
                  <p style={{ color: "#854d0e", fontSize: "14px", lineHeight: 1.6 }}>
                    При видаленні користувача будуть також видалені всі його замовлення. 
                    Ця дія незворотна. Надання прав адміністратора дозволяє користувачу 
                    отримати доступ до цієї панелі управління.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка Адміністратори */}
        {activeTab === 'admins' && (
          <div>
            <div style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              marginBottom: "30px"
            }}>
              <div style={{
                padding: "25px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", marginBottom: "5px" }}>
                    Адміністратори
                  </h3>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>
                    Керування доступом до адмін-панелі
                  </p>
                </div>
              </div>

              <div style={{ padding: "25px" }}>
                <div style={{
                  background: "#f8fafc",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "30px"
                }}>
                  <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: 500,
                        color: "#475569"
                      }}>
                        Додати нового адміністратора
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="email"
                          placeholder="Email користувача"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "16px"
                          }}
                        />
                        <button
                          onClick={handleAddAdmin}
                          style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.3s"
                          }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = "#4338ca";
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = "#4f46e5";
                          }}
                        >
                          <FaUserPlus /> Додати адміна
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: "grid",
                  gap: "20px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
                }}>
                  {adminEmails.map((email) => (
                    <div 
                      key={email}
                      style={{
                        background: email.toLowerCase() === user?.email?.toLowerCase() 
                          ? "#f0f9ff" 
                          : "white",
                        border: email.toLowerCase() === user?.email?.toLowerCase()
                          ? "2px solid #0ea5e9"
                          : "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "20px",
                        transition: "all 0.3s",
                        position: "relative"
                      }}
                      onMouseOver={e => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.1)";
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {email.toLowerCase() === user?.email?.toLowerCase() && (
                        <div style={{
                          position: "absolute",
                          top: "-10px",
                          right: "20px",
                          background: "#0ea5e9",
                          color: "white",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}>
                          Ви
                        </div>
                      )}
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                        <div style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          background: email.toLowerCase() === user?.email?.toLowerCase()
                            ? "#0ea5e9"
                            : "#4f46e5",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 600,
                          fontSize: "1.2rem"
                        }}>
                          {email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#1e293b" }}>
                            {email}
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b" }}>
                            Адміністратор
                          </div>
                        </div>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "15px",
                        borderTop: "1px solid #f1f5f9"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaCog color="#94a3b8" size={14} />
                          <span style={{ fontSize: "13px", color: "#64748b" }}>
                            Повні права доступу
                          </span>
                        </div>
                        
                        {email.toLowerCase() !== user?.email?.toLowerCase() && (
                          <button
                            onClick={() => handleRemoveAdmin(email)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#fef2f2",
                              color: "#ef4444",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              transition: "all 0.3s"
                            }}
                            onMouseOver={e => {
                              e.currentTarget.style.background = "#ef4444";
                              e.currentTarget.style.color = "white";
                            }}
                            onMouseOut={e => {
                              e.currentTarget.style.background = "#fef2f2";
                              e.currentTarget.style.color = "#ef4444";
                            }}
                          >
                            <FaUserMinus size={12} />
                            Видалити
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "16px",
              padding: "20px",
              marginTop: "30px"
            }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                <FaInfoCircle color="#0ea5e9" size={20} />
                <div>
                  <h4 style={{ color: "#0369a1", marginBottom: "8px" }}>
                    Про права адміністратора
                  </h4>
                  <ul style={{ 
                    color: "#0369a1", 
                    fontSize: "14px", 
                    lineHeight: 1.6,
                    paddingLeft: "20px" 
                  }}>
                    <li>Адміністратори мають доступ до всіх функцій управління</li>
                    <li>Не можна видалити самого себе зі списку адміністраторів</li>
                    <li>Система повинна мати щонайменше одного активного адміна</li>
                    <li>Всі адміністратори мають однакові права доступу</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Вкладка Статистика */}
        {activeTab === 'stats' && (
          <div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              marginBottom: "30px"
            }}>
              {/* Графік статистики замовлень */}
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9"
              }}>
                <h3 style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: 600, 
                  color: "#1e293b",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaChartLine /> Статистика замовлень
                </h3>
                
                <div style={{ 
                  height: "200px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "10px",
                  padding: "20px 0"
                }}>
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => {
                    const value = Math.floor(Math.random() * 100) + 20;
                    return (
                      <div 
                        key={month}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center"
                        }}
                      >
                        <div style={{
                          width: "30px",
                          height: `${value}%`,
                          background: "linear-gradient(180deg, #4f46e5 0%, #8b5cf6 100%)",
                          borderRadius: "6px",
                          marginBottom: "8px",
                          transition: "height 0.5s ease"
                        }} />
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {month}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                          {value}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Статуси замовлень */}
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                border: "1px solid #f1f5f9"
              }}>
                <h3 style={{ 
                  fontSize: "1.25rem", 
                  fontWeight: 600, 
                  color: "#1e293b",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>
                  <FaBox /> Статуси замовлень
                </h3>
                
                <div style={{ display: "grid", gap: "15px" }}>
                  {[
                    { status: "Створено", count: 12, color: "#f59e0b" },
                    { status: "В обробці", count: 8, color: "#3b82f6" },
                    { status: "Доставлено", count: 45, color: "#10b981" },
                    { status: "Скасовано", count: 3, color: "#ef4444" }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom: "1px solid #f1f5f9"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: item.color
                        }} />
                        <span style={{ color: "#475569", fontWeight: 500 }}>
                          {item.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>
                          {item.count}
                        </span>
                        <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                          ({((item.count / 68) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Детальна статистика */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "25px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #f1f5f9",
              marginBottom: "30px"
            }}>
              <h3 style={{ 
                fontSize: "1.25rem", 
                fontWeight: 600, 
                color: "#1e293b",
                marginBottom: "25px"
              }}>
                Детальна статистика
              </h3>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px"
              }}>
                {[
                  { label: "Середній чек", value: "$124.50", change: "+5.2%", up: true },
                  { label: "Конверсія", value: "3.4%", change: "+0.8%", up: true },
                  { label: "Повторні покупки", value: "42%", change: "+12%", up: true },
                  { label: "Відмови", value: "1.8%", change: "-0.3%", up: false },
                  { label: "Активних користувачів", value: "1,234", change: "+15%", up: true },
                  { label: "Завантажено сторінок", value: "45,678", change: "+23%", up: true }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    style={{
                      padding: "20px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1px solid #f1f5f9",
                      transition: "all 0.3s"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.05)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "#f8fafc";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "8px" }}>
                      {stat.label}
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "flex-end"
                    }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b" }}>
                        {stat.value}
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: stat.up ? "#10b981" : "#ef4444",
                        fontWeight: 500,
                        fontSize: "14px"
                      }}>
                        {stat.up ? <FaArrowUp size={12} /> : <FaArrowDown size={12} />}
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Layout>
  )
}