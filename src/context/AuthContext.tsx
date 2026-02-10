"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getToken, saveToken, removeToken } from "@/lib/token"
import { loginUser } from "@/services/auth/authService"
import { jwtDecode } from "jwt-decode"

interface User {
  id: string
  name: string
  email?: string
  role: string
  nim: string
  major: string
  status: string
  device_id?: string
  
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (nim: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  interface JwtPayload {
    id: string;
    name: string;
    email?: string;
    role: string;
    nim: string;
    major: string;
    status: string;
    device_id?: string;
    [key: string]: unknown;
  }

  useEffect(() => {
    const token = getToken()
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          nim: decoded.nim,
          major: decoded.major,
          status: decoded.status,
          device_id: decoded.device_id,
        })
      } catch (err) {
        console.error("Invalid token:", err)
        removeToken()
      }
    }
    setLoading(false)
  }, [])

  const login = async (nim: string, password: string) => {
    setLoading(true)
    try {
      const data = await loginUser(nim, password)
      const token = data?.data?.token
      if (token) {
        saveToken(token)
        const decoded = jwtDecode<JwtPayload>(token)
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          nim: decoded.nim,
          major: decoded.major,
          status: decoded.status,
          device_id: decoded.device_id,
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
