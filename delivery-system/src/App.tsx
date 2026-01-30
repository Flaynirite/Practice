// src/App.tsx
import { Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import HomePage from "./pages/Homepage"
import GuestHome from "./pages/GuestHome"
import UserHome from "./pages/UserHome"
import Login from "./pages/Login"
import CreateAccount from "./pages/CreateAccount"
import Profile from "./pages/Profile"
import Dashboard from "./pages/Dashboard"
import Orders from "./pages/Orders"
import Admin from "./pages/Admin"
import CreateOrder from "./pages/CreateOrder"
import Blog from "./pages/Blog"
import FAQ from "./pages/FAQ"
import Tracking from "./pages/Tracking"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="blog" element={<Blog />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="FAQ" element={<FAQ />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/guest" element={<GuestHome />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        
        {/* Захищені маршрути */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/orders" element={
          <PrivateRoute>
            <Orders />
          </PrivateRoute>
        } />
        
        <Route path="/admin" element={
          <PrivateRoute requireAdmin={false}>
            <Admin />
          </PrivateRoute>
        } />
        
        <Route path="/create" element={
          <PrivateRoute>
            <CreateOrder />
          </PrivateRoute>
        } />
        
        <Route path="/user-home" element={
          <PrivateRoute>
            <UserHome />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}