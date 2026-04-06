"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState } from 'react'


const Branding = () => {
  const [activePage, setActivePage] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterWeek] = useState<string>("All");
  const [filterContentType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <ProtectedRoute>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <div className="flex gap-5 w-fit">
            <InputField
              placeholder="Search by name..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="z-40">
            <CalendarMonthYearPicker
              onChange={({ month, year }) => {
                setSelectedMonth(month + 1);
                setSelectedYear(year);
              }}
            />
          </div>
        </div>

        <Card className="p-5">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={false}
            month={selectedMonth}
            year={selectedYear}
            filterWeek={filterWeek}
            filterContentType={filterContentType}
            searchQuery={searchQuery}
          />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Branding
