"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute'
import React, { useState } from 'react'


const Competiton = () => {
  const [activePage, setActivePage] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
          <CalendarMonthYearPicker
            onChange={({ month, year }) => {
              setSelectedMonth(month + 1);
              setSelectedYear(year);
            }}
          />
        </div>
        <Card className="p-5">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={false}
            month={selectedMonth}
            year={selectedYear}
            searchQuery={searchQuery}
          />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Competiton
