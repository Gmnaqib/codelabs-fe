"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import { DropdownField } from '@/components/custom-ui/DropdownField'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'

const Branding = () => {
  const [activePage, setActivePage] = useState<string>("");
  return (
    <div>
      <div className="flex justify-between mb-10">
        <div className="flex gap-5">
            <InputField placeholder='Search by name...' type='text' />
            <DropdownField 
            title="All Week"
            menu={["Week 1", "Week 2", "Week 3", "Week 4"]}
            />
            <DropdownField 
            title="Content Type"
            menu={["All", "CL Academy", "Sosmed"]}
            />
        </div>
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

export default Branding
