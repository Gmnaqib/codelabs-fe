import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import LineChart from '@/components/custom-ui/LineChart'
import { ChartPieIcon } from '@heroicons/react/24/solid'

const OrganizationStatistics = ({ className }: { className?: string }) => {
  return (
    <div className={`${className}`}>
        <CardField title='Organization Statistic' icon={<ChartPieIcon />} filterYear>
          {(year: string) => <LineChart year={year} />}
        </CardField>
    </div>
  )
}

export default OrganizationStatistics
