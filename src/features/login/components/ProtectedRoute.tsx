"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const device_id = localStorage.getItem("device_id")

    if (!token || !device_id) {
      router.push("/login")
      setIsAuthenticated(false)
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (isAuthenticated === null) return <></>

  return <>{children}</>
}
