"use client"
import CardField from '@/components/custom-ui/CardField'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const OperationalCash = () => {
  return (
    <CardField title="Total Members" icon={<IoIosWarning size={22} />}>
      <div className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
                <p className='font-bold text-2xl'>Rp 15.000.000</p>
            </div>
            <Button className='w-fit px-4 py-0 text-base'>See More</Button>
          </div>
    </CardField>
  )
}

export default OperationalCash
