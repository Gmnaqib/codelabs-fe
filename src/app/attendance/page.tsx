"use client"
import FilterMonth from '@/components/custom-ui/FilterMonth';
import InputField from '@/components/custom-ui/InputField';
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import { FaPeopleGroup } from 'react-icons/fa6'

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("TotalAttendance")

  const statsData = [
    { title: "Total Report", value: 481 },
    { title: "Permit", value: 37 },
    { title: "Sick", value: 34 },
    { title: "Late Arrivals", value: 132 },
    { title: "No Report", value: 278 },
  ];
  return (
    <div className='flex flex-col gap-8'>
      <div className="">
        <p className='font-bold text-2xl'>October 2025</p>
        <p className='text-ring text-sm'>Please fill out each <span className='font-bold'>member's permission</span></p>
      </div>

      <div className="grid grid-cols-5 gap-4">
      {statsData.map((item, index) => (
        <Card key={index} className="flex text-lg gap-3 items-center px-5">
          <div className="flex w-full items-center gap-3">
            <div className="bg-[rgb(0,208,255,0.1)] text-[#00D0FF] rounded-full p-1">
              <FaPeopleGroup size={20} />
            </div>
            <p className='font-semibold'>{item.title}</p>
          </div>
          <p className="font-bold text-3xl text-[#00D0FF] w-full">{item.value}</p>
        </Card>
      ))}
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
  )
}

export default Attendance
