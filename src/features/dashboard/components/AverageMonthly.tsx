"use client"
import CardField from '@/components/custom-ui/CardField'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import React from 'react'

const AverageMonthly = () => {
  return (
    <CardField title="Average Monthly Points" icon={<ArrowTrendingUpIcon />}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <p className='w-full flex justify-center font-semibold text-2xl text-primary'>36%</p>
          <div className="flex items-center justify-center px-2">
            <div className="bg-muted w-0.5 h-6"></div>
          </div>
          <p className='w-full flex justify-center font-medium text-2xl text-warning'>Note Safe</p>
        </div>
        <Link href="/assessments" className='text-primary text-base text-center'>See More</Link>
      </div>
    </CardField>
  )
}

export default AverageMonthly
