import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { Progress } from '@/components/ui/progress'
import { ChartBarSquareIcon } from '@heroicons/react/24/solid'
import { getKPIMeRankings } from '@/services/kpi/kpiService'

const MonthlyProgressCard = () => {
  const [totalPoints, setTotalPoints] = React.useState<number>(0);
  const [rank, setRank] = React.useState<number | null>(null);
  const [name, setName] = React.useState<string>("");
  React.useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const fetchKPI = async () => {
      try {
        const data = await getKPIMeRankings(year, month);
        setTotalPoints(data.totalPoints);
        setRank(data.rank ?? null);
        setName(data.name ?? "");
      } catch {
        setTotalPoints(0);
        setRank(null);
        setName("");
      }
    };
    fetchKPI();
  }, []);
  let statusLabel = 'Note Safe';
  let statusClass = 'text-warning';
  if (totalPoints !== null) {
    if (totalPoints <= 150) {
      statusLabel = 'Danger';
      statusClass = 'text-destructive';
    } else if (totalPoints <= 250) {
      statusLabel = 'Warning';
      statusClass = 'text-warning';
    } else if (totalPoints <= 400) {
      statusLabel = 'Safe';
      statusClass = 'text-success';
    } else if (totalPoints > 400) {
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
          {name && <p className='text-sm text-muted'>Name: {name}</p>}
        </div>
        <div className="flex flex-col text-center">
          <p className='text-sm text-muted'>Curent Points</p>
          <p className='font-medium text-2xl text-primary'>{totalPoints}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className='font-normal text-md'>Your KPI Progress</p>
          <Progress value={Math.floor(totalPoints / 4)} />
          <p className={`text-center ${statusClass}`}>{statusLabel}</p>
        </div>
      </div>
    </CardField>
  )
}

export default MonthlyProgressCard
