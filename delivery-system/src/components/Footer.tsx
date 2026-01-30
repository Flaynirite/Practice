// src/components/Footer.tsx
import { Link } from "react-router-dom"

export default function Footer() {
  return (
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
              <li><Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>Міжнародна доставка</Link></li>
              <li><Link to="/tracking" style={{ color: "#94a3b8", textDecoration: "none" }}>Відстеження посилок</Link></li>
              <li><Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>Страхування вантажу</Link></li>
              <li><Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>Консолідація відправлень</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "white" }}>Компанія</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>Про нас</Link></li>
              <li><Link to="/blog" style={{ color: "#94a3b8", textDecoration: "none" }}>Блог</Link></li>
              <li><Link to="/careers" style={{ color: "#94a3b8", textDecoration: "none" }}>Кар'єра</Link></li>
              <li><Link to="/contacts" style={{ color: "#94a3b8", textDecoration: "none" }}>Контакти</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "white" }}>Довідка</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              <li><Link to="/faq" style={{ color: "#94a3b8", textDecoration: "none" }}>Допомога</Link></li>
              <li><Link to="/faq" style={{ color: "#94a3b8", textDecoration: "none" }}>FAQ</Link></li>
              <li><Link to="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>Політика конфіденційності</Link></li>
              <li><Link to="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>Умови використання</Link></li>
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
  )
}
