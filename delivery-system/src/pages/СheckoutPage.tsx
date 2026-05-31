// src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { OrderService } from "../services/orderService";
import {
  FaCreditCard,
  FaShippingFast,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaCity,
  FaHome,
  FaLock,
  FaCalendarAlt,
  FaCheck,
  FaArrowLeft,
  FaReceipt,
  FaBox,
  FaGlobe,
  FaShieldAlt,
  FaCreditCard as FaCard,
  FaCheckCircle
} from "react-icons/fa";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  currency: string;
}

interface ShippingAddress {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  phone: string;
  fullName: string;
  email?: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Отримуємо дані з попередньої сторінки
  const { 
    orderData,
    country,
    deliveryTime,
    shippingCost,
    duties,
    itemsTotal,
    orderTotal 
  } = location.state || {};

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    country: country || "",
    city: "",
    street: "",
    postalCode: "",
    phone: "",
    fullName: user?.name || user?.email || "",
    email: user?.email || ""
  });

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    cardHolder: user?.name || "",
    expiryDate: "",
    cvv: "",
    saveCard: false
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderCreated, setOrderCreated] = useState(false);

  // Якщо немає даних замовлення, повертаємось назад
  useEffect(() => {
    if (!orderData) {
      navigate("/create-order");
    }
  }, [orderData, navigate]);

  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentChange = (field: keyof PaymentDetails, value: string | boolean) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    // Валідація адреси
    if (!shippingAddress.fullName.trim()) {
      setError("Введіть повне ім'я");
      return false;
    }
    
    if (!shippingAddress.city.trim()) {
      setError("Введіть місто доставки");
      return false;
    }
    
    if (!shippingAddress.street.trim()) {
      setError("Введіть вулицю та номер будинку");
      return false;
    }
    
    if (!shippingAddress.postalCode.trim()) {
      setError("Введіть поштовий індекс");
      return false;
    }
    
    if (!shippingAddress.phone.trim()) {
      setError("Введіть номер телефону");
      return false;
    }
    
    // Валідація платіжних даних
    if (paymentMethod === "credit_card") {
      if (!paymentDetails.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
        setError("Невірний номер картки (має бути 16 цифр)");
        return false;
      }
      
      if (!paymentDetails.cardHolder.trim()) {
        setError("Введіть ім'я власника картки");
        return false;
      }
      
      if (!paymentDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        setError("Невірний термін дії картки (формат: ММ/РР)");
        return false;
      }
      
      if (!paymentDetails.cvv.match(/^\d{3,4}$/)) {
        setError("Невірний CVV код");
        return false;
      }
    }
    
    return true;
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Створюємо остаточне замовлення з усіма даними
      const finalOrderData = {
        ...orderData,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === "credit_card" ? {
          cardLastFour: paymentDetails.cardNumber.slice(-4),
          cardType: paymentDetails.cardNumber.startsWith("4") ? "Visa" : 
                    paymentDetails.cardNumber.startsWith("5") ? "Mastercard" : "Other"
        } : null,
        paymentStatus: "paid" as const,
        status: "Оплачено" as const,
        paidAt: new Date().toISOString()
      };

      const createdOrder = OrderService.createOrder(finalOrderData);
      
      setSuccess("✅ Замовлення успішно оформлено та оплачено!");
      setOrderCreated(true);
      
      // Перенаправляємо на dashboard через 2 секунди
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error('Помилка оформлення замовлення:', err);
      setError("Помилка при обробці оплати. Спробуйте ще раз.");
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!orderData) {
    return null;
  }

  if (orderCreated) {
    return (
      <Layout showSidebar={false}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "70vh",
          flexDirection: "column",
          textAlign: "center",
          padding: "40px"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #34d399)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px"
          }}>
            <FaCheckCircle style={{ fontSize: "40px", color: "white" }} />
          </div>
          
          <h1 style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "15px"
          }}>
            Замовлення успішно оформлено! 🎉
          </h1>
          
          <p style={{
            fontSize: "1.1rem",
            color: "#64748b",
            maxWidth: "500px",
            lineHeight: "1.6",
            marginBottom: "30px"
          }}>
            Ваше замовлення №{Date.now().toString().slice(-6)} успішно оплачено.<br />
            Очікуйте інформацію про відправку на вашу електронну пошту.
          </p>
          
          <div style={{
            padding: "15px",
            background: "#f0f9ff",
            borderRadius: "10px",
            border: "1px solid #bae6fd",
            fontSize: "0.95rem",
            color: "#0369a1",
            maxWidth: "500px",
            marginBottom: "30px"
          }}>
            <FaShieldAlt style={{ marginRight: "8px" }} />
            <strong>Чек підтвердження</strong> буде надіслано на email: {user?.email}
          </div>
          
          <div style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px"
          }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "12px 30px",
                borderRadius: "8px",
                background: "#4f46e5",
                color: "white",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.2s"
              }}
            >
              Перейти до dashboard
            </button>
            
            <button
              onClick={() => navigate("/create-order")}
              style={{
                padding: "12px 30px",
                borderRadius: "8px",
                background: "white",
                color: "#475569",
                fontWeight: 500,
                border: "2px solid #e2e8f0",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.2s"
              }}
            >
              Створити нове замовлення
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div style={{ 
        maxWidth: "1000px", 
        margin: "0 auto", 
        padding: "20px",
        minHeight: "calc(100vh - 80px)"
      }}>
        {/* Хід оформлення */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "40px",
          gap: "10px"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              1
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#94a3b8" }}>Корзина</span>
          </div>
          
          <div style={{ width: "60px", height: "2px", background: "#e2e8f0" }}></div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4f46e5, #8b5cf6)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              2
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4f46e5" }}>Оформлення</span>
          </div>
          
          <div style={{ width: "60px", height: "2px", background: "#e2e8f0" }}></div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#f1f5f9",
              color: "#94a3b8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "0.9rem"
            }}>
              3
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#94a3b8" }}>Завершення</span>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 350px",
          gap: "30px"
        }}>
          {/* Ліва колонка - Форми */}
          <div>
            {error && (
              <div style={{
                padding: "15px",
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                color: "#dc2626",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.9rem"
              }}>
                <FaShieldAlt /> {error}
              </div>
            )}
            
            {success && (
              <div style={{
                padding: "15px",
                background: "#d1fae5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
                borderRadius: "8px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "0.9rem"
              }}>
                <FaCheck /> {success}
              </div>
            )}

            {/* Форма адреси доставки */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.1rem",
                color: "#1e293b",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaMapMarkerAlt color="#4f46e5" size={18} /> Адреса доставки
              </h3>
              
              <div style={{ display: "grid", gap: "15px" }}>
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                    color: "#475569",
                    fontSize: "0.85rem"
                  }}>
                    <FaUser style={{ marginRight: "6px" }} /> Повне ім'я *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange("fullName", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem",
                      transition: "border-color 0.3s"
                    }}
                    placeholder="Іван Іванов"
                  />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: 500,
                      color: "#475569",
                      fontSize: "0.85rem"
                    }}>
                      <FaCity style={{ marginRight: "6px" }} /> Місто *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.95rem"
                      }}
                      placeholder="Київ"
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: "block",
                      marginBottom: "6px",
                      fontWeight: 500,
                      color: "#475569",
                      fontSize: "0.85rem"
                    }}>
                      Поштовий індекс *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.postalCode}
                      onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.95rem"
                      }}
                      placeholder="01001"
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                    color: "#475569",
                    fontSize: "0.85rem"
                  }}>
                    <FaHome style={{ marginRight: "6px" }} /> Вулиця та номер будинку *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem"
                    }}
                    placeholder="вул. Хрещатик, 1"
                  />
                </div>
                
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: 500,
                    color: "#475569",
                    fontSize: "0.85rem"
                  }}>
                    <FaPhone style={{ marginRight: "6px" }} /> Телефон *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange("phone", e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.95rem"
                    }}
                    placeholder="+380 99 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* Форма оплати */}
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.1rem",
                color: "#1e293b",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaCreditCard color="#4f46e5" size={18} /> Спосіб оплати
              </h3>
              
              <div style={{ marginBottom: "20px" }}>
                <div style={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "20px"
                }}>
                  <button
                    onClick={() => setPaymentMethod("credit_card")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1.5px solid ${paymentMethod === "credit_card" ? "#4f46e5" : "#e2e8f0"}`,
                      background: paymentMethod === "credit_card" ? "#f0ebff" : "white",
                      color: paymentMethod === "credit_card" ? "#4f46e5" : "#475569",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontSize: "0.9rem"
                    }}
                  >
                    <FaCard /> Банківська картка
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: `1.5px solid ${paymentMethod === "paypal" ? "#4f46e5" : "#e2e8f0"}`,
                      background: paymentMethod === "paypal" ? "#f0ebff" : "white",
                      color: paymentMethod === "paypal" ? "#4f46e5" : "#475569",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontSize: "0.9rem"
                    }}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2504/2504801.png" 
                      alt="PayPal" 
                      style={{ width: "16px", height: "16px" }}
                    />
                    PayPal
                  </button>
                </div>
                
                {paymentMethod === "credit_card" && (
                  <div style={{ display: "grid", gap: "15px" }}>
                    <div>
                      <label style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: 500,
                        color: "#475569",
                        fontSize: "0.85rem"
                      }}>
                        Номер картки *
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          type="text"
                          value={formatCardNumber(paymentDetails.cardNumber)}
                          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                          maxLength={19}
                          style={{
                            width: "100%",
                            padding: "10px 12px 10px 40px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.95rem",
                            letterSpacing: "1px"
                          }}
                          placeholder="1234 5678 9012 3456"
                        />
                        <FaCreditCard style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "#94a3b8",
                          fontSize: "0.9rem"
                        }} />
                      </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: 500,
                          color: "#475569",
                          fontSize: "0.85rem"
                        }}>
                          <FaCalendarAlt style={{ marginRight: "6px" }} /> Термін дії *
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", formatExpiryDate(e.target.value))}
                          placeholder="ММ/РР"
                          maxLength={5}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.95rem"
                          }}
                        />
                      </div>
                      
                      <div>
                        <label style={{
                          display: "block",
                          marginBottom: "6px",
                          fontWeight: 500,
                          color: "#475569",
                          fontSize: "0.85rem"
                        }}>
                          <FaLock style={{ marginRight: "6px" }} /> CVV *
                        </label>
                        <input
                          type="password"
                          value={paymentDetails.cvv}
                          onChange={(e) => handlePaymentChange("cvv", e.target.value)}
                          maxLength={4}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "0.95rem"
                          }}
                          placeholder="123"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{
                        display: "block",
                        marginBottom: "6px",
                        fontWeight: 500,
                        color: "#475569",
                        fontSize: "0.85rem"
                      }}>
                        Ім'я власника картки *
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cardHolder}
                        onChange={(e) => handlePaymentChange("cardHolder", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "0.95rem"
                        }}
                        placeholder="IVAN IVANOV"
                      />
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "5px"
                    }}>
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={paymentDetails.saveCard}
                        onChange={(e) => handlePaymentChange("saveCard", e.target.checked)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <label htmlFor="saveCard" style={{
                        color: "#475569",
                        fontSize: "0.85rem",
                        cursor: "pointer"
                      }}>
                        Зберегти картку для майбутніх покупок
                      </label>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "paypal" && (
                  <div style={{
                    padding: "15px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <p style={{ marginBottom: "10px", color: "#475569", fontSize: "0.9rem" }}>
                      Ви будете перенаправлені на сторінку PayPal для завершення оплати
                    </p>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2504/2504801.png" 
                      alt="PayPal" 
                      style={{ width: "80px", margin: "0 auto" }}
                    />
                  </div>
                )}
              </div>
              
              <div style={{
                padding: "12px",
                background: "#f0f9ff",
                borderRadius: "8px",
                border: "1px solid #bae6fd",
                fontSize: "0.8rem",
                color: "#0369a1",
                display: "flex",
                alignItems: "flex-start",
                gap: "8px"
              }}>
                <FaShieldAlt style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Безпечна оплата:</strong> Всі транзакції захищені 256-бітним SSL шифруванням. 
                  Ми не зберігаємо дані вашої картки.
                </div>
              </div>
            </div>
          </div>

          {/* Права колонка - Підсумок замовлення */}
          <div>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
              position: "sticky",
              top: "20px"
            }}>
              <h3 style={{
                fontSize: "1.1rem",
                color: "#1e293b",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <FaReceipt color="#4f46e5" size={18} /> Підсумок замовлення
              </h3>
              
              {/* Товари */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{
                  fontSize: "0.95rem",
                  color: "#475569",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaBox size={14} /> Товари ({orderData.items.length})
                </h4>
                
                <div style={{ maxHeight: "180px", overflowY: "auto", paddingRight: "5px" }}>
                  {orderData.items.map((item: OrderItem, index: number) => (
                    <div key={item.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      padding: "8px 0",
                      borderBottom: index < orderData.items.length - 1 ? "1px solid #f1f5f9" : "none"
                    }}>
                      <div style={{ flex: 1, marginRight: "10px" }}>
                        <div style={{ 
                          fontWeight: 500, 
                          color: "#1e293b",
                          fontSize: "0.85rem",
                          marginBottom: "3px",
                          lineHeight: "1.3"
                        }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {item.quantity} × {item.price.toFixed(2)}{item.currency}
                        </div>
                      </div>
                      <div style={{ 
                        fontWeight: 600, 
                        color: "#1e293b", 
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap"
                      }}>
                        {(item.price * item.quantity).toFixed(2)}{item.currency}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Деталі доставки */}
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{
                  fontSize: "0.95rem",
                  color: "#475569",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <FaShippingFast size={14} /> Доставка
                </h4>
                
                <div style={{ 
                  background: "#f8fafc", 
                  borderRadius: "6px",
                  padding: "12px"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                      <FaGlobe style={{ marginRight: "6px" }} />
                      Країна:
                    </span>
                    <span style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.85rem" }}>
                      {shippingAddress.country || country}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                      Термін доставки:
                    </span>
                    <span style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.85rem" }}>
                      {deliveryTime}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                      Вартість доставки:
                    </span>
                    <span style={{ fontWeight: 600, color: "#4f46e5", fontSize: "0.9rem" }}>
                      {shippingCost?.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Підсумок */}
              <div style={{
                paddingTop: "15px",
                borderTop: "2px solid #e2e8f0"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ color: "#475569", fontSize: "0.9rem" }}>Вартість товарів:</span>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{itemsTotal?.toFixed(2)}€</span>
                </div>
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ color: "#475569", fontSize: "0.9rem" }}>Доставка:</span>
                  <span style={{ fontWeight: 500, fontSize: "0.9rem" }}>{shippingCost?.toFixed(2)}€</span>
                </div>
                
                {duties && duties.totalDuties > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px"
                  }}>
                    <span style={{ color: "#475569", fontSize: "0.9rem" }}>Митні платежі:</span>
                    <span style={{ fontWeight: 500, color: "#ef4444", fontSize: "0.9rem" }}>
                      {duties.totalDuties.toFixed(2)}€
                    </span>
                  </div>
                )}
                
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "15px",
                  borderTop: "1px solid #e2e8f0",
                  marginTop: "15px"
                }}>
                  <span style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b" }}>
                    До сплати:
                  </span>
                  <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#4f46e5" }}>
                    {orderTotal?.toFixed(2)}€
                  </span>
                </div>
              </div>
              
              {/* Кнопки */}
              <div style={{ marginTop: "25px" }}>
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "8px",
                    background: isProcessing ? "#94a3b8" : "#4f46e5",
                    color: "white",
                    fontWeight: 600,
                    border: "none",
                    fontSize: "0.95rem",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginBottom: "12px",
                    transition: "all 0.2s"
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid white",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      Обробка оплати...
                    </>
                  ) : (
                    <>
                      <FaLock /> Оплатити {orderTotal?.toFixed(2)}€
                    </>
                  )}
                </button>
                
                <button
                  onClick={goBack}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    background: "white",
                    color: "#475569",
                    fontWeight: 500,
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                  }}
                >
                  <FaArrowLeft /> Повернутися до замовлення
                </button>
              </div>
              
              <div style={{
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "1px solid #f1f5f9",
                fontSize: "0.75rem",
                color: "#94a3b8",
                textAlign: "center",
                lineHeight: "1.4"
              }}>
                <FaShieldAlt style={{ marginRight: "5px" }} />
                Гарантія безпечної оплати • 30 днів на повернення
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
          }
          
          button:hover {
            transform: translateY(-1px);
          }
        `}
      </style>
    </Layout>
  );
}