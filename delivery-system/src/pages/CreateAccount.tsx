// src/pages/CreateAccount.tsx - з покращеною валідацією
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaShippingFast,
  FaCheckCircle,
  FaGlobe,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaExclamationTriangle
} from "react-icons/fa"

export default function CreateAccount() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  // Стани для помилок валідації
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Валідація імені
  useEffect(() => {
    if (name && name.length < 2) {
      setNameError("Ім'я повинно містити щонайменше 2 символи")
    } else {
      setNameError("")
    }
  }, [name])

  // Валідація email
  useEffect(() => {
    if (email && !email.includes("@")) {
      setEmailError("Email повинен містити @")
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Некоректний формат email")
    } else {
      setEmailError("")
    }
  }, [email])

  // Валідація пароля
  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError("Пароль повинен містити щонайменше 6 символів")
    } else {
      setPasswordError("")
    }
  }, [password])

  // Валідація підтвердження пароля
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Паролі не співпадають")
    } else {
      setConfirmPasswordError("")
    }
  }, [password, confirmPassword])

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 6) strength += 25
    if (pass.length >= 8) strength += 25
    if (/[A-Z]/.test(pass)) strength += 25
    if (/[0-9]/.test(pass)) strength += 25
    return strength
  }

  const handlePasswordChange = (pass: string) => {
    setPassword(pass)
    setPasswordStrength(calculatePasswordStrength(pass))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Перевірка перед відправкою
    if (!name) {
      setNameError("Будь ласка, введіть ім'я")
      return
    }
    if (!email) {
      setEmailError("Будь ласка, введіть email")
      return
    }
    if (!password) {
      setPasswordError("Будь ласка, введіть пароль")
      return
    }
    if (!confirmPassword) {
      setConfirmPasswordError("Будь ласка, підтвердіть пароль")
      return
    }

    if (nameError || emailError || passwordError || confirmPasswordError) {
      return
    }

    setIsLoading(true)
    try {
      await register(name, email, password)
      navigate("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка реєстрації. Спробуйте ще раз.")
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
        top: "5%",
        right: "5%",
        width: "200px",
        height: "200px",
        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(40px)"
      }} />
      
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "5%",
        width: "250px",
        height: "250px",
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
        position: "relative",
        minHeight: "calc(100vh - 80px)"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          maxWidth: "1100px",
          width: "100%",
          gap: "50px",
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
                width: "70px",
                height: "70px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                color: "white",
                boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)"
              }}>
                <FaShippingFast />
              </div>
              <div>
                <h1 style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  margin: "0 0 5px 0"
                }}>
                  Приєднуйтесь
                </h1>
                <p style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  margin: 0
                }}>
                  до DeliveryCo сьогодні
                </p>
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "30px",
              marginBottom: "30px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0"
            }}>
              <p style={{
                fontSize: "1.1rem",
                lineHeight: 1.6,
                marginBottom: "25px",
                color: "#475569"
              }}>
                Створіть акаунт та отримайте доступ до всіх можливостей нашої платформи доставки.
              </p>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}>
                {[
                  { icon: <FaStar />, text: "Безкоштовний старт - без прихованих платежів" },
                  { icon: <FaGlobe />, text: "Доставка в 150+ країн світу" },
                  { icon: <FaTruck />, text: "Відстеження в реальному часі" },
                  { icon: <FaShieldAlt />, text: "Безпека даних гарантована" }
                ].map((item, index) => (
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
                      fontSize: "1.2rem",
                      background: "rgba(79, 70, 229, 0.1)",
                      padding: "10px",
                      borderRadius: "12px"
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: "0.95rem", color: "#475569" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Статистика */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                textAlign: "center"
              }}>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4f46e5" }}>150+</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Країн доставки</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#4f46e5" }}>24/7</div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Підтримка</div>
                </div>
              </div>
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
              {/* Акцентна лінія */}
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
                Створення акаунта
              </h2>

              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: nameError ? "#ef4444" : "#4f46e5",
                      fontSize: "1.2rem",
                      zIndex: 1
                    }}>
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      placeholder="Ваше ім'я"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      style={{
                        padding: "16px 16px 16px 50px",
                        borderRadius: "12px",
                        border: nameError ? "1px solid #ef4444" : "1px solid #e2e8f0",
                        background: "white",
                        color: "#1e293b",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = nameError ? "#ef4444" : "#4f46e5";
                        e.currentTarget.style.boxShadow = nameError ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(79, 70, 229, 0.1)";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = nameError ? "#ef4444" : "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {nameError && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      marginTop: "6px",
                      marginLeft: "4px"
                    }}>
                      <FaExclamationTriangle /> {nameError}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: emailError ? "#ef4444" : "#4f46e5",
                      fontSize: "1.2rem",
                      zIndex: 1
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
                        border: emailError ? "1px solid #ef4444" : "1px solid #e2e8f0",
                        background: "white",
                        color: "#1e293b",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = emailError ? "#ef4444" : "#4f46e5";
                        e.currentTarget.style.boxShadow = emailError ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(79, 70, 229, 0.1)";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = emailError ? "#ef4444" : "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {emailError && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      marginTop: "6px",
                      marginLeft: "4px"
                    }}>
                      <FaExclamationTriangle /> {emailError}
                    </div>
                  )}
                </div>

                <div>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: passwordError ? "#ef4444" : "#4f46e5",
                      fontSize: "1.2rem",
                      zIndex: 1
                    }}>
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={e => handlePasswordChange(e.target.value)}
                      required
                      style={{
                        padding: "16px 16px 16px 50px",
                        borderRadius: "12px",
                        border: passwordError ? "1px solid #ef4444" : "1px solid #e2e8f0",
                        background: "white",
                        color: "#1e293b",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = passwordError ? "#ef4444" : "#4f46e5";
                        e.currentTarget.style.boxShadow = passwordError ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : "0 0 0 3px rgba(79, 70, 229, 0.1)";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = passwordError ? "#ef4444" : "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  {passwordError && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      marginTop: "6px",
                      marginLeft: "4px"
                    }}>
                      <FaExclamationTriangle /> {passwordError}
                    </div>
                  )}
                </div>

                {password.length > 0 && (
                  <div style={{
                    padding: "12px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px"
                    }}>
                      <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Міцність пароля:</span>
                      <span style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: 600,
                        color: passwordStrength >= 75 ? "#10b981" : 
                               passwordStrength >= 50 ? "#f59e0b" : "#ef4444"
                      }}>
                        {passwordStrength >= 75 ? "Сильний" : 
                         passwordStrength >= 50 ? "Середній" : "Слабкий"}
                      </span>
                    </div>
                    <div style={{
                      height: "6px",
                      background: "#e2e8f0",
                      borderRadius: "3px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${passwordStrength}%`,
                        height: "100%",
                        background: passwordStrength >= 75 ? "#10b981" : 
                                   passwordStrength >= 50 ? "#f59e0b" : "#ef4444",
                        transition: "width 0.3s ease"
                      }} />
                    </div>
                    <div style={{
                      fontSize: "0.75rem",
                      color: "#94a3b8",
                      marginTop: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <FaCheckCircle /> 
                      {password.length >= 6 
                        ? "Мінімальна довжина досягнута" 
                        : "Потрібно щонайменше 6 символів"}
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: confirmPasswordError ? "#ef4444" : (password === confirmPassword && confirmPassword.length > 0 ? "#10b981" : "#4f46e5"),
                      fontSize: "1.2rem",
                      zIndex: 1
                    }}>
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      placeholder="Підтвердження пароля"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        padding: "16px 16px 16px 50px",
                        borderRadius: "12px",
                        border: confirmPasswordError ? "1px solid #ef4444" : (password === confirmPassword && confirmPassword.length > 0 ? "1px solid #10b981" : "1px solid #e2e8f0"),
                        background: "white",
                        color: "#1e293b",
                        fontSize: "1rem",
                        width: "100%",
                        boxSizing: "border-box",
                        outline: "none",
                        transition: "all 0.3s"
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = confirmPasswordError ? "#ef4444" : (password === confirmPassword && confirmPassword.length > 0 ? "#10b981" : "#4f46e5");
                        e.currentTarget.style.boxShadow = confirmPasswordError ? "0 0 0 3px rgba(239, 68, 68, 0.1)" : (password === confirmPassword && confirmPassword.length > 0 ? "0 0 0 3px rgba(16, 185, 129, 0.1)" : "0 0 0 3px rgba(79, 70, 229, 0.1)");
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = confirmPasswordError ? "#ef4444" : (password === confirmPassword && confirmPassword.length > 0 ? "#10b981" : "#e2e8f0");
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {password === confirmPassword && confirmPassword.length > 0 && !confirmPasswordError && (
                      <div style={{
                        position: "absolute",
                        right: "16px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#10b981",
                        animation: "scaleIn 0.3s ease-out"
                      }}>
                        <FaCheckCircle />
                      </div>
                    )}
                  </div>
                  {confirmPasswordError && (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#ef4444",
                      fontSize: "0.85rem",
                      marginTop: "6px",
                      marginLeft: "4px"
                    }}>
                      <FaExclamationTriangle /> {confirmPasswordError}
                    </div>
                  )}
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
                    <FaExclamationTriangle /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !!nameError || !!emailError || !!passwordError || !!confirmPasswordError}
                  style={{
                    padding: "18px 0",
                    borderRadius: "12px",
                    background: isLoading || nameError || emailError || passwordError || confirmPasswordError
                      ? "#cbd5e1" 
                      : "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    border: "none",
                    cursor: isLoading || nameError || emailError || passwordError || confirmPasswordError ? "not-allowed" : "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.2)",
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    marginTop: "10px"
                  }}
                  onMouseOver={e => {
                    if (!isLoading && !nameError && !emailError && !passwordError && !confirmPasswordError) {
                      e.currentTarget.style.boxShadow = "0 12px 25px rgba(79, 70, 229, 0.3)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={e => {
                    if (!isLoading && !nameError && !emailError && !passwordError && !confirmPasswordError) {
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>
                    {isLoading ? (
                      <>
                        <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚡</span> Створення...
                      </>
                    ) : (
                      <>
                        Створити акаунт <FaArrowRight style={{ marginLeft: "10px" }} />
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
                marginTop: "30px",
                textAlign: "center",
                color: "#64748b",
                paddingTop: "25px",
                borderTop: "1px solid #f1f5f9"
              }}>
                <p style={{ marginBottom: "20px", fontSize: "0.95rem" }}>
                  Вже маєте акаунт?{' '}
                  <span 
                    onClick={() => navigate("/login")}
                    style={{
                      color: "#8b5cf6",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "all 0.2s",
                      padding: "4px 8px",
                      borderRadius: "4px"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Увійти в систему
                  </span>
                </p>
                <p style={{ 
                  fontSize: "0.8rem", 
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  Натискаючи "Створити акаунт", ви погоджуєтесь з нашими{' '}
                  <Link to="/terms" style={{ color: "#8b5cf6", cursor: "pointer", textDecoration: "none" }}>Умовами використання</Link>{' '}
                  та <Link to="/privacy" style={{ color: "#8b5cf6", cursor: "pointer", textDecoration: "none" }}>Політикою конфіденційності</Link>.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              color: "#94a3b8",
              fontSize: "0.85rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <FaShieldAlt /> Безпечно
              </div>
              <div style={{ width: "4px", height: "4px", background: "currentColor", borderRadius: "50%" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <FaCheckCircle /> Шифрування
              </div>
              <div style={{ width: "4px", height: "4px", background: "currentColor", borderRadius: "50%" }} />
              <div>Без спаму</div>
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

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: translateY(-50%) scale(0.5);
            }
            to {
              opacity: 1;
              transform: translateY(-50%) scale(1);
            }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }

          ::placeholder {
            color: #94a3b8;
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-text-fill-color: #1e293b;
            -webkit-box-shadow: 0 0 0px 1000px white inset;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}
      </style>
    </div>
  )
}