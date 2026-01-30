// src/components/OrderProgressWidget.tsx
import { 
  FaBox, 
  FaCheck, 
  FaTruck, 
  FaShippingFast, 
  FaHome,
  FaClock,
  FaCheckCircle
} from "react-icons/fa"

interface OrderProgressWidgetProps {
  order: any;
}

export default function OrderProgressWidget({ order }: OrderProgressWidgetProps) {
  const getProgressSteps = (status: string) => {
    const allSteps = [
      { id: 1, label: "Замовлення створено", icon: <FaBox />, status: "completed" },
      { id: 2, label: "Прийнято в обробку", icon: <FaCheck />, status: "pending" },
      { id: 3, label: "Відправлено зі складу", icon: <FaTruck />, status: "pending" },
      { id: 4, label: "В дорозі", icon: <FaShippingFast />, status: "pending" },
      { id: 5, label: "Доставлено", icon: <FaHome />, status: "pending" }
    ]

    let activeStep = 1
    
    switch(status) {
      case "Створено":
        activeStep = 1
        break
      case "В обробці":
        activeStep = 2
        break
      case "Доставлено":
        activeStep = 5
        break
      default:
        activeStep = 1
    }

    return allSteps.map(step => ({
      ...step,
      status: step.id < activeStep ? "completed" : 
              step.id === activeStep ? "active" : "pending"
    }))
  }

  const steps = getProgressSteps(order.status)
  const progressPercentage = ((steps.findIndex(s => s.status === "active") + 1) / steps.length) * 100

  return (
    <div>
      {/* Прогрес бар */}
      <div style={{
        height: "8px",
        background: "#e2e8f0",
        borderRadius: "4px",
        margin: "30px 0 40px",
        position: "relative"
      }}>
        <div style={{
          width: `${progressPercentage}%`,
          height: "100%",
          background: "linear-gradient(to right, #4f46e5, #8b5cf6)",
          borderRadius: "4px",
          transition: "width 0.5s ease"
        }} />
        
        {/* Маркери кроків */}
        {steps.map(step => (
          <div
            key={step.id}
            style={{
              position: "absolute",
              left: `${((step.id - 1) / (steps.length - 1)) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: step.status === "completed" ? "#4f46e5" :
                        step.status === "active" ? "#8b5cf6" : "#e2e8f0",
              border: "4px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 2
            }}
            title={step.label}
          >
            {step.status === "completed" ? <FaCheckCircle /> : step.icon}
          </div>
        ))}
      </div>

      {/* Лейбли кроків */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
        marginTop: "15px"
      }}>
        {steps.map(step => (
          <div key={step.id} style={{ textAlign: "center", padding: "0 5px" }}>
            <div style={{
              fontSize: "0.8rem",
              color: step.status === "completed" ? "#4f46e5" :
                     step.status === "active" ? "#8b5cf6" : "#94a3b8",
              fontWeight: step.status === "active" ? "600" : "400",
              marginBottom: "5px",
              minHeight: "40px"
            }}>
              {step.label}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}>
              {step.status === "completed" && <FaCheckCircle style={{ color: "#10b981" }} />}
              {step.status === "completed" ? "Виконано" : "Очікується"}
            </div>
          </div>
        ))}
      </div>

      {/* Статус та очікувана дата */}
      <div style={{
        marginTop: "30px",
        padding: "20px",
        background: "#f8fafc",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>
            Поточний статус
          </div>
          <div style={{ 
            fontSize: "1.1rem", 
            fontWeight: "600", 
            color: "#1e293b",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            {order.status === "Створено" && <FaBox style={{ color: "#f59e0b" }} />}
            {order.status === "В обробці" && <FaClock style={{ color: "#3b82f6" }} />}
            {order.status === "Доставлено" && <FaCheckCircle style={{ color: "#10b981" }} />}
            {order.status}
          </div>
        </div>

        <div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "5px" }}>
            Очікувана доставка
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1e293b" }}>
            {(() => {
              const deliveryDate = new Date(order.createdAt)
              deliveryDate.setDate(deliveryDate.getDate() + 14)
              return deliveryDate.toLocaleDateString('uk-UA')
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}