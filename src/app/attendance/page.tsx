"use client"
import FilterMonth from '@/components/custom-ui/FilterMonth';
import InputField from '@/components/custom-ui/InputField';
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute';
import React, { useState } from 'react'
import { FaPeopleGroup } from 'react-icons/fa6'

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("TotalAttendance")

  return (
    <ProtectedRoute>
      <div className='flex flex-col gap-8'>
      <div className="">
        <p className='font-bold text-2xl'>October 2025</p>
        <p className='text-ring text-sm'>Please fill out each <span className='font-bold'>member's permission</span></p>
      </div>

      <div className="flex justify-between">
        <InputField type='string' placeholder='Search by Name' />
        <FilterMonth/>
      </div>

      <TableField 
        activePage={activePage}
        onPageChange={setActivePage}
        showMenu={true}
      />

    </div>
    </ProtectedRoute>
  )
}

export default Attendance
