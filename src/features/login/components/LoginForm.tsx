"use client"

import React, { useState } from "react"
import InputField from "@/components/custom-ui/InputField"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { loginUser } from "@/services/auth/authService"
import { useRouter } from "next/navigation" // ✅ ganti router versi App Router
import { useAuth } from "@/context/AuthContext"

const LoginForm = () => {
  const [nim, setNim] = useState("")
  const [password, setPassword] = useState("")
  const { login, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter() // ✅ letakkan di sini, bukan di dalam handleLogin

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nim || !password) {
      alert("NIM dan Password tidak boleh kosong!")
      return
    }

    setLoading(true)
    try {
      const res = await loginUser(nim, password)
      console.log("Login success:", res)
      alert("Login berhasil ✅")

      // ✅ redirect ke dashboard setelah login
      router.push("/")
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message)
      alert("Login gagal ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center gap-16 bg-gradient-to-br from-[#2080d9] to-[#27dba2] md:gap-10 lg:flex-row lg:bg-none lg:gap-0">
      <div className="flex w-full justify-center items-center lg:h-screen lg:w-1/2 lg:bg-gradient-to-br from-[#2080d9] to-[#27dba2]">
        <Image
          src="/logo/logo.png"
          alt="logo"
          width={400}
          height={0}
          className="w-[280px] md:w-[350px] lg:w-[400px] h-auto"
        />
      </div>

      <div className="flex w-10/12 bg-white rounded-xl md:w-7/12 lg:w-1/2 lg:items-center lg:justify-center">
        <div className="flex flex-col w-full p-6 gap-5 md:gap-10 lg:mx-40">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-2xl">Login</p>
            <p className="font-extraligh text-xs">
              Please provide your NIM and password to form below.
            </p>
          </div>

          <form className="flex flex-col gap-5 md:gap-10" onSubmit={handleLogin}>
            <div className="flex flex-col gap-4 w-full">
              <InputField
                label="NIM"
                type="text"
                placeholder="Type your NIM here"
                value={nim}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNim(e.target.value)
                }
              />

              <InputField
                label="Password"
                type="password"
                placeholder="Type your Password here"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
