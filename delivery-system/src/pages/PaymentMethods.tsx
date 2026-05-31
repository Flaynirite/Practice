// src/pages/PaymentMethods.tsx
import { useState } from "react"
import Layout from "../components/Layout"
import { 
  FaCreditCard, 
  FaLock, 
  FaUser, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaPlus,
  FaShieldAlt
} from "react-icons/fa"

export default function PaymentMethods() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [message, setMessage] = useState({ text: "", type: "" })
  const [isLoading, setIsLoading] = useState(false)

  // Форматування номера картки (0000 0000 0000 0000)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 16) {
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ")
      setCardNumber(formattedValue)
    }
  }

  // Форматування дати (MM/YY)
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      let formattedValue = value
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + "/" + value.slice(2)
      }
      setExpiryDate(formattedValue)
    }
  }

  // CVV (3-4 цифри)
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Проста валідація
    if (cardNumber.replace(/\s/g, "").length < 16) {
      setMessage({ text: "Номер картки має містити 16 цифр", type: "error" })
      return
    }
    if (expiryDate.length < 5) {
      setMessage({ text: "Невірний формат дати", type: "error" })
      return
    }
    if (cvv.length < 3) {
      setMessage({ text: "Невірний CVV", type: "error" })
      return
    }
    if (!cardHolder.trim()) {
      setMessage({ text: "Введіть ім'я власника картки", type: "error" })
      return
    }

    setIsLoading(true)
    
    // Симуляція збереження
    setTimeout(() => {
      setMessage({ text: "Платіжний метод успішно додано (демо)! Жодні кошти не будуть зняті.", type: "success" })
      setIsLoading(false)
      // Очищення форми
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setCardHolder("")
    }, 1500)
  }

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px" 
        }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "5px" }}>
              Платіжні методи
            </h1>
            <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
              Керуйте вашими картками для зручної оплати замовлень
            </p>
          </div>
        </div>

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
            gap: "10px",
            animation: "slideDown 0.3s ease-out"
          }}>
            {message.type === "success" ? <FaCheckCircle /> : <FaShieldAlt />}
            <span>{message.text}</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", flexWrap: "wrap" }}>
          {/* Форма */}
          <div style={{ 
            background: "white", 
            borderRadius: "20px", 
            padding: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
            border: "1px solid #f1f5f9"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "25px", color: "#1e293b", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaPlus size={20} color="#4f46e5" />
              Додати нову картку
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569" }}>
                  <FaUser style={{ marginRight: "8px" }} /> Ім'я на картці
                </label>
                <input
                  type="text"
                  placeholder="IVAN IVANOV"
                  value={cardHolder}
                  onChange={e => setCardHolder(e.target.value.toUpperCase())}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569" }}>
                  <FaCreditCard style={{ marginRight: "8px" }} /> Номер картки
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  disabled={isLoading}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569" }}>
                    <FaCalendarAlt style={{ marginRight: "8px" }} /> Термін дії
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "#475569" }}>
                    <FaLock style={{ marginRight: "8px" }} /> CVV
                  </label>
                  <input
                    type="password"
                    placeholder="***"
                    value={cvv}
                    onChange={handleCvvChange}
                    disabled={isLoading}
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "10px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
                  color: "white",
                  fontWeight: 600,
                  border: "none",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.3s",
                  fontSize: "1rem",
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? "Обробка..." : "Зберегти картку"}
              </button>
            </form>
          </div>

          {/* Візуалізація картки та інформація */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Макет картки */}
            <div style={{
              height: "220px",
              background: "linear-gradient(135deg, #1e293b, #475569)",
              borderRadius: "20px",
              padding: "30px",
              color: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "150px",
                height: "150px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "50%"
              }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ 
                  width: "50px", 
                  height: "35px", 
                  background: "linear-gradient(135deg, #ffd700, #b8860b)", 
                  borderRadius: "6px" 
                }} />
                <FaCreditCard size={40} opacity={0.5} />
              </div>

              <div style={{ 
                fontSize: "1.5rem", 
                letterSpacing: "4px", 
                fontFamily: "'Courier New', monospace",
                margin: "20px 0"
              }}>
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.6, textTransform: "uppercase", marginBottom: "4px" }}>Власник</div>
                  <div style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "1px" }}>
                    {cardHolder || "IVAN IVANOV"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.6, textTransform: "uppercase", marginBottom: "4px" }}>Термін</div>
                  <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                    {expiryDate || "MM/YY"}
                  </div>
                </div>
              </div>
            </div>

            {/* Ваші картки (пусто для демо) */}
            <div style={{ 
              background: "#f8fafc", 
              borderRadius: "20px", 
              padding: "25px",
              border: "2px dashed #e2e8f0"
            }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#64748b" }}>Збережені картки</h3>
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0" }}>
                <FaCreditCard size={32} style={{ marginBottom: "10px", opacity: 0.5 }} />
                <p>У вас ще немає збережених карток</p>
              </div>
            </div>

            {/* Безпека */}
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "12px", 
              padding: "15px", 
              background: "#eff6ff", 
              borderRadius: "12px",
              color: "#1e40af",
              fontSize: "0.9rem"
            }}>
              <FaShieldAlt size={24} />
              <p style={{ margin: 0 }}>
                Ваші дані зашифровані та захищені за стандартом PCI DSS. Ми не зберігаємо повний номер вашої картки на наших серверах.
              </p>
            </div>
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
    </Layout>
  )
}

const inputStyle = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: "1rem",
  width: "100%",
  boxSizing: "border-box" as const,
  transition: "all 0.2s"
}
