import { AttendanceCard, MonthlyProgressCard, CashBillsCard, AnnouncementCard, PicketCard } from "@/features/dashboard/components"
import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex gap-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 mr-72">
            <AttendanceCard />
            <MonthlyProgressCard />
            <CashBillsCard />
            <AnnouncementCard />
            <PicketCard />

        </div>
    </div>
  )
}

export default Dashboard
