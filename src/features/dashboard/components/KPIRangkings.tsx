"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import SelectField from "@/components/custom-ui/SelectField"
import { DataSelectRangkingsKPI } from "@/config/dashboard"
import { getAllUsers } from "@/services/users/userService"

interface User {
  _id: string
  name: string
  role: string
  majors: string
}

const KPIRangkings = () => {
  const [filter, setFilter] = useState("highest")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers()
        setUsers(res)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const sortedUsers = [...users].sort((a, b) => {
    return filter === "highest"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name)
  })

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="font-medium">KPI Rangkings</p>
        <SelectField
          options={DataSelectRangkingsKPI}
          value={filter}
          onChange={(value) => setFilter(value)}
        />
      </div>

      <div className="max-h-64 overflow-y-auto flex flex-col gap-4 scrollbar-none ">
        {sortedUsers.map((user, index) => (
          <div key={user._id} className="flex w-full gap-3 items-center border-b pb-2">
            <div className="relative">
              <Image
                src="/icon/profile.png"
                alt="profile"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="absolute flex justify-center items-center top-0 right-0 -mr-1.5 bg-[#2080D9] w-5 h-5 rounded-full">
                <p className="text-xs text-white font-semibold">
                  {filter === "highest" ? index + 1 : sortedUsers.length - index}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center w-full">
              <p className="text-base">{user.name}</p>
              <p className="font-normal text-primary text-base">0%</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default KPIRangkings
