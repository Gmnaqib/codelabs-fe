"use client"
import React, { useEffect, useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { AttendanceCard, MonthlyProgressCard, CashBillsCard, AnnouncementCard, PicketCard, InProgressCard, TotalMembers, AverageMonthly, OperationalCash, OrganizationStatistic, OrganizationSummary, KPIRangkings, ResearchPercentage } from "@/features/dashboard/components"
import ProtectedRoute from "@/features/login/components/ProtectedRoute"
import { Button } from '@/components/ui/button'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { useClock } from '@/hooks/useClock'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { formattedTime, formattedDate } = useClock();
  const [isRightOpen, setIsRightOpen] = useState(true);
  const isXl = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
  if (isXl) {
    setIsRightOpen(true);
  }
}, [isXl]);
  
  return (
    <ProtectedRoute>
      <div className="flex bg-secondary">
        <div className="gap-5 grid grid-cols-1 xl:grid-cols-3 xl:mr-[263px]">
            <AttendanceCard />
            <MonthlyProgressCard />
            <CashBillsCard />
            <AnnouncementCard />
            <div className="lg:z-50">
              <PicketCard />
            </div>
            <InProgressCard /> 
            {/* <TotalMembers/>
            <AverageMonthly/>
            <OperationalCash/>
            <OrganizationStatistic className="h-full xl:col-span-2"/>
            <ResearchPercentage/>
            <OrganizationSummary className="h-full xl:col-span-3"/> */}
        </div>
        <Button
          variant="default"
          className={`absolute top-24 bg-background text-primary rounded-sm p-0 z-50 xl:hidden ${isRightOpen? "right-68" : "right-0" }`}
          onClick={() => setIsRightOpen(!isRightOpen)}
        >
          <ChevronRightIcon
            className={`transition-transform duration-300 size-5 ${isRightOpen ? "" : "rotate-180"}`}
          />
        </Button>
        {isRightOpen && (
          <div className={`
            fixed right-0 top-0 mt-[75px]
            w-[275px]
            flex flex-col gap-4 p-4 border-l-2 bg-background
            transition-transform duration-300 ease-in-out z-10 lg:z-10
            xl:translate-x-0 xl:opacity-100
            ${
              isRightOpen
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }
          `}>
            <div className="">
              <p className='text-xl'>{formattedTime} WIB</p>
              <p className='text-sm text-neutral'>{formattedDate}</p>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
              />
            </div>
            <KPIRangkings />
          </div>
        )}
    </div>
    </ProtectedRoute>
  )
}

export default Dashboard
