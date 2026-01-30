// src/components/Layout.tsx
import type { ReactNode } from "react"
import UserHeader from "./UserHeader"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export default function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div>
      <UserHeader />
      <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
        {showSidebar && <Sidebar />}
        <main style={{
          flex: 1,
          padding: "30px",
          background: "#f4f6fb",
          width: showSidebar ? "calc(100% - 250px)" : "100%",
          transition: "all 0.3s ease"
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}