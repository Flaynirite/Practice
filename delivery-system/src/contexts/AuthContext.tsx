// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { AuthService } from '../services/authService'
import { AdminService } from '../services/adminService' // Додаємо імпорт
import type { UserSession } from '../types'

interface AuthContextType {
  user: UserSession | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<any>
  register: (name: string, email: string, password: string) => Promise<any>
  logout: () => void
  updateProfile: (updates: any) => Promise<any>
  // Адмін функції - з перевіркою через AdminService
  getAllUsers: () => Promise<any[]>
  updateUserAdminStatus: (userId: string, isAdmin: boolean) => Promise<boolean>
  deleteUser: (userId: string) => Promise<boolean>
  getStatistics: () => Promise<any>
  // Нова функція для перевірки прав адміна
  checkAdminAccess: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = AuthService.getCurrentSession()
    if (session) {
      // Синхронізуємо права адміна при завантаженні
      const isAdmin = AdminService.isAdminEmail(session.email)
      session.isAdmin = isAdmin
      // Оновлюємо в localStorage
      AuthService.updateUserProfile(session.id, { isAdmin })
    }
    setUser(session)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const userData = AuthService.login(email, password)
    if (userData) {
      // Перевіряємо чи користувач адмін
      const isAdmin = AdminService.isAdminEmail(email)
      userData.isAdmin = isAdmin
      // Оновлюємо в базі даних
      AuthService.updateUserProfile(userData.id, { isAdmin })
    }
    setUser(userData)
    return userData
  }

  const register = async (name: string, email: string, password: string) => {
    const userData = await AuthService.register({ name, email, password })
    if (userData) {
      // Перевіряємо чи новий користувач адмін
      const isAdmin = AdminService.isAdminEmail(email)
      userData.isAdmin = isAdmin
      // Оновлюємо в базі даних
      AuthService.updateUserProfile(userData.id, { isAdmin })
    }
    setUser(userData)
    return userData
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  const updateProfile = async (updates: any) => {
    if (!user) throw new Error('Користувач не авторизований')
    const updatedUser = await AuthService.updateUserProfile(user.id, updates)
    setUser(updatedUser)
    return updatedUser
  }

  // Перевірка чи поточний користувач має права адміна
  const checkAdminAccess = (): boolean => {
    if (!user?.email) return false
    return AdminService.isAdminEmail(user.email)
  }

  // Адмін функції - тепер з перевіркою через checkAdminAccess
  const getAllUsers = async () => {
    if (!checkAdminAccess()) {
      throw new Error('Доступ заборонено: необхідні права адміністратора')
    }
    return AuthService.getAllUsersForAdmin()
  }

  const updateUserAdminStatus = async (userId: string, isAdmin: boolean) => {
    if (!checkAdminAccess()) {
      throw new Error('Доступ заборонено: необхідні права адміністратора')
    }
    return AuthService.updateUserAdminStatus(userId, isAdmin)
  }

  const deleteUser = async (userId: string) => {
    if (!checkAdminAccess()) {
      throw new Error('Доступ заборонено: необхідні права адміністратора')
    }
    return AuthService.deleteUser(userId)
  }

  const getStatistics = async () => {
    if (!checkAdminAccess()) {
      throw new Error('Доступ заборонено: необхідні права адміністратора')
    }
    return AuthService.getStatistics()
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      getAllUsers,
      updateUserAdminStatus,
      deleteUser,
      getStatistics,
      checkAdminAccess // Додаємо нову функцію
    }}>
      {children}
    </AuthContext.Provider>
  )
}