// src/components/Layout.tsx
import type { ReactNode } from "react"
import UserHeader from "./UserHeader"
import Sidebar from "./Sidebar"

export default function Layout({children}: {children: ReactNode}) {
  return (
    <div>
      <UserHeader />
      <div style={{display:"flex", minHeight:"calc(100vh - 60px)"}}>
        <Sidebar />
        <main style={{flex:1, padding:"30px", background:"#f4f6fb"}}>
          {children}
        </main>
      </div>
    </div>
  )
}