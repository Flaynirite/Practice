// src/pages/Profile.tsx
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaLock, FaCamera, FaSave, FaTimes, FaEye, FaEyeSlash,
  FaHistory, FaCreditCard, FaBell, FaShieldAlt, FaUpload,
  FaCheckCircle, FaBox, FaTruck, FaStar, FaEdit, FaSignOutAlt,
  FaChartBar, FaCrown, FaCalendarAlt, FaInfoCircle
} from "react-icons/fa"
import UserHeader from "../components/UserHeader"
import { useAuth } from "../contexts/AuthContext"

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, updateProfile, logout, isLoading: authLoading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Отримання таби з URL
  const queryParams = new URLSearchParams(location.search)
  const initialTab = queryParams.get('tab') || "profile"

  // Основні дані профілю
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  
  // Пароль
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  // Налаштування
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  })
  
  // Аватар
  const [avatar, setAvatar] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Статус
  const [message, setMessage] = useState({ text: "", type: "" })
  const [activeTab, setActiveTab] = useState(initialTab)
  const [isLoading, setIsLoading] = useState(false)

  // Оновлюємо табу при зміні URL
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [location.search])

  // Завантаження даних користувача
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
      setPhone(user.phone || "+380")
      setAddress(user.address || "")
      setAvatar(user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=4f46e5&color=fff`)
      
      if (user.notifications) {
        setNotifications(user.notifications)
      }
    } else if (!authLoading) {
      navigate("/login")
    }
  }, [user, navigate, authLoading])

  // Завантаження аватара
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setIsLoading(true)
    setUploadProgress(0)
    
    try {
      // Симуляція завантаження
      const simulateUpload = () => {
        return new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            setUploadProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval)
                resolve()
                return 100
              }
              return prev + 10
            })
          }, 100)
        })
      }

      await simulateUpload()
      
      // Створюємо URL для завантаженого файлу
      const reader = new FileReader()
      reader.onload = async (event) => {
        const newAvatar = event.target?.result as string
        
        try {
          await updateProfile({ 
            avatar: newAvatar,
            ...user,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.address || '',
            notifications: user.notifications || notifications
          })
          
          setAvatar(newAvatar)
          setMessage({ text: "Аватар успішно оновлено!", type: "success" })
        } catch (error) {
          setMessage({ text: "Помилка оновлення аватара", type: "error" })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage({ text: "Помилка завантаження файлу", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Збереження профілю
  const saveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!user) return
    
    setIsLoading(true)
    setMessage({ text: "", type: "" })
    
    try {
      await updateProfile({ 
        name, 
        email, 
        phone, 
        address,
        notifications 
      })
      
      setMessage({ text: "Профіль успішно оновлено!", type: "success" })
    } catch (err) {
      setMessage({ text: "Помилка оновлення профілю", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Зміна пароля
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Паролі не співпадають", type: "error" })
      return
    }
    
    if (newPassword.length < 6) {
      setMessage({ text: "Пароль має містити мінімум 6 символів", type: "error" })
      return
    }
    
    setIsLoading(true)
    try {
      // Отримуємо всіх користувачів
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Знаходимо поточного користувача
      const userIndex = users.findIndex((u: any) => u.id === user.id)
      
      if (userIndex === -1) {
        throw new Error('Користувач не знайдений')
      }
      
      // Оновлюємо пароль
      users[userIndex].password = newPassword
      localStorage.setItem('users', JSON.stringify(users))
      
      setMessage({ text: "Пароль успішно змінено!", type: "success" })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({ text: "Помилка зміни пароля", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // Оновлення налаштувань сповіщень
  const updateNotificationSettings = async (type: 'email' | 'sms' | 'push') => {
    if (!user) return
    
    const newNotifications = {
      ...notifications,
      [type]: !notifications[type]
    }
    
    setNotifications(newNotifications)
    
    try {
      await updateProfile({ notifications: newNotifications })
    } catch (error) {
      console.error('Помилка оновлення налаштувань:', error)
      // Повертаємо попередні налаштування при помилці
      setNotifications(notifications)
    }
  }

  // Вихід з акаунта
  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (authLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
        color: 'white'
      }}>
        <div style={{ fontSize: '1.2rem' }}>Завантаження профілю...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Імітована статистика
  const userStats = {
    totalOrders: 24,
    completedOrders: 18,
    pendingOrders: 3,
    cancelledOrders: 3,
    userRating: 4.8,
    memberSince: user.createdAt || "2024-01-15"
  }

  // Останні дії
  const recentActivities = [
    { id: 1, action: "Ви успішно увійшли", orderId: "", date: "сьогодні", icon: <FaCheckCircle /> },
    { id: 2, action: "Створено замовлення", orderId: "#ORD-78945", date: "вчора", icon: <FaBox /> },
    { id: 3, action: "Доставлено замовлення", orderId: "#ORD-78942", date: "2 дні тому", icon: <FaTruck /> },
    { id: 4, action: "Оновлено профіль", orderId: "", date: "3 дні тому", icon: <FaUser /> }
  ]

  return (
    <div style={{ 
      fontFamily: "Inter, sans-serif", 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f4f6fb 0%, #eef2ff 100%)"
    }}>
      <UserHeader />
      
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Заголовок */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px" 
        }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "#4f46e5", marginBottom: "5px" }}>
              Особистий кабінет
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>
              Керуйте вашими налаштуваннями та переглядайте статистику
            </p>
          </div>
          
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px",
            color: "#4f46e5",
            fontWeight: 600
          }}>
            <FaStar />
            <span>Рейтинг: {userStats.userRating}/5</span>
          </div>
        </div>

        {/* Бокова панель та основний вміст */}
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          {/* Бокова панель */}
          <div style={{ 
            flex: "0 0 280px", 
            background: "white", 
            borderRadius: "20px", 
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            height: "fit-content"
          }}>
            {/* Аватар */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img 
                  src={avatar} 
                  alt="Аватар" 
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    borderRadius: "50%", 
                    border: "4px solid #4f46e5",
                    objectFit: "cover"
                  }}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  style={{ 
                    position: "absolute", 
                    bottom: "0", 
                    right: "0", 
                    background: "#4f46e5", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "50%", 
                    width: "36px", 
                    height: "36px", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1rem",
                    opacity: isLoading ? 0.7 : 1
                  }}
                >
                  <FaCamera />
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  style={{ display: "none" }} 
                  onChange={handleAvatarUpload}
                  disabled={isLoading}
                />
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ 
                  width: "100%", 
                  background: "#e0e0e0", 
                  borderRadius: "10px", 
                  marginTop: "10px",
                  overflow: "hidden"
                }}>
                  <div 
                    style={{ 
                      width: `${uploadProgress}%`, 
                      height: "6px", 
                      background: "#4f46e5",
                      transition: "width 0.3s"
                    }}
                  />
                </div>
              )}
              
              <h3 style={{ marginTop: "15px", marginBottom: "5px" }}>{name}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>{email}</p>
            </div>

            {/* Меню */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[
                { id: "profile", label: "Особиста інформація", icon: <FaUser /> },
                { id: "security", label: "Безпека", icon: <FaLock /> },
                { id: "notifications", label: "Сповіщення", icon: <FaBell /> },
                { id: "history", label: "Історія дій", icon: <FaHistory /> },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  disabled={isLoading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "14px 16px",
                    background: activeTab === item.id ? "#f0ebff" : "transparent",
                    border: "none",
                    borderRadius: "12px",
                    color: activeTab === item.id ? "#4f46e5" : "#555",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                    fontSize: "0.95rem",
                    opacity: isLoading ? 0.7 : 1
                  }}
                  onMouseOver={e => {
                    if (activeTab !== item.id && !isLoading) {
                      e.currentTarget.style.background = "#f8f8f8";
                    }
                  }}
                  onMouseOut={e => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Статистика */}
            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
              <h4 style={{ marginBottom: "15px", color: "#4f46e5" }}>Статистика</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Замовлень:</span>
                  <span style={{ fontWeight: 600 }}>{userStats.totalOrders}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Виконано:</span>
                  <span style={{ fontWeight: 600, color: "#16a34a" }}>{userStats.completedOrders}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>У процесі:</span>
                  <span style={{ fontWeight: 600, color: "#f59e0b" }}>{userStats.pendingOrders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Основний вміст */}
          <div style={{ flex: "1", minWidth: "300px" }}>
            {/* Повідомлення */}
            {message.text && (
              <div style={{
                padding: "16px 20px",
                borderRadius: "12px",
                background: message.type === "success" ? "#d1fae5" : "#fee2e2",
                color: message.type === "success" ? "#065f46" : "#991b1b",
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                animation: "slideDown 0.3s ease-out"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {message.type === "success" ? <FaCheckCircle /> : <FaTimes />}
                  <span>{message.text}</span>
                </div>
                <button 
                  onClick={() => setMessage({ text: "", type: "" })}
                  disabled={isLoading}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}
                >
                  &times;
                </button>
              </div>
            )}

            {/* Вміст закладок */}
            {activeTab === "profile" && (
              <div style={{ 
                background: "white", 
                borderRadius: "20px", 
                padding: "40px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                  <h2 style={{ fontSize: "1.8rem", color: "#4f46e5" }}>
                    <FaUser style={{ marginRight: "10px" }} />
                    Особиста інформація
                  </h2>
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "10px",
                      background: isLoading ? "#999" : "#4f46e5",
                      color: "white",
                      fontWeight: 600,
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s",
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    <FaSave /> {isLoading ? "Збереження..." : "Зберегти зміни"}
                  </button>
                </div>

                <form onSubmit={saveProfile} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                      <FaUser style={{ marginRight: "8px" }} /> Ім'я та прізвище
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      disabled={isLoading}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        outline: "none",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        opacity: isLoading ? 0.7 : 1
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#4f46e5"}
                      onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                      <FaEnvelope style={{ marginRight: "8px" }} /> Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isLoading}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        outline: "none",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        opacity: isLoading ? 0.7 : 1
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#4f46e5"}
                      onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                      <FaPhone style={{ marginRight: "8px" }} /> Телефон
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      disabled={isLoading}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        outline: "none",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        opacity: isLoading ? 0.7 : 1
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#4f46e5"}
                      onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                      <FaMapMarkerAlt style={{ marginRight: "8px" }} /> Адреса доставки
                    </label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      rows={3}
                      disabled={isLoading}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: "1px solid #ddd",
                        outline: "none",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        transition: "all 0.2s",
                        resize: "vertical",
                        minHeight: "80px",
                        opacity: isLoading ? 0.7 : 1
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#4f46e5"}
                      onBlur={e => e.currentTarget.style.borderColor = "#ddd"}
                    />
                  </div>
                </form>

                {/* Додаткова інформація */}
                <div style={{ marginTop: "40px", paddingTop: "25px", borderTop: "1px solid #eee" }}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", color: "#4f46e5" }}>Додаткова інформація</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                    <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px" }}>
                      <div style={{ color: "#4f46e5", fontWeight: 600, marginBottom: "5px" }}>Дата реєстрації</div>
                      <div>{new Date(userStats.memberSince).toLocaleDateString('uk-UA')}</div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px" }}>
                      <div style={{ color: "#4f46e5", fontWeight: 600, marginBottom: "5px" }}>Рівень користувача</div>
                      <div>Standard</div>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "12px" }}>
                      <div style={{ color: "#4f46e5", fontWeight: 600, marginBottom: "5px" }}>Верифікація</div>
                      <div style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "5px" }}>
                        <FaCheckCircle /> Email підтверджено
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div style={{ 
                background: "white", 
                borderRadius: "20px", 
                padding: "40px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
              }}>
                <h2 style={{ fontSize: "1.8rem", color: "#4f46e5", marginBottom: "30px" }}>
                  <FaLock style={{ marginRight: "10px" }} />
                  Налаштування безпеки
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                  {/* Зміна пароля */}
                  <div>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "20px", color: "#333" }}>Зміна пароля</h3>
                    <form onSubmit={handlePasswordChange} style={{ display: "grid", gap: "20px" }}>
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                          Поточний пароль
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            disabled={isLoading}
                            style={{
                              padding: "14px 16px",
                              borderRadius: "12px",
                              border: "1px solid #ddd",
                              outline: "none",
                              fontSize: "1rem",
                              width: "100%",
                              boxSizing: "border-box",
                              opacity: isLoading ? 0.7 : 1
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                            style={{
                              position: "absolute",
                              right: "15px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "none",
                              border: "none",
                              cursor: isLoading ? "not-allowed" : "pointer",
                              color: "#666",
                              opacity: isLoading ? 0.7 : 1
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                          Новий пароль
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          disabled={isLoading}
                          style={{
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                            outline: "none",
                            fontSize: "1rem",
                            width: "100%",
                            boxSizing: "border-box",
                            opacity: isLoading ? 0.7 : 1
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#555" }}>
                          Підтвердження нового пароля
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          style={{
                            padding: "14px 16px",
                            borderRadius: "12px",
                            border: "1px solid #ddd",
                            outline: "none",
                            fontSize: "1rem",
                            width: "100%",
                            boxSizing: "border-box",
                            opacity: isLoading ? 0.7 : 1
                          }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          padding: "14px 24px",
                          borderRadius: "10px",
                          background: isLoading ? "#999" : "#4f46e5",
                          color: "white",
                          fontWeight: 600,
                          border: "none",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          width: "fit-content",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        <FaSave /> {isLoading ? "Обробка..." : "Змінити пароль"}
                      </button>
                    </form>
                  </div>

                  {/* Двофакторна автентифікація */}
                  <div>
                    <h3 style={{ fontSize: "1.3rem", marginBottom: "20px", color: "#333" }}>Двофакторна автентифікація</h3>
                    <div style={{ 
                      background: "#f8fafc", 
                      padding: "25px", 
                      borderRadius: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: "5px" }}>Захист вашого акаунту</div>
                        <div style={{ color: "#666", fontSize: "0.9rem" }}>
                          Додайте додатковий рівень безпеки до вашого акаунту
                        </div>
                      </div>
                      <button 
                        disabled={isLoading}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "8px",
                          background: "#4f46e5",
                          color: "white",
                          border: "none",
                          fontWeight: 600,
                          cursor: isLoading ? "not-allowed" : "pointer",
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        Увімкнути
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div style={{ 
                background: "white", 
                borderRadius: "20px", 
                padding: "40px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
              }}>
                <h2 style={{ fontSize: "1.8rem", color: "#4f46e5", marginBottom: "30px" }}>
                  <FaBell style={{ marginRight: "10px" }} />
                  Налаштування сповіщень
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { 
                      id: "email" as const, 
                      title: "Email сповіщення", 
                      description: "Отримувати сповіщення про статус замовлень на email",
                      enabled: notifications.email 
                    },
                    { 
                      id: "sms" as const, 
                      title: "SMS сповіщення", 
                      description: "Отримувати SMS про важливі оновлення",
                      enabled: notifications.sms 
                    },
                    { 
                      id: "push" as const, 
                      title: "Push-сповіщення", 
                      description: "Сповіщення в браузері та мобільному додатку",
                      enabled: notifications.push 
                    },
                  ].map(item => (
                    <div key={item.id} style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "20px",
                      background: "#f8fafc",
                      borderRadius: "12px"
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: "5px" }}>{item.title}</div>
                        <div style={{ color: "#666", fontSize: "0.9rem" }}>{item.description}</div>
                      </div>
                      <div 
                        onClick={() => !isLoading && updateNotificationSettings(item.id)}
                        style={{
                          width: "50px",
                          height: "26px",
                          background: notifications[item.id] ? "#4f46e5" : "#ccc",
                          borderRadius: "13px",
                          position: "relative",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          transition: "background 0.3s",
                          opacity: isLoading ? 0.7 : 1
                        }}
                      >
                        <div style={{
                          position: "absolute",
                          top: "3px",
                          left: notifications[item.id] ? "27px" : "3px",
                          width: "20px",
                          height: "20px",
                          background: "white",
                          borderRadius: "50%",
                          transition: "left 0.3s"
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div style={{ 
                background: "white", 
                borderRadius: "20px", 
                padding: "40px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
              }}>
                <h2 style={{ fontSize: "1.8rem", color: "#4f46e5", marginBottom: "30px" }}>
                  <FaHistory style={{ marginRight: "10px" }} />
                  Історія дій
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {recentActivities.map(activity => (
                    <div key={activity.id} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "15px",
                      padding: "18px 20px",
                      background: "#f8fafc",
                      borderRadius: "12px",
                      borderLeft: "4px solid #4f46e5"
                    }}>
                      <div style={{ 
                        background: "#4f46e5", 
                        color: "white", 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {activity.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{activity.action}</div>
                        {activity.orderId && (
                          <div style={{ fontSize: "0.9rem", color: "#4f46e5" }}>{activity.orderId}</div>
                        )}
                      </div>
                      <div style={{ color: "#666", fontSize: "0.9rem" }}>{activity.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки дій */}
        <div style={{ 
          marginTop: "40px", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          padding: "25px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)"
        }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "5px" }}>Потрібна допомога?</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>Зв'яжіться з нашою службою підтримки</p>
          </div>
          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/dashboard")}
              disabled={isLoading}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                background: "white",
                color: "#4f46e5",
                border: "2px solid #4f46e5",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={e => {
                if (!isLoading) {
                  e.currentTarget.style.background = "#4f46e5";
                  e.currentTarget.style.color = "white";
                }
              }}
              onMouseOut={e => {
                if (!isLoading) {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#4f46e5";
                }
              }}
            >
              До замовлень
            </button>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                background: "#e53e3e",
                color: "white",
                border: "none",
                fontWeight: 600,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: isLoading ? 0.7 : 1
              }}
              onMouseOver={e => {
                if (!isLoading) e.currentTarget.style.background = "#c53030";
              }}
              onMouseOut={e => {
                if (!isLoading) e.currentTarget.style.background = "#e53e3e";
              }}
            >
              <FaSignOutAlt /> Вийти з акаунта
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  )
}
