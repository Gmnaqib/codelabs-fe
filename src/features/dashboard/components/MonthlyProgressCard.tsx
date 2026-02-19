import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { Progress } from '@/components/ui/progress'
import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { getKPIMeRankings } from '@/services/kpi/kpiService'

const MonthlyProgressCard = () => {
  const [totalPoint, setTotalPoint] = React.useState<number>(0);
  React.useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fetchKPI = async () => {
      try {
        const data = await getKPIMeRankings(year, month);
        setTotalPoint(data.totalPoint);
      } catch {
        setTotalPoint(0);
      }
    };
    fetchKPI();
  }, []);
  return (
    <CardField title="Monthly Progress" icon={<ChartBarSquareIcon />} bg>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Curent Rank</p>
          <p className='font-medium text-2xl text-primary'>19</p>
        </div>
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Curent Points</p>
          <p className='font-medium text-2xl text-primary'>{totalPoint}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className='font-normal text-md'>Your KPI Progress</p>
          <Progress value={33} />
          <p className='text-center text-destructive'>Danger</p>
        </div>
      </div>
    </CardField>
  )
}

export default MonthlyProgressCard
