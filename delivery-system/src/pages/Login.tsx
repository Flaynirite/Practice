// src/pages/Login.tsx
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import { 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaShippingFast,
  FaShieldAlt,
  FaTruck,
  FaGlobe,
  FaCheckCircle
} from "react-icons/fa"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Валідація
    if (!email || !password) {
      setError("Будь ласка, заповніть всі поля")
      return
    }

    if (!email.includes("@")) {
      setError("Невірний формат email")
      return
    }

    setIsLoading(true)
    
    try {
      // Викликаємо login
      await login(email, password)
      
      // Якщо успішно, перенаправляємо
      const from = (location.state as any)?.from?.pathname || "/"
      navigate(from, { replace: true })
    } catch (err) {
      // Якщо помилка, показуємо її
      setError(err instanceof Error ? err.message : "Невірний Email або пароль")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "Inter, sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      position: "relative"
    }}>
      {/* Декоративні елементи */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "300px",
        height: "300px",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(60px)"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "10%",
        width: "200px",
        height: "200px",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(40px)"
      }} />

      <GuestHeader />

      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        position: "relative"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "1000px",
          width: "100%",
          gap: "40px",
          alignItems: "center"
        }}>
          {/* Ліва частина - інформація */}
          <div style={{
            padding: "40px",
            position: "relative",
            zIndex: 1
          }}>
            <div style={{
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              gap: "15px"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                color: "white"
              }}>
                <FaShippingFast />
              </div>
              <div>
                <h1 style={{
                  fontSize: "2.8rem",
                  fontWeight: 700,
                  background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: "0 0 5px 0"
                }}>
                  DeliveryCo
                </h1>
                <p style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  margin: 0
                }}>
                  Система управління доставками
                </p>
              </div>
            </div>

            <p style={{
              fontSize: "1.1rem",
              lineHeight: 1.6,
              marginBottom: "40px",
              color: "#475569"
            }}>
              Повертайтеся до вашої системи управління доставками. Швидкий доступ до всіх замовлень та аналітики.
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}>
              {[
                { icon: <FaCheckCircle />, text: "Миттєвий доступ до замовлень" },
                { icon: <FaShieldAlt />, text: "Захищені дані та конфіденційність" },
                { icon: <FaTruck />, text: "Відстеження доставки в реальному часі" },
                { icon: <FaGlobe />, text: "Міжнародна доставка у 150+ країн" }
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                  }}
                >
                  <div style={{
                    color: "#4f46e5",
                    fontSize: "1.2rem"
                  }}>
                    {feature.icon}
                  </div>
                  <span style={{ fontSize: "1rem", color: "#475569" }}>{feature.text}</span>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: "40px",
              padding: "25px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "10px"
              }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "rgba(79, 70, 229, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4f46e5"
                }}>
                  <FaShieldAlt />
                </div>
                <span style={{ fontWeight: 600, color: "#1e293b" }}>Безпека гарантована</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                Всі ваші дані зашифровані та захищені промисловими стандартами безпеки.
              </p>
            </div>
          </div>

          {/* Права частина - форма */}
          <div style={{
            position: "relative",
            zIndex: 1
          }}>
            <div style={{
              background: "white",
              borderRadius: "24px",
              padding: "50px 40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              position: "relative",
              overflow: "hidden"
            }}>
              
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "6px",
                background: "linear-gradient(to right, #4f46e5, #8b5cf6)"
              }} />

              <h2 style={{
                marginBottom: "30px",
                fontSize: "2rem",
                color: "#1e293b",
                textAlign: "center"
              }}>
                Увійти в систему
              </h2>

              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4f46e5",
                    fontSize: "1.2rem"
                  }}>
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    placeholder="Ваш email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      padding: "16px 16px 16px 50px",
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

                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#4f46e5",
                    fontSize: "1.2rem"
                  }}>
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    placeholder="Ваш пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{
                      padding: "16px 16px 16px 50px",
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

                {error && (
                  <div style={{
                    padding: "12px 16px",
                    borderRadius: "8px",
                    background: "#fef2f2",
                    border: "1px solid #fee2e2",
                    color: "#dc2626",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    animation: "shake 0.5s ease-in-out"
                  }}>
                    <FaShieldAlt /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: "18px 0",
                    borderRadius: "12px",
                    background: isLoading 
                      ? "#cbd5e1" 
                      : "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.2)",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseOver={e => {
                    if (!isLoading) {
                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(79, 70, 229, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={e => {
                    if (!isLoading) {
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {isLoading ? (
                      <>
                        <span style={{ animation: "pulse 1.5s infinite" }}>🔐</span> Вхід...
                      </>
                    ) : (
                      <>
                        Увійти <FaArrowRight style={{ marginLeft: "8px" }} />
                      </>
                    )}
                  </span>
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    animation: isLoading ? "shimmer 1.5s infinite" : "none"
                  }} />
                </button>
              </form>

              <div style={{
                marginTop: "25px",
                textAlign: "center",
                color: "#64748b",
                fontSize: "0.95rem",
                paddingTop: "20px",
                borderTop: "1px solid #f1f5f9"
              }}>
                <p style={{ marginBottom: "15px" }}>
                  Немає акаунта?{' '}
                  <span 
                    onClick={() => navigate("/create-account")}
                    style={{
                      color: "#4f46e5",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      padding: "4px 8px",
                      borderRadius: "4px"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "rgba(79, 70, 229, 0.1)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Створити новий акаунт
                  </span>
                </p>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                  Забули пароль?{' '}
                  <span style={{ color: "#8b5cf6", cursor: "pointer" }}>
                    Відновити доступ
                  </span>
                </p>
              </div>
            </div>

            <div style={{
              marginTop: "25px",
              padding: "16px",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              color: "#64748b",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              <FaShieldAlt /> Всі сесії захищені SSL шифруванням
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          ::placeholder {
            color: #94a3b8;
          }
        `}
      </style>
    </div>
  )
}