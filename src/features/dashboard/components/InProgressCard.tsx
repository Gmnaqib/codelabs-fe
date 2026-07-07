import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { ClockIcon } from '@heroicons/react/24/solid';
import { useInProgressCard } from '@/features/dashboard/hooks';

const InProgressCard = () => {
  const { total, active, completed } = useInProgressCard();

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
