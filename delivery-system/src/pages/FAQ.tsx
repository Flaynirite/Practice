// src/pages/FAQ.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import Footer from "../components/Footer"
import { useAuth } from "../contexts/AuthContext"
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaHeadset } from "react-icons/fa"
import { useState } from "react"

const faqs = [
  {
    q: "Як довго триває доставка?",
    a: "Зазвичай доставка триває від 3 до 7 робочих днів для експрес-відправлень по Європі та 7-14 днів для міжнародних відправлень з США чи Азії."
  },
  {
    q: "Чи застраховані посилки?",
    a: "Так, всі посилки автоматично страхуються на суму до 1000 грн. Ви можете обрати додаткове страхування при оформленні замовлення для дорожчих товарів."
  },
  {
    q: "Як я можу оплатити послуги?",
    a: "Ми приймаємо оплату банківськими картами (Visa/Mastercard), Apple Pay, Google Pay, а також оплату за реквізитами для бізнес-клієнтів."
  },
  {
    q: "Які товари заборонено пересилати?",
    a: "Заборонено пересилати небезпечні речовини, зброю, наркотичні засоби, швидкопсувні продукти харчування та предмети, що вимагають спеціальних дозволів."
  },
  {
    q: "Що робити, якщо посилка пошкоджена?",
    a: "У разі виявлення пошкоджень при отриманні, складіть акт разом з кур'єром або представником пункту видачі та зверніться до нашої служби підтримки протягом 24 годин."
  }
]

export default function FAQ() {
  const { user } = useAuth()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const Content = (
    <div style={{ 
      maxWidth: "800px", 
      margin: "40px auto", 
      padding: "0 20px",
      width: "100%"
    }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          color: "#1e293b", 
          marginBottom: "15px",
          background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Часті запитання (FAQ)
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Знайдіть відповіді на найпопулярніші запитання про наші послуги</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "50px" }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ 
            background: "white", 
            borderRadius: "16px", 
            border: "1px solid #f1f5f9", 
            overflow: "hidden",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
            transition: "all 0.3s"
          }}>
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ 
                width: "100%", 
                padding: "25px 30px", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                textAlign: "left",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#f8fafc";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #eef2ff, #c7d2fe)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#4f46e5"
                }}>
                  <FaQuestionCircle />
                </div>
                <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>{faq.q}</span>
              </div>
              {openIndex === index ? <FaChevronUp color="#4f46e5" /> : <FaChevronDown color="#94a3b8" />}
            </button>
            {openIndex === index && (
              <div style={{ 
                padding: "0 30px 30px 85px", 
                color: "#475569", 
                lineHeight: 1.7,
                fontSize: "1.05rem",
                borderTop: "1px solid #f1f5f9"
              }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: "50px", 
        textAlign: "center", 
        padding: "50px 40px", 
        background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(79, 70, 229, 0.2)",
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
        
        <FaHeadset size={60} color="white" style={{ marginBottom: "20px", position: "relative", zIndex: 1 }} />
        <h3 style={{ 
          marginBottom: "15px", 
          color: "white",
          fontSize: "1.8rem",
          position: "relative",
          zIndex: 1
        }}>
          Не знайшли відповідь?
        </h3>
        <p style={{ 
          color: "rgba(255,255,255,0.9)", 
          marginBottom: "30px",
          fontSize: "1.1rem",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
          zIndex: 1
        }}>
          Зв'яжіться з нашою службою підтримки, і ми з радістю вам допоможемо.
        </p>
        <button style={{ 
          padding: "15px 30px", 
          background: "white", 
          color: "#4f46e5", 
          border: "none", 
          borderRadius: "12px", 
          fontWeight: 600, 
          cursor: "pointer",
          fontSize: "1rem",
          transition: "all 0.3s",
          position: "relative",
          zIndex: 1
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}>
          Написати нам
        </button>
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