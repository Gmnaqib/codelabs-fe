"use client";
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState } from 'react'

const Picket = () => {
  const [activePage, setActivePage] = useState<string>("picketschedule");
  return (
    <ProtectedRoute>
      <Card className='p-5'>
        <div>
          <p className='font-medium text-secondary-foreground text-lg'>Picket Schedule Today</p>
          <p className='font-medium text-primary text-lg'>Friday, December 19, 2025</p>
        </div>
        <div>
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true}
          />
        </div>
      </Card>
    </ProtectedRoute>
  )
}

export default Picket
