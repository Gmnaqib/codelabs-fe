"use client"
import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import { DropdownField } from '@/components/custom-ui/DropdownField'
import InputField from '@/components/custom-ui/InputField'
import { TableField } from '@/components/custom-ui/TableField'
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'

const Ristek = () => {
  const [activePage, setActivePage] = useState<string>("ristek");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubResearch, setFilterSubResearch] = useState("All SubResearch");
  const [filterWeek, setFilterWeek] = useState("All Week");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  return (
    <div>
      <div className="flex justify-between mb-10">
        <div className="flex gap-5">
          <InputField
            placeholder='Search by name...'
            type='text'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <DropdownField
            title={filterSubResearch}
            menu={["All SubResearch", "Web", "Mobile", "Game", "Data", "IoT", "UI/UX"]}
            onChange={setFilterSubResearch}
          />
          <DropdownField
            title={filterWeek}
            menu={["All Week", "Week 1", "Week 2", "Week 3", "Week 4"]}
            onChange={setFilterWeek}
          />
        </div>
        <CalendarMonthYearPicker
          onChange={({ month, year }) => {
            setSelectedMonth(month);
            setSelectedYear(year);
          }}
          defaultMonth={selectedMonth}
          defaultYear={selectedYear}
        />
      </div>
      <Card className='p-5'>
        <TableField
          activePage={activePage}
          onPageChange={setActivePage}
          showMenu={false}
          searchQuery={searchQuery}
          filterContentType={filterSubResearch}
          filterWeek={filterWeek}
          month={selectedMonth + 1}
          year={selectedYear}
        />
      </Card>
    </div>
  )
}

export default Ristek
