import { useEffect, useState } from 'react';
import { getAttendanceMe } from '@/services/attendance/attendanceService';
import { handleError } from '@/shared/services';

interface StatusSummaryItem {
  status: string;
  count: number;
}

export function useTotalAttendanceCard() {
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [spCount, setSpCount] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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
      } catch (err) {
        setError(handleError(err));
        setSummary({});
        setSpCount(0);
      }
    };
    fetchSummary();
  }, []);

  return { summary, spCount, error };
}
