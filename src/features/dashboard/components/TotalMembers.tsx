
"use client"
import CardField from '@/components/custom-ui/CardField'
import { IdentificationIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'
import { useTotalMembersCard } from '@/features/dashboard/hooks'

const TotalMembers = () => {
  const { totalUsers } = useTotalMembersCard();

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
