"use client"
import CardField from '@/components/custom-ui/CardField'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const AverageMonthly = () => {
  return (
    <CardField title="Total Members" icon={<IoIosWarning size={22} />}>
      <div className="flex w-full flex-col gap-4">
            <div className="flex gap-4">
                <p className='font-bold text-2xl'>36%</p>
                <div className="bg-slate-400 w-0.5 h-6"></div>
                <p className='font-bold text-2xl text-orange-300'>Not Safe</p>
            </div>
            <Button className='w-fit px-4 py-0 text-base'>See More</Button>
          </div>
    </CardField>
  )
}

export default AverageMonthly
