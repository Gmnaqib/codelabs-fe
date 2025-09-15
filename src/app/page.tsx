"use client"
import { Calendar } from "@/components/ui/calendar"
import { AttendanceCard, MonthlyProgressCard, CashBillsCard, AnnouncementCard, PicketCard, InProgressCard } from "@/features/dashboard/components"
import KPIRangkings from "@/features/dashboard/components/KPIRangkings"
import React, { useState } from 'react'

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  return (
    <div className="flex gap-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 mr-72">
            <AttendanceCard />
            <MonthlyProgressCard />
            <CashBillsCard />
            <AnnouncementCard />
            <PicketCard />
            <InProgressCard /> 
        </div>
        <div className="flex flex-col gap-5 p-4 border-l-2 fixed right-0 top-0 mt-20">
          <p className='font-semibold '>Schedule</p>
          <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <KPIRangkings />
        </div>
    </div>
  )
}

export default Dashboard
