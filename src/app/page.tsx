"use client"
import { Calendar } from "@/components/ui/calendar"
import { AttendanceCard, MonthlyProgressCard, CashBillsCard, AnnouncementCard, PicketCard, InProgressCard, TotalMembers } from "@/features/dashboard/components"
import AverageMonthly from "@/features/dashboard/components/AverageMonthly"
import KPIRangkings from "@/features/dashboard/components/KPIRangkings"
import OperationalCash from "@/features/dashboard/components/OperationalCash"
import OrganizationStatistics from "@/features/dashboard/components/OrganizationStatistics"
import OrganizationSummary from "@/features/dashboard/components/OrganizationSummary"
import ResearchPercentage from "@/features/dashboard/components/ResearchPercentage"
import ProtectedRoute from "@/features/login/components/ProtectedRoute"
import React, { useState } from 'react'

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  return (
    <ProtectedRoute>
      <div className="flex gap-5 bg-secondary">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 mr-72">
            <AttendanceCard />
            <MonthlyProgressCard />
            <CashBillsCard />
            <AnnouncementCard />
            <PicketCard />
            <InProgressCard /> 
            <TotalMembers/>
            <AverageMonthly/>
            <OperationalCash/>
            <OrganizationStatistics className="col-span-2 h-full"/>
            <ResearchPercentage/>
            <OrganizationSummary className="col-span-3 h-full"/>
        </div>
        <div className="flex flex-col gap-5 p-4 border-l-2 fixed right-0 top-0 mt-20">
          <p className='font-semibold '>Schedule</p>
          <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
        <KPIRangkings />
        </div>
    </div>
    </ProtectedRoute>
  )
}

export default Dashboard
