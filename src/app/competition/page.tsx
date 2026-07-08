"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import CompetitionTable from '@/features/competition/components/CompetitionTable'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState } from 'react'
import { useTableStore } from '@/shared/state'


const Competiton = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const setGlobalDateRange = useTableStore((s) => s.setDateRange);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute roles={['admin', 'minister of competition']}>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <InputField
            placeholder="Search by name..."
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setGlobalSearchQuery(e.target.value);
            }}
          />
          <div className="z-40">
            <CalendarMonthYearPicker
              onChange={({ month, year }) => {
                setGlobalDateRange(month + 1, year);
              }}
            />
          </div>
        </div>
        <Card className="p-5">
          <CompetitionTable />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Competiton
