"use client"
import CardField from '@/components/custom-ui/CardField'
import { BanknotesIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

const OperationalCash = () => {
  return (
    <CardField title="Total Operational Cash" icon={<BanknotesIcon />}>
      <div className="flex w-full flex-col gap-8">
            <p className='font-semibold text-2xl text-center'>Rp 15.000.000</p>
            <Link href="#" className='text-primary text-base text-center'>See More</Link>
          </div>
    </CardField>
  )
}

export default OperationalCash
