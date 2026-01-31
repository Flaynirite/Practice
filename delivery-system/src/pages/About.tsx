// src/pages/About.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"
import { FaUsers, FaGlobe, FaAward, FaHistory } from "react-icons/fa"

export default function About() {
  const { user } = useAuth()

  const Content = (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "40px auto", 
      padding: "0 20px",
      width: "100%"
    }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ 
          fontSize: "3rem", 
          color: "#1e293b", 
          marginBottom: "20px",
          background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Про DeliveryCo
        </h1>
        <p style={{ 
          color: "#64748b", 
          fontSize: "1.2rem", 
          maxWidth: "700px", 
          margin: "0 auto", 
          lineHeight: 1.6 
        }}>
          Ми створюємо майбутнє міжнародної логістики, роблячи доставку простою та доступною для кожного.
        </p>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "30px", 
        marginBottom: "60px" 
      }}>
        <div style={{ 
          padding: "30px", 
          background: "white", 
          borderRadius: "20px", 
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)", 
          textAlign: "center",
          transition: "all 0.3s",
          border: "1px solid #f1f5f9"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #eef2ff, #c7d2fe)", 
            borderRadius: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 25px", 
            color: "#4f46e5" 
          }}>
            <FaHistory size={32} />
          </div>
          <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>Наша історія</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Заснована у 2018 році, DeliveryCo пройшла шлях від невеликого стартапу до провідного логістичного оператора.</p>
        </div>
        
        <div style={{ 
          padding: "30px", 
          background: "white", 
          borderRadius: "20px", 
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)", 
          textAlign: "center",
          transition: "all 0.3s",
          border: "1px solid #f1f5f9"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #f0fdf4, #bbf7d0)", 
            borderRadius: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 25px", 
            color: "#10b981" 
          }}>
            <FaGlobe size={32} />
          </div>
          <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>Глобальне охоплення</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Ми працюємо у понад 150 країнах світу, з'єднуючи людей та бізнеси незалежно від відстаней.</p>
        </div>
        
        <div style={{ 
          padding: "30px", 
          background: "white", 
          borderRadius: "20px", 
          boxShadow: "0 8px 25px rgba(0,0,0,0.05)", 
          textAlign: "center",
          transition: "all 0.3s",
          border: "1px solid #f1f5f9"
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.05)";
        }}>
          <div style={{ 
            width: "80px", 
            height: "80px", 
            background: "linear-gradient(135deg, #fffbeb, #fde68a)", 
            borderRadius: "20px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 25px", 
            color: "#f59e0b" 
          }}>
            <FaAward size={32} />
          </div>
          <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>Якість та довіра</h3>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>Понад 100,000 задоволених клієнтів довіряють нам свої найцінніші відправлення щороку.</p>
        </div>
      </div>

      <div style={{ 
        background: "white", 
        borderRadius: "20px", 
        padding: "50px", 
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)", 
        display: "flex", 
        gap: "50px", 
        alignItems: "center", 
        flexWrap: "wrap",
        border: "1px solid #f1f5f9"
      }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2 style={{ 
            marginBottom: "20px", 
            color: "#1e293b",
            fontSize: "2rem"
          }}>
            Наша місія
          </h2>
          <p style={{ 
            color: "#475569", 
            lineHeight: 1.7, 
            fontSize: "1.1rem", 
            marginBottom: "30px" 
          }}>
            Місія DeliveryCo полягає в усуненні бар'єрів для міжнародної торгівлі та особистих відправлень. 
            Ми віримо, що логістика повинна бути прозорою, технологічною та екологічною.
          </p>
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#4f46e5" }}>10M+</div>
              <div style={{ color: "#64748b" }}>Посилок доставлено</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#4f46e5" }}>500+</div>
              <div style={{ color: "#64748b" }}>Працівників</div>
            </div>
            <div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color: "#4f46e5" }}>150+</div>
              <div style={{ color: "#64748b" }}>Країн</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <img 
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Team" 
            style={{ 
              width: "100%", 
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }} 
          />
        </div>
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