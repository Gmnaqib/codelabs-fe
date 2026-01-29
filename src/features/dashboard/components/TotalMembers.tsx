"use client"
import CardField from '@/components/custom-ui/CardField'
import { getAllUsers } from '@/services/users/userService'
import { IdentificationIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const TotalMembers = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers()
        setTotalUsers(users.length)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      }
    }

    fetchUsers()
  }, [])


  return (
    <CardField title="Total Member" icon={<IdentificationIcon />}>
      <div className="flex w-full flex-col items-center gap-8">
        <p className='font-medium text-2xl'>{totalUsers !== null ? `${totalUsers} Member` : "Loading..."}</p>
        <Link href="/members" className='text-primary text-base'>See More</Link>
      </div>
    </CardField>
  )
}

export default TotalMembers
