"use client"
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute';
import React, { useState } from 'react'

const KPIScoring = () => {
  const [activePage, setActivePage] = useState<string>("research")
  return (
    <ProtectedRoute>
      <Card>
        <div className="flex justify-between px-5 pt-5">
          <div className="flex items-center 3">
              <p className='font-normal text-lg'>KPI Tasks</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className='text-sm text-secondary-foreground'>Current Rank</p>
              <p className='font-medium text-xl'>4</p>
            </div>
            <div className="w-0.5 h-12 bg-muted opacity-20"></div>
            <div className="text-center">
              <p className='text-sm text-secondary-foreground'>Current</p>
              <p className='font-medium text-xl'>33.92%</p>
            </div>
            <div className="w-0.5 h-12 bg-muted opacity-20"></div>
            <div className="text-center">
              <p className='text-sm text-secondary-foreground'>Status</p>
              <p className='font-medium text-xl'>Not Safe</p>
            </div>
          </div>
        </div>
        <div className="px-5">
          <hr />
        </div>
          <TableField 
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true} 
          />
      </Card>
    </ProtectedRoute>
  )
}

export default KPIScoring
