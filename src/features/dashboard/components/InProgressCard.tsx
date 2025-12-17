import React, { useEffect, useState } from 'react'
import CardField from '@/components/custom-ui/CardField'
import { getMeResearchRecords } from '@/services/research/researchService';
import { ClockIcon } from '@heroicons/react/24/solid';

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
    <CardField title="In Progress" icon={<ClockIcon />} bg>
          <div className="flex flex-col gap-9">
            <div className="flex flex-col gap-2 items-center">
              <p className='text-sm'>Total Task</p>
              <p className='text-sm text-muted bg-surface w-fit py-1 px-6 rounded-sm'>{total}</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className='text-sm'>Active Task</p>
              <p className='text-sm text-muted bg-surface w-fit py-1 px-6 rounded-sm'>{active}</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <p className='text-sm'>Completed Task</p>
              <p className='text-sm text-success bg-surface w-fit py-1 px-6 rounded-sm'>{completed}</p>
            </div>
          </div>
        </CardField>
  )
}

export default InProgressCard
