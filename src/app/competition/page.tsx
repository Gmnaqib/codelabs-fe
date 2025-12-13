"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import React, { useState } from 'react'

const Competiton = () => {
  const [activePage, setActivePage] = useState<string>("");
  return (
    <div>
      <div className="flex justify-between">
            <InputField placeholder='Search by name...' type='text' />
            <CalendarMonthYearPicker />
      </div>

      <TableField
        activePage={activePage}
        onPageChange={setActivePage}
        showMenu={false}
        // filterWeek={filterWeek}
        // month={selectedMonth}
        // year={selectedYear}
      />
    </div>
  )
}

export default Competiton
