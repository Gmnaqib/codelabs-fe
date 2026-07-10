"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import MotionWrapper from '@/components/custom-ui/MotionWrapper'
import BrandingTable from '@/features/branding/components/BrandingTable'
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import React, { useState } from 'react'
import { useTableStore } from '@/shared/state'


const Branding = () => {
  const setGlobalSearchQuery = useTableStore((s) => s.setSearchQuery);
  const setGlobalDateRange = useTableStore((s) => s.setDateRange);
  const [filterWeek] = useState<string>("All");
  const [filterContentType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <ProtectedRoute roles={['admin', 'minister of branding']}>
      <MotionWrapper>
        <div className="flex justify-between mb-10">
          <div className="flex gap-5 w-fit">
            <InputField
              placeholder="Search by name..."
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setGlobalSearchQuery(e.target.value);
              }}
            />
          </div>
          <div className="z-40">
            <CalendarMonthYearPicker
              onChange={({ month, year }) => {
                setGlobalDateRange(month + 1, year);
              }}
            />
          </div>
        </div>

        <Card className="p-5">
          <BrandingTable
            filterWeek={filterWeek}
            filterContentType={filterContentType}
          />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
}

export default Branding
