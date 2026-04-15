"use client"
import { TableField } from '@/components/custom-ui/TableField';
import { Card } from '@/components/ui/card'
import ProtectedRoute from '@/features/login/components/ProtectedRoute';
import React, { useState, useEffect } from 'react'
import { getKPIMeRankings } from '@/services/kpi/kpiService';
import MotionWrapper from '@/components/custom-ui/MotionWrapper';


const KPIScoring = () => {
  const [activePage, setActivePage] = useState<string>("Research");
  const [myPoint, setMyPoint] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [filterYear] = useState(currentYear);
  const [filterMonth] = useState(currentMonth);

  useEffect(() => {
    console.log('Filter Year:', filterYear, 'Filter Month:', filterMonth + 1);
    const fetchMe = async () => {
      try {
        const res = await getKPIMeRankings(filterYear, filterMonth + 1);
        setMyPoint(res?.totalPoint ?? 0);
      } catch {
        setMyPoint(0);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [filterYear, filterMonth]);

  let statusLabel = 'Note Safe';
  let statusClass = 'text-warning';
  if (!loading && myPoint !== null) {
    if (myPoint <= 150) {
      statusLabel = 'Danger';
      statusClass = 'text-destructive';
    } else if (myPoint <= 250) {
      statusLabel = 'Warning';
      statusClass = 'text-warning';
    } else if (myPoint <= 400) {
      statusLabel = 'Safe';
      statusClass = 'text-success';
    } else if (myPoint > 400) {
      statusLabel = 'Excellent';
      statusClass = 'text-primary';
    }
  }
  return (
    <ProtectedRoute>
      <MotionWrapper>
        <Card>
          <div className="flex flex-col lg:flex-row lg:justify-between px-5 pt-5">
            <div className="flex items-center 3">
                <p className='font-normal text-lg'>KPI Tasks</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="text-center ">
                <p className='text-sm text-secondary-foreground'>Current Rank</p>
                <p className='font-medium text-xl'>4</p>
              </div>
              <div className="w-0.5 h-12 bg-muted opacity-20 hidden lg:flex"></div>
              <div className="text-center">
                <p className='text-sm text-secondary-foreground'>Current</p>
                <p className='font-medium text-xl'>{loading ? '-' : myPoint}</p>
              </div>
              <div className="w-0.5 h-12 bg-muted opacity-20 hidden lg:flex"></div>
              <div className="text-center">
                <p className='text-sm text-secondary-foreground'>Status</p>
                <p className={`font-medium text-xl ${statusClass}`}>{statusLabel}</p>
              </div>
            </div>
          </div>
          <div className="px-5">
            <hr />
          </div>
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={true}
              year={filterYear}
              month={filterMonth + 1}
            />
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  )
}

export default KPIScoring
