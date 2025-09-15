"use client"
import SelectField from "@/components/custom-ui/SelectField"
import { Calendar } from "@/components/ui/calendar"
import { AttendanceCard, MonthlyProgressCard, CashBillsCard, AnnouncementCard, PicketCard, InProgressCard } from "@/features/dashboard/components"
import React, { useState } from 'react'

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [filter, setFilter] = useState("highest")
    const DataSelect = [
    {
      value: "highest",
      title: "Highest"
    },
    {
      value: "lowest",
      title: "Lowest"
    }
  ]
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
        <div className="flex justify-between items-center">
          <p className='font-semibold'>KPI Rangkings</p>
          <SelectField
            options={DataSelect}
            value={filter}
            onChange={(value) => setFilter(value)}
          />
        </div>
        </div>
    </div>
  )
}

export default Dashboard
