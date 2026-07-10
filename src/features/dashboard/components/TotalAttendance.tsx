import React, { useState } from 'react'
import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid'
import DialogField from '@/components/custom-ui/DialogField'
import { useTotalAttendanceCard } from '@/features/dashboard/hooks'
import { useAuth } from '@/features/auth/hooks'
import { getAttendanceSummaryByUserId } from '@/services/attendance/attendanceService'
import DetailAttendanceCard, { type StatusSummary } from '@/features/attendance/components/DetailAttendanceCard'

function getLimitColor(value: number, limit: number): string {
  if (value >= limit) return ' text-destructive';
  if (value === limit - 1) return ' text-warning';
  return '';
}

const TotalAttendance = () => {
  const { summary, spCount } = useTotalAttendanceCard();
  const { user } = useAuth();
  const [detailData, setDetailData] = useState<StatusSummary[] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const sick = summary.sick || 0;
  const permit = summary.permit || 0;
  const late = summary.late || 0;
  const absent = summary.absent || 0;

  const handleOpenDetail = async () => {
    if (!user?.id) return;
    setDetailLoading(true);
    try {
      const res = await getAttendanceSummaryByUserId(user.id);
      setDetailData((res.statusSummary ?? []).map((s) => ({ status: s.status, records: s.records ?? [] })));
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <CardField title="Total Attendance" icon={<MegaphoneIcon />} bg>
      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col text-center gap-5">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Present</p>
              <p className='col-span-1'>:</p>
              <p className='col-span-1 font-semibold'>{summary.present || 0}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Sick</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${getLimitColor(sick, 4)}`}>{Math.min(sick, 4)}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Permit</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${getLimitColor(permit, 2)}`}>{Math.min(permit, 2)}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Late Arrivals</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${getLimitColor(late, 4)}`}>{Math.min(late, 4)}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>No Report</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${getLimitColor(absent, 5)}`}>{absent}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>SP</p>
              <p className='col-span-1'>:</p>
              <p className='col-span-1 font-semibold'>{spCount}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 cursor-pointer">
          <DialogField
            name="Detail"
            title="Attendance Detail"
            variant="link"
            noPaddingX
            noPadding
            onTriggerClick={handleOpenDetail}
          >
            {detailLoading ? (
              <p className="text-center text-sm text-gray-500">Loading...</p>
            ) : detailData ? (
              <DetailAttendanceCard statusSummary={detailData} />
            ) : (
              <p className="text-center text-sm text-gray-500">No detail data available.</p>
            )}
          </DialogField>
          <ArrowUpRightIcon className="text-primary text-base font-normal size-4" />
        </div>
      </div>
    </CardField>
  )
}

export default TotalAttendance
