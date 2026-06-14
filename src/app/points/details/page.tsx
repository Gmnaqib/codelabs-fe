"use client"
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState } from 'react'
import InputField from '@/components/custom-ui/InputField';
import MotionWrapper from '@/components/custom-ui/MotionWrapper'

const PointsDetails = () => {
  const [activePage, setActivePage] = useState<string>("pointsdetail");
  const [fetchTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Card className='p-5'>
          <div>
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={true}
              searchQuery={searchQuery}
              fetchTrigger={fetchTrigger}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default PointsDetails
