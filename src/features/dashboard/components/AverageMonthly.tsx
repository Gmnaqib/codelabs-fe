import React from 'react'
import Link from 'next/link'
import CardField from '@/components/custom-ui/CardField'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'
import { useAverageMonthlyCard } from '@/features/dashboard/hooks'

const AverageMonthly = () => {
  const { average, loading } = useAverageMonthlyCard();

  let statusLabel = 'Note Safe';
  let statusClass = 'text-warning';
  if (!loading && average !== null) {
    if (average <= 150) {
      statusLabel = 'Danger';
      statusClass = 'text-destructive';
    } else if (average <= 250) {
      statusLabel = 'Warning';
      statusClass = 'text-warning';
    } else if (average <= 400) {
      statusLabel = 'Safe';
      statusClass = 'text-success';
    } else if (average > 400) {
      statusLabel = 'Excellent';
      statusClass = 'text-primary';
    }
  }

  return (
    <CardField title="Average Monthly Points" icon={<ArrowTrendingUpIcon />}>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <p className='w-full flex justify-center font-semibold text-2xl text-primary'>
            {loading ? '-' : average}
          </p>
          <div className="flex items-center justify-center px-2">
            <div className="bg-muted w-0.5 h-6"></div>
          </div>
          <p className={`w-full flex justify-center font-medium text-2xl ${statusClass}`}>{statusLabel}</p>
        </div>
        <Link href="/assessments" className='text-primary text-base text-center'>See More</Link>
      </div>
    </CardField>
  )
}

export default AverageMonthly
