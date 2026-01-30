// src/pages/Contacts.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

export default function Contacts() {
  const { user } = useAuth()

  const Content = (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "15px" }}>Контакти</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Ми завжди на зв'язку, щоб допомогти вам</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "50px", height: "50px", background: "#f0f9ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#0ea5e9" }}>
              <FaPhone size={24} />
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Телефон</div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>+38 (044) 123-45-67</div>
            </div>
          </div>
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "50px", height: "50px", background: "#fdf2f8", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#db2777" }}>
              <FaEnvelope size={24} />
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Email</div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>support@deliveryco.com</div>
            </div>
          </div>
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", display: "flex", gap: "20px", alignItems: "center" }}>
            <div style={{ width: "50px", height: "50px", background: "#f0fdf4", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}>
              <FaMapMarkerAlt size={24} />
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Адреса</div>
              <div style={{ fontWeight: 600, color: "#1e293b" }}>м. Київ, вул. Доставкова, 123</div>
            </div>
          </div>

          <div style={{ padding: "30px", textAlign: "center" }}>
            <h4 style={{ marginBottom: "20px" }}>Ми в соцмережах</h4>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              <a href="#" style={{ width: "45px", height: "45px", background: "#3b5998", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaFacebook size={20} /></a>
              <a href="#" style={{ width: "45px", height: "45px", background: "#e1306c", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaInstagram size={20} /></a>
              <a href="#" style={{ width: "45px", height: "45px", background: "#1da1f2", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><FaTwitter size={20} /></a>
            </div>
          </div>
        </div>

        <div style={{ background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ marginBottom: "25px" }}>Напишіть нам</h3>
          <form style={{ display: "grid", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Ваше ім'я</label>
                <input type="text" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Email</label>
                <input type="email" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Тема</label>
              <input type="text" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}>Повідомлення</label>
              <textarea rows={5} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", resize: "none" }}></textarea>
            </div>
            <button style={{ padding: "14px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}>Надіслати повідомлення</button>
          </form>
        </div>
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
