// src/pages/FAQ.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa"
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
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Часті запитання (FAQ)</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Знайдіть відповіді на найпопулярніші запитання про наші послуги</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {faqs.map((faq, index) => (
          <div key={index} style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <button 
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{ width: "100%", padding: "20px 25px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
            >
              <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b" }}>{faq.q}</span>
              {openIndex === index ? <FaChevronUp color="#4f46e5" /> : <FaChevronDown color="#94a3b8" />}
            </button>
            {openIndex === index && (
              <div style={{ padding: "0 25px 25px", color: "#475569", lineHeight: 1.6 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "50px", textAlign: "center", padding: "40px", background: "#f0f9ff", borderRadius: "20px", border: "1px solid #bae6fd" }}>
        <FaQuestionCircle size={40} color="#4f46e5" style={{ marginBottom: "15px" }} />
        <h3 style={{ marginBottom: "10px" }}>Не знайшли відповідь?</h3>
        <p style={{ color: "#475569", marginBottom: "20px" }}>Зв'яжіться з нашою службою підтримки, і ми з радістю вам допоможемо.</p>
        <button style={{ padding: "12px 24px", background: "#4f46e5", color: "white", border: "none", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}>
          Написати нам
        </button>
      </div>
    </div>
  )

  return user ? <Layout>{Content}</Layout> : (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GuestHeader />
      {Content}
    </div>
  )
}
