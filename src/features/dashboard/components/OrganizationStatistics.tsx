import CardField from '@/components/custom-ui/CardField'
import LineChart from '@/components/custom-ui/LineChart'
import React from 'react'
import { IoStatsChart } from 'react-icons/io5'

const OrganizationStatistics = ({ className }: { className?: string }) => {
  return (
    <div className={`${className}`}>
        <CardField title='Organization Statistics' icon={<IoStatsChart size={22} />}>
        <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2">
                <div className="h-2 w-7 bg-green-500"></div>
                <p className='text-ring text-xs'>Research Points</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-2 w-7 bg-[#00D0FF]"></div>
                <p className='text-ring text-xs'>Attendance Points</p>
            </div>
        </div>
        <div className='h-60'>
            <LineChart />
        </div>
    </CardField>
    </div>
  )
}

export default OrganizationStatistics
