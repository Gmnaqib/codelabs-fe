import CardField from '@/components/custom-ui/CardField'
import { Progress } from '@/components/ui/progress'
import React from 'react'
import { IoIosWarning } from 'react-icons/io'

const MonthlyProgressCard = () => {
  return (
    <CardField title="Monthly Progress" icon={<IoIosWarning size={22} />}>
          <div className="flex flex-col gap-3">
            <div className="flex justify-around">
              <div className="flex flex-col gap-2 text-center">
                <p className='text-sm text-[#7F7F7F]'>Curent Rank</p>
                <p className='font-semibold text-2xl'>19</p>
              </div>
              <div className="bg-slate-400 w-0.5 h-14"></div>
              <div className="flex flex-col gap-2 text-center">
                <p className='text-sm text-[#7F7F7F]'>Curent Rank</p>
                <p className='font-semibold text-2xl'>0%</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className='font-semibold text-base'>Your KPI Progress</p>
              <Progress value={33} />
            </div>
          </div>
        </CardField>
  )
}

export default MonthlyProgressCard
