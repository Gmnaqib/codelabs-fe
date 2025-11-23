import CardField from '@/components/custom-ui/CardField'
import { getMeResearchRecords } from '@/services/research/researchService';
import React, { useEffect, useState } from 'react'
import { IoIosWarning } from 'react-icons/io'

const InProgressCard = () => {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(()=>{
    const fetchData = async () => {
      try {
        const records = await getMeResearchRecords();

        setTotal(records.length);
        setActive(records.filter((item: any) => item.progress === "unfinished").length);
        setCompleted(records.filter((item: any) => item.progress === "finished").length);
      } catch (error) {
        console.error("Error fetching research data:", error);
      }
    };
     fetchData();
  },[])

  return (
    <CardField title="In Progress" icon={<IoIosWarning size={22} />}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Total Tasks</p>
              <p className='font-bold text-3xl'>{total}</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Active Tasks</p>
              <p className='font-bold text-3xl'>{active}</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Completed Tasks</p>
              <p className='font-bold text-3xl text-[#27DBA2]'>{completed}</p>
            </div>
          </div>
        </CardField>
  )
}

export default InProgressCard
