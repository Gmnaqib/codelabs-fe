"use client"
import CardField from '@/components/custom-ui/CardField'
import { Button } from '@/components/ui/button'
import { getAllUsers } from '@/services/users/userService'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoIosWarning } from 'react-icons/io'

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
    <CardField title="Total Members" icon={<IoIosWarning size={22} />}>
      <div className="flex w-full flex-col gap-5">
            <p className='font-bold text-2xl'>{totalUsers !== null ? `${totalUsers} Peoples` : "Loading..."}</p>
            <Button className='w-fit px-4 py-0 text-base'>See More</Button>
          </div>
    </CardField>
  )
}

export default TotalMembers
