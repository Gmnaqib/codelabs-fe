import React, { useEffect, useState } from 'react'
import { getKPIRankings } from '@/services/kpi/kpiService'
import Link from 'next/link'
import CardField from '@/components/custom-ui/CardField'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid'

const AverageMonthly = () => {
  const [average, setAverage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverage = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const data = await getKPIRankings(year, month);
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((sum, user) => sum + (user.totalPoints || 0), 0);
          setAverage(Math.round(total / data.length));
        } else {
          setAverage(0);
        }
      } catch {
        setAverage(0);
      } finally {
        setLoading(false);
      }
    };
    fetchAverage();
  }, []);

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
