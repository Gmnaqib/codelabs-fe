import React from 'react'
import CardField from '@/components/custom-ui/CardField'
import { MegaphoneIcon } from '@heroicons/react/24/solid'
import { getAttendanceMe } from '@/services/attendance/attendanceService'

const TotalAttendance = () => {
  const [summary, setSummary] = React.useState<Record<string, number>>({});
  const [spCount, setSpCount] = React.useState<number>(0);
  React.useEffect(() => {
    interface StatusSummaryItem {
      status: string;
      count: number;
    }
    const fetchSummary = async () => {
      try {
        const data = await getAttendanceMe();
        const map: Record<string, number> = {};
        if (data && Array.isArray(data.statusSummary)) {
          (data.statusSummary as StatusSummaryItem[]).forEach((item) => {
            map[item.status] = item.count;
          });
        }
        const sick = map.sick || 0;
        const permit = map.permit || 0;
        const late = map.late || 0;
        let absent = map.absent || 0;
        const sickExcess = sick > 4 ? sick - 4 : 0;
        const permitExcess = permit > 2 ? permit - 2 : 0;
        const lateExcess = late > 4 ? late - 4 : 0;
        absent += sickExcess + permitExcess + lateExcess;
        let sp = 0;
        if (absent >= 12) {
          sp = 3;
        } else if (absent >= 8) {
          sp = 2;
        } else if (absent >= 4) {
          sp = 1;
        }
        setSummary({ ...map, absent });
        setSpCount(sp);
      } catch {
        setSummary({});
        setSpCount(0);
      }
    };
    fetchSummary();
  }, []);

  return (
    <CardField title="Total Attendance" icon={<MegaphoneIcon />} bg>
      <div className="flex flex-col gap-4">
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
              <p className={`col-span-1 font-semibold${(summary.sick || 0) > 4 ? ' text-destructive' : ''}`}>{summary.sick || 0}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Permit</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${(summary.permit || 0) > 2 ? ' text-destructive' : ''}`}>{summary.permit || 0}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>Late Arrivals</p>
              <p className='col-span-1'>:</p>
              <p className={`col-span-1 font-semibold${(summary.late || 0) > 4 ? ' text-destructive' : ''}`}>{summary.late || 0}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>No Report</p>
              <p className='col-span-1'>:</p>
              <p className='col-span-1 font-semibold'>{summary.absent || 0}</p>
            </div>
            <div className="grid grid-cols-12">
              <p className='col-span-5 text-left'>SP</p>
              <p className='col-span-1'>:</p>
              <p className='col-span-1 font-semibold'>{spCount}</p>
            </div>
          </div>
        </div>
      </div>
    </CardField>
  )
}

export default TotalAttendance
