"use client"
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import { FaTasks } from "react-icons/fa";

const KPIScoring = () => {
  const [activePage, setActivePage] = useState<string>("research")
  return (
    <div>
      <p>• 25% of points from Attendance, 25% of points from Branding, 25% of points from Research, 5% of points from Competition.</p>
      <Card>
        <div className="flex justify-between">
            <div className="flex items-center gap-3">
                <div className='bg-[rgb(0,208,255,0.1)] text-[#00D0FF] rounded-full p-2'>
                    <FaTasks size={20} />
                </div>
                <p className='font-semibold'>KPI Tasks</p>
            </div>
            <div className="flex gap-6">
                <div className="text-center">
                    <p className='text-muted-foreground'>Current Rank</p>
                    <p className='font-semibold text-2xl'>0</p>
                </div>
                <div className="text-center">
                    <p className='text-muted-foreground'>Current</p>
                    <p className='font-semibold text-2xl'>0%</p>
                </div>
                <div className="text-center">
                    <p className='text-muted-foreground'>Status</p>
                    <p className='font-semibold text-2xl text-red-400'>Danger</p>
                </div>
            </div>
        </div>
        <TableField 
          activePage={activePage}
          onPageChange={setActivePage}
          showMenu={true} 
        />
      </Card>
    </div>
  )
}

export default KPIScoring
