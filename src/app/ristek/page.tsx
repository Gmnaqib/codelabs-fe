"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import { DropdownField } from '@/components/custom-ui/DropdownField'
import InputField from '@/components/custom-ui/InputField'
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import RistekTable from '@/features/ristek/components/RistekTable'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState } from 'react'
import { useTableStore } from '@/shared/state'

const Ristek = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const setGlobalDateRange = useTableStore((s) => s.setDateRange);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterWeek, setFilterWeek] = useState("All Week");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <ProtectedRoute roles={['admin', 'minister of research']}>
      <MotionWrapper>
        <div className="flex justify-between mb-10 flex-col lg:flex-row gap-4 lg:gap-0">
          <div className="flex gap-4 flex-col lg:flex-row">
            <InputField
              placeholder='Search by name...'
              type='text'
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setGlobalSearchQuery(e.target.value);
              }}
            />
            <DropdownField
              title={filterWeek}
              menu={["All Week", "Week 1", "Week 2", "Week 3", "Week 4"]}
              onChange={setFilterWeek}
            />
          </div>
          <div className="z-40">
            <CalendarMonthYearPicker
              onChange={({ month, year }) => {
                setSelectedMonth(month);
                setSelectedYear(year);
                setGlobalDateRange(month + 1, year);
              }}
              defaultMonth={selectedMonth}
              defaultYear={selectedYear}
            />
          </div>
        </div>
        <Card className='p-5'>
          <RistekTable
            filterWeek={filterWeek}
          />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default Ristek
