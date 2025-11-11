import CardField from '@/components/custom-ui/CardField'
import LineChart from '@/components/custom-ui/LineChart'
import React from 'react'
import { IoStatsChart } from 'react-icons/io5'

const OrganizationStatistics = ({ className }: { className?: string }) => {
  return (
    <div className={`${className}`}>
        <CardField title='Organization Statistics' icon={<IoStatsChart size={22} />}>
            <LineChart />
    </CardField>
    </div>
  )
}

export default OrganizationStatistics
