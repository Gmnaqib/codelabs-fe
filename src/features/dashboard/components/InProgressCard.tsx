import CardField from '@/components/custom-ui/CardField'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const InProgressCard = () => {
  return (
    <CardField title="In Progress" icon={<IoIosWarning size={22} />}>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Total Tasks</p>
              <p className='font-bold text-3xl'>0</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Active Tasks</p>
              <p className='font-bold text-3xl'>0</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <p className='text-base'>Completed Tasks</p>
              <p className='font-bold text-3xl text-[#27DBA2]'>0</p>
            </div>
          </div>
        </CardField>
  )
}

export default InProgressCard
