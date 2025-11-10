"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token])

  return token ? <>{children}</> : null
}
