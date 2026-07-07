import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import DoughnutChart from '@/components/custom-ui/DoughnutChart'
import { BeakerIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import { useResearchPercentageCard } from '@/features/dashboard/hooks'

const ResearchPercentage = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { totalUsers, allResearchUsers } = useResearchPercentageCard(selectedMonth, selectedYear);

   return (
      <CardField title="Research Percentage" icon={<BeakerIcon />}>
        <div className="flex flex-col gap-2">
          <CalendarMonthYearPicker
            onChange={({ month, year }) => {
              setSelectedMonth(month + 1);
              setSelectedYear(year);
            }}
            defaultMonth={selectedMonth - 1}
            defaultYear={selectedYear}
          />
          <DoughnutChart
            filled={allResearchUsers}
            total={totalUsers}
          />
        </div>
      </CardField>
   )
   }

export default ResearchPercentage
