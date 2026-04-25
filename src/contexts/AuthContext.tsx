import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ✅ Load auth from localStorage safely
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('authUser')

      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser)

        setToken(storedToken)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Auth load error:", error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ✅ FIXED LOGIN (extra safety + logs)
  const login = (newToken: string, newUser: User) => {
    if (!newToken || !newUser) {
      console.error("Invalid login data")
      return
    }

    console.log("Saving auth:", newUser)

    setToken(newToken)
    setUser(newUser)

    localStorage.setItem('authToken', newToken)
    localStorage.setItem('authUser', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')

    // ✅ optional redirect
    window.location.href = '/login'
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}