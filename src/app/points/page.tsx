"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState } from 'react'

const Points = () => {
const [activePage, setActivePage] = useState<string>("points");
  return (
    <ProtectedRoute>
        <Card className='p-5'>
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

export default Points
