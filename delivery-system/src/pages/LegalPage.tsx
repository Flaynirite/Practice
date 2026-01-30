// src/pages/LegalPage.tsx
import Layout from "../components/Layout"
import GuestHeader from "../components/GuestHeader"
import { useAuth } from "../contexts/AuthContext"

interface LegalPageProps {
  title: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, content }: LegalPageProps) {
  const { user } = useAuth()

  const PageContent = (
    <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 20px", background: "white", borderRadius: "20px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
      <div style={{ padding: "50px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "#1e293b", marginBottom: "40px", textAlign: "center" }}>{title}</h1>
        <div style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem" }}>
          {content}
        </div>
      </div>
    </div>
  )

  return user ? <Layout>{PageContent}</Layout> : (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <GuestHeader />
      {PageContent}
    </div>
  )
}
