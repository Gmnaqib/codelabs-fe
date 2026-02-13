"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'

const Competiton = () => {
  const [activePage, setActivePage] = useState<string>("");
  return (
    <div>
      <div className="flex justify-between mb-10">
            <InputField placeholder='Search by name...' type='text' />
            <CalendarMonthYearPicker />
      </div>
      <Card className='p-5'>
        <TableField
          activePage={activePage}
          onPageChange={setActivePage}
          showMenu={false}
          // filterWeek={filterWeek}
          // month={selectedMonth}
          // year={selectedYear}
        />
      </Card>
    </div>
  )
}

export default Competiton
