import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import DoughnutChart from '@/components/custom-ui/DoughnutChart'
import { getAllResearchRecords } from '@/services/research/researchService'
import { getAllUsers } from '@/services/users/userService'
import { BeakerIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'

const ResearchPercentage = () => {

  const [totalUsers, setTotalUsers] = useState(0);
  const [allResearchUsers, setAllResearchUsers] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, research] = await Promise.all([
          getAllUsers(),
          getAllResearchRecords(selectedYear, selectedMonth)
        ]);

        setTotalUsers(users.length);

        type UserIdObj = { _id: string };
        type ResearchRecord = { userId?: UserIdObj };
        const uniqueIds = new Set(
          (research as ResearchRecord[]).map((r) => r.userId?._id)
        );

        setAllResearchUsers(uniqueIds.size);
      } catch (error) {
        console.error("Error fetching research or user data", error);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

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
