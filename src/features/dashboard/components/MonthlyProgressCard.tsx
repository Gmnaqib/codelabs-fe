import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { Progress } from '@/components/ui/progress'
import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { useMonthlyProgressCard } from '@/features/dashboard/hooks'

const MonthlyProgressCard = () => {
  const { totalPoints, rank } = useMonthlyProgressCard();

  let statusLabel = 'Note Safe';
  let statusClass = 'text-warning';
  if (totalPoints !== null) {
    if (totalPoints < 25) {
      statusLabel = 'Danger';
      statusClass = 'text-destructive';
    } else if (totalPoints < 50) {
      statusLabel = 'Warning';
      statusClass = 'text-warning';
    } else if (totalPoints < 100) {
      statusLabel = 'Safe';
      statusClass = 'text-success';
    } else {
      statusLabel = 'Excellent';
      statusClass = 'text-primary';
    }
  }
  return (
    <CardField title="Monthly Progress" icon={<ChartBarSquareIcon />} bg>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Curent Rank</p>
          <p className='font-medium text-2xl text-primary'>{rank !== null ? rank : '-'}</p>
        </div>
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Curent Points</p>
          <p className='font-medium text-2xl text-primary'>{totalPoints}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className='font-normal text-md'>Your KPI Progress</p>
          <Progress value={Math.floor(totalPoints)} />
          <p className={`text-center ${statusClass}`}>{statusLabel}</p>
        </div>
      </div>
    </CardField>
  )
}

export default MonthlyProgressCard
