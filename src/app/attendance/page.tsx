import FilterMonth from '@/components/custom-ui/FilterMonth';
import InputField from '@/components/custom-ui/InputField';
import { Card } from '@/components/ui/card'
import React from 'react'
import { FaPeopleGroup } from 'react-icons/fa6'

const Attendance = () => {
  const statsData = [
    { title: "Total Report", value: 481 },
    { title: "Permit", value: 37 },
    { title: "Sick", value: 34 },
    { title: "Late Arrivals", value: 132 },
    { title: "No Report", value: 278 },
  ];
  return (
    <div>
      <p className='font-bold text-2xl'>October 2025</p>
      <p className='text-ring text-sm'>Please fill out each <span className='font-bold'>member's permission</span></p>

      <div className="grid grid-cols-5 gap-4">
      {statsData.map((item, index) => (
        <Card key={index} className="flex text-lg gap-3 items-center px-5">
          <div className="flex w-full items-center gap-3">
            <div className="bg-[rgb(0,208,255,0.1)] text-[#00D0FF] rounded-full p-1">
              <FaPeopleGroup size={20} />
            </div>
            <p>{item.title}</p>
          </div>
          <p className="font-bold text-3xl text-[#00D0FF] w-full text-right">{item.value}</p>
        </Card>
      ))}
      </div>

      <div className="flex justify-between">
        <InputField type='string' placeholder='Search by Name' />
        <FilterMonth/>
      </div>

    </div>
  )
}

export default Attendance
