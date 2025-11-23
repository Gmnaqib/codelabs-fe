import { CalendarMonthYearPicker } from '@/components/custom-ui/CalendarMonthYearPicker'
import CardField from '@/components/custom-ui/CardField'
import DoughnutChart from '@/components/custom-ui/DoughnutChart'
import { getAllResearchRecords } from '@/services/research/researchService'
import { getAllUsers } from '@/services/users/userService'
import React, { useEffect, useState } from 'react'
import { TfiLayoutListThumbAlt } from 'react-icons/tfi'

const ResearchPercentage = () => {
   const [totalUsers, setTotalUsers] = useState(0);
   const [allResearchUsers, setAllResearchUsers] = useState(0);

   useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch kedua API bersamaan
        const [users, research] = await Promise.all([
          getAllUsers(),
          getAllResearchRecords()
        ]);

        // Total user
        setTotalUsers(users.length);

        // Ambil userId unik dari research
        const uniqueIds = new Set(
          research.map((r: any) => r.userId?._id)
        );

        setAllResearchUsers(uniqueIds.size);
        
      } catch (error) {
        console.error("Error fetching research or user data", error);
      }
    };

    fetchData();
  }, []);

   return (
      <CardField title="Research Percentage" icon={<TfiLayoutListThumbAlt size={22}/>}>
         <div className="flex flex-col gap-2">
               <CalendarMonthYearPicker />
               <DoughnutChart 
                  filled={allResearchUsers} 
                  total={totalUsers} 
               />
               <p className='text-center text-ring'>{allResearchUsers} of {totalUsers} members doing research this month</p>
         </div>
      </CardField>
   )
   }

export default ResearchPercentage
