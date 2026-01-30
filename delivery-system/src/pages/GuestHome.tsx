// src/pages/GuestHome.tsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  FaTruck, FaBoxOpen, FaClock, FaInfoCircle, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaGlobe, FaShieldAlt, FaCreditCard, FaHeadset, FaStar, FaArrowRight,
  FaUsers, FaChartLine, FaAward, FaShippingFast, FaCheckCircle, FaTag,
  FaFileInvoiceDollar, FaQuestionCircle
} from "react-icons/fa"
import GuestHeader from "../components/GuestHeader"

const placeholderImg = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
const deliveryImg = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
const trackingImg = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"

export default function GuestHome() {
  const [stats, setStats] = useState({
    deliveries: 12500,
    countries: 150,
    satisfaction: 98.5,
    partners: 45
  })

  // Переваги сервісу
  const features = [
    {
      icon: <FaShippingFast size={40} />,
      title: "Швидка доставка",
      description: "Експрес-доставка по всьому світу за 3-7 днів",
      gradient: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
      stats: "3-7 днів"
    },
    {
      icon: <FaGlobe size={40} />,
      title: "Міжнародна доставка",
      description: "Доставляємо в понад 150 країн світу",
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      stats: "150+ країн"
    },
    {
      icon: <FaShieldAlt size={40} />,
      title: "Гарантія безпеки",
      description: "Страхування вантажу та гарантія збереження",
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      stats: "100% гарантія"
    },
    {
      icon: <FaFileInvoiceDollar size={40} />,
      title: "Прозорі ціни",
      description: "Фіксовані тарифи без прихованих платежів",
      gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
      stats: "0 прихованих"
    }
  ]

  // Як це працює
  const howItWorks = [
    {
      step: "1",
      title: "Створіть замовлення",
      description: "Зареєструйтесь та додайте деталі вашої відправки",
      icon: <FaBoxOpen />
    },
    {
      step: "2",
      title: "Виберіть спосіб доставки",
      description: "Оберіть оптимальний варіант доставки",
      icon: <FaTruck />
    },
    {
      step: "3",
      title: "Слідкуйте онлайн",
      description: "Відстежуйте статус доставки в реальному часі",
      icon: <FaClock />
    },
    {
      step: "4",
      title: "Отримайте посилку",
      description: "Отримайте вашу посилку в пункті видачі",
      icon: <FaCheckCircle />
    }
  ]

  // Відгуки
  const testimonials = [
    {
      name: "Андрій Коваль",
      role: "Малий бізнес",
      text: "DeliveryCo допомагає мені з доставкою товарів з Китаю вже 2 роки. Надійно, швидко та без зайвих питань.",
      rating: 5
    },
    {
      name: "Олена Петренко",
      role: "Фрілансер",
      text: "Часто отримую посилки від клієнтів з Європи. Завжди знаю, де моя посилка та коли прибуде.",
      rating: 5
    },
    {
      name: "Михайло Сидоренко",
      role: "Інтернет-магазин",
      text: "Оптимізували логістику завдяки DeliveryCo. Тепер доставляємо в 3 рази швидше за ту саму ціну.",
      rating: 4
    }
  ]

  return (
    <div style={{ 
      fontFamily: "Inter, sans-serif"
    }}>
      <GuestHeader />

      {/* Hero секція */}
      <section style={{
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
        color: "white",
        textAlign: "center",
        padding: "80px 20px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          background: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "moveGlow 10s linear infinite alternate"
        }}/>

        <div style={{ 
          maxWidth: "800px", 
          position: "relative", 
          zIndex: 1,
          padding: "40px 0"
        }}>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: 700,
            marginBottom: "25px",
            lineHeight: "1.2"
          }}>
            Доставка без турбот по всьому світу
          </h1>
          <p style={{
            fontSize: "1.3rem",
            marginBottom: "40px",
            opacity: 0.9,
            lineHeight: "1.6"
          }}>
            Ваш надійний партнер у міжнародній доставці. Створюйте замовлення, відслідковуйте статуси та керуйте доставкою в одному місці.
          </p>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/login">
              <button style={{
                padding: "16px 36px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "white",
                color: "#4f46e5",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseOver={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(-6px)";
                btn.style.boxShadow = "0 12px 25px rgba(0,0,0,0.3)";
              }}
              onMouseOut={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(0)";
                btn.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
              }}
              >
                Почати роботу
                <FaArrowRight />
              </button>
            </Link>

            <Link to="/create-account">
              <button style={{
                padding: "16px 36px",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "transparent",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
              onMouseOver={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "rgba(255,255,255,0.1)";
                btn.style.transform = "translateY(-6px)";
              }}
              onMouseOut={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "transparent";
                btn.style.transform = "translateY(0)";
              }}
              >
                Створити акаунт
                <FaArrowRight />
              </button>
            </Link>
          </div>
        </div>

        <div style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "50%",
          filter: "blur(40px)"
        }}/>

        <style>
          {`@keyframes moveGlow {
            0% {transform: translate(0,0);}
            50% {transform: translate(40px,20px);}
            100% {transform: translate(0,0);}
          }`}
        </style>
      </section>

      {/* Статистика */}
      <section style={{
        padding: "60px 20px",
        background: "#f8fafc",
        position: "relative",
        marginTop: "-50px",
        zIndex: 2
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          position: "relative",
          zIndex: 1
        }}>
          {[
            { 
              icon: <FaTruck size={32} />, 
              value: `${stats.deliveries.toLocaleString()}+`, 
              label: "Успішних доставок",
              color: "#4f46e5"
            },
            { 
              icon: <FaGlobe size={32} />, 
              value: `${stats.countries}+`, 
              label: "Країн доставки",
              color: "#10b981"
            },
            { 
              icon: <FaStar size={32} />, 
              value: `${stats.satisfaction}%`, 
              label: "Задоволених клієнтів",
              color: "#f59e0b"
            },
            { 
              icon: <FaUsers size={32} />, 
              value: `${stats.partners}+`, 
              label: "Партнерів-перевізників",
              color: "#8b5cf6"
            }
          ].map((stat, index) => (
            <div key={index} style={{
              background: "white",
              padding: "35px 25px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              textAlign: "center",
              transition: "all 0.3s",
              border: "1px solid #f1f5f9"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
            }}>
              <div style={{
                width: "70px",
                height: "70px",
                background: `${stat.color}15`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: stat.color
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "10px"
              }}>
                {stat.value}
              </div>
              <div style={{
                color: "#64748b",
                fontSize: "1rem"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Як це працює */}
      <section style={{ padding: "100px 20px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "20px" }}>
              Як це працює?
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>
              Простий процес від створення замовлення до отримання посилки
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            position: "relative"
          }}>
            {howItWorks.map((step, index) => (
              <div key={index} style={{
                background: "#f8fafc",
                padding: "35px 30px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                position: "relative",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}>
                <div style={{
                  position: "absolute",
                  top: "-20px",
                  left: "30px",
                  width: "45px",
                  height: "45px",
                  background: "#4f46e5",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem"
                }}>
                  {step.step}
                </div>
                
                <div style={{
                  marginTop: "15px",
                  marginBottom: "25px",
                  color: "#4f46e5",
                  fontSize: "2rem"
                }}>
                  {step.icon}
                </div>
                
                <h3 style={{
                  fontSize: "1.4rem",
                  color: "#1e293b",
                  marginBottom: "15px"
                }}>
                  {step.title}
                </h3>
                
                <p style={{ color: "#64748b", lineHeight: "1.6" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Переваги сервісу */}
      <section style={{ padding: "100px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "20px" }}>
              Наші переваги
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>
              Все, що потрібно для швидкої та безпечної доставки
            </p>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
            gap: "30px" 
          }}>
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  background: "white",
                  padding: "35px 30px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid #f1f5f9"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
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
                    marginBottom: "25px",
                    color: "#4f46e5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "70px",
                    height: "70px",
                    background: "#f8fafc",
                    borderRadius: "16px"
                  }}>
                    {feature.icon}
                  </div>
                  
                  <h3 style={{ 
                    fontSize: "1.4rem", 
                    color: "#1e293b", 
                    marginBottom: "15px" 
                  }}>
                    {feature.title}
                  </h3>
                  
                  <p style={{ 
                    color: "#64748b", 
                    lineHeight: "1.6",
                    marginBottom: "25px",
                    flex: 1
                  }}>
                    {feature.description}
                  </p>
                  
                  <div style={{
                    padding: "8px 16px",
                    background: "#f1f5f9",
                    borderRadius: "20px",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "0.9rem"
                  }}>
                    {feature.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Про нас */}
      <section style={{ padding: "100px 20px", background: "white" }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "60px",
          alignItems: "center"
        }}>
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "15px", 
              marginBottom: "25px" 
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem"
              }}>
                <FaInfoCircle />
              </div>
              <h2 style={{ fontSize: "2.5rem", color: "#1e293b" }}>Про нас</h2>
            </div>
            
            <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: "1.7", marginBottom: "25px" }}>
              <strong>DeliveryCo</strong> – це ваш надійний партнер у міжнародній доставці з 2018 року. 
              Ми спеціалізуємося на швидкій та безпечній доставці посилок по всьому світу.
            </p>
            
            <p style={{ fontSize: "1.1rem", color: "#475569", lineHeight: "1.7", marginBottom: "25px" }}>
              Наша місія – зробити міжнародну доставку максимально простою, прозорою та доступною 
              для кожного, незалежно від розміру бізнесу чи особистих потреб.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginTop: "40px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                  <FaAward style={{ color: "#4f46e5" }} />
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>Перевірені перевізники</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                  Працюємо тільки з надійними логістичними партнерами
                </p>
              </div>
              
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                  <FaChartLine style={{ color: "#4f46e5" }} />
                  <span style={{ fontWeight: "600", color: "#1e293b" }}>Прозорість</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                  Повний контроль над кожним етапом доставки
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src={deliveryImg} 
              alt="Доставка" 
              style={{ 
                borderRadius: "20px", 
                width: "100%", 
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: "transform 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            />
          </div>
        </div>
      </section>

      {/* Відгуки */}
      <section style={{ padding: "100px 20px", background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "20px" }}>
              Що кажуть наші клієнти
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>
              Тисячі задоволених клієнтів довіряють нам свою доставку
            </p>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "30px" 
          }}>
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                style={{
                  background: "white",
                  padding: "35px 30px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
                  transition: "all 0.3s",
                  border: "1px solid #f1f5f9"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                  <div style={{
                    width: "60px",
                    height: "60px",
                    background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "1.1rem" }}>
                      {testimonial.name}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  gap: "5px", 
                  marginBottom: "20px",
                  color: "#f59e0b"
                }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={i < testimonial.rating ? "1em" : "1em"} 
                      color={i < testimonial.rating ? "#f59e0b" : "#e2e8f0"} />
                  ))}
                </div>
                
                <p style={{ color: "#475569", lineHeight: "1.7", fontStyle: "italic" }}>
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Почати роботу */}
      <section style={{ 
        padding: "100px 20px", 
        background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.8rem", marginBottom: "25px" }}>
            Готові розпочати?
          </h2>
          <p style={{ fontSize: "1.3rem", marginBottom: "40px", opacity: 0.9, lineHeight: "1.6" }}>
            Приєднуйтесь до тисячі клієнтів, які довіряють нам свою доставку.
            Створіть акаунт за хвилину та отримайте доступ до всіх можливостей.
          </p>
          
          <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/create-account">
              <button style={{
                padding: "18px 40px",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontWeight: 600,
                background: "white",
                color: "#4f46e5",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
              onMouseOver={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(-8px)";
                btn.style.boxShadow = "0 15px 30px rgba(0,0,0,0.3)";
              }}
              onMouseOut={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.transform = "translateY(0)";
                btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
              }}
              >
                Створити безкоштовний акаунт
                <FaArrowRight />
              </button>
            </Link>
            
            <Link to="/login">
              <button style={{
                padding: "18px 40px",
                borderRadius: "12px",
                fontSize: "1.2rem",
                fontWeight: 600,
                background: "transparent",
                color: "white",
                border: "2px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
              onMouseOver={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "rgba(255,255,255,0.1)";
                btn.style.transform = "translateY(-8px)";
              }}
              onMouseOut={e => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = "transparent";
                btn.style.transform = "translateY(0)";
              }}
              >
                Увійти в акаунт
                <FaArrowRight />
              </button>
            </Link>
          </div>
          
          <div style={{ 
            marginTop: "60px", 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "30px",
            paddingTop: "40px",
            borderTop: "1px solid rgba(255,255,255,0.1)"
          }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>24/7</div>
              <div style={{ opacity: 0.8 }}>Підтримка</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>0₴</div>
              <div style={{ opacity: 0.8 }}>За реєстрацію</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "10px" }}>30 днів</div>
              <div style={{ opacity: 0.8 }}>Безкоштовного тесту</div>
            </div>
          </div>
        </div>
      </section>

      {/* Контакти */}
      <section style={{ padding: "80px 20px", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "50px", textAlign: "center" }}>
            Контактна інформація
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "30px" 
          }}>
            <div style={{
              background: "white",
              padding: "35px 30px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "rgba(79, 70, 229, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                color: "#4f46e5",
                fontSize: "1.5rem"
              }}>
                <FaPhone />
              </div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "15px" }}>Телефон</h3>
              <p style={{ color: "#475569", fontSize: "1.1rem" }}>+38 (099) 123-45-67</p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "10px" }}>Пн-Пт: 9:00-18:00</p>
            </div>
            
            <div style={{
              background: "white",
              padding: "35px 30px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "rgba(16, 185, 129, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                color: "#10b981",
                fontSize: "1.5rem"
              }}>
                <FaEnvelope />
              </div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "15px" }}>Email</h3>
              <p style={{ color: "#475569", fontSize: "1.1rem" }}>support@deliveryco.com</p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "10px" }}>Відповідаємо протягом 24 годин</p>
            </div>
            
            <div style={{
              background: "white",
              padding: "35px 30px",
              borderRadius: "16px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <div style={{
                width: "60px",
                height: "60px",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 25px",
                color: "#f59e0b",
                fontSize: "1.5rem"
              }}>
                <FaMapMarkerAlt />
              </div>
              <h3 style={{ fontSize: "1.3rem", color: "#1e293b", marginBottom: "15px" }}>Адреса</h3>
              <p style={{ color: "#475569", fontSize: "1.1rem" }}>м. Київ, вул. Доставкова, 123</p>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "10px" }}>Офіс працює з 9:00 до 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "60px 20px 40px",
        background: "#1e1e2f",
        color: "white"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "40px",
            marginBottom: "40px" 
          }}>
            <div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "white" }}>DeliveryCo</h3>
              <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
                Ваш надійний партнер у міжнародній доставці з 2018 року. 
                Швидко, безпечно та якісно.
              </p>
            </div>
            
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "white" }}>Послуги</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Міжнародна доставка</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Відстеження посилок</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Страхування вантажу</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Консолідація відправлень</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "white" }}>Компанія</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Про нас</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Блог</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Кар'єра</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Контакти</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "white" }}>Довідка</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Допомога</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>FAQ</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Політика конфіденційності</Link></li>
                <li><Link to="#" style={{ color: "#94a3b8", textDecoration: "none" }}>Умови використання</Link></li>
              </ul>
            </div>
          </div>
          
          <div style={{ 
            borderTop: "1px solid rgba(255,255,255,0.1)", 
            paddingTop: "30px",
            textAlign: "center",
            color: "#94a3b8",
            fontSize: "0.9rem"
          }}>
            <p style={{ marginBottom: "10px" }}>© 2026 DeliveryCo. Всі права захищені.</p>
            <p>Міжнародна служба доставки посилок по всьому світу</p>
          </div>
        </div>
      </footer>
    </div>
  )
}