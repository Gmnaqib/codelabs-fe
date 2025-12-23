import React, { useEffect, useState } from "react";
import { getOperationalRecords } from "@/services/operational/operationalService";

const getMonthWeeks = (year: number, month: number) => {
  const first = new Date(year, month - 1, 1);
  // find Monday of the week that contains the 1st (ISO-like, Monday=1)
  const dayOfWeek = (first.getDay() + 6) % 7; // Monday=0..Sunday=6
  const monday = new Date(first);
  monday.setDate(first.getDate() - dayOfWeek);

  const weeks: number[][] = [];
  for (let w = 0; w < 5; w++) {
    const weekDays: number[] = [];
    for (let d = 0; d < 5; d++) {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + w * 7 + d);
      if (dt.getMonth() + 1 === month) weekDays.push(dt.getDate());
      else weekDays.push(-1); 
    }
    weeks.push(weekDays);
  }
  return weeks;
};

const picketCache = new Map<string, any[]>();

const PicketCellInner = ({ userId, day, context }: any) => {
  const [records, setRecords] = useState<any[] | null>(null);
  const year = context?.year ?? new Date().getFullYear();
  const month = context?.month ?? new Date().getMonth() + 1;

  useEffect(() => {
    if (!userId) return;
    const key = `picket-${userId}-${year}-${month}`;
    if (picketCache.has(key)) {
      setRecords(picketCache.get(key) || []);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await getOperationalRecords("picket", userId, year, month);
        picketCache.set(key, res || []);
        if (mounted) setRecords(res || []);
      } catch (err) {
        picketCache.set(key, []);
        if (mounted) setRecords([]);
      }
    })();
    return () => { mounted = false; };
  }, [userId, year, month]);

  const weeks = getMonthWeeks(Number(year), Number(month));
  const weekIndex = Number(day) - 1;
  const weekDays = weeks[weekIndex] || [];

  if (records === null) return <span className="text-muted">loading</span>;

  // check assigned: any record date falls into this week's days (match full date)
  const assigned = records.some((r) => {
  if (!r.date) return false;

  const raw = new Date(r.date);

  // NORMALISASI KE LOCAL DATE (BUANG JAM & ZONE)
  const d = new Date(
    raw.getFullYear(),
    raw.getMonth(),
    raw.getDate()
  );

  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();

  if (y !== year || m !== month) return false;

  return weekDays.includes(dd);
});


  if (assigned) return <span className="text-primary">picket</span>;

  const now = new Date();
const isSameMonth =
  now.getFullYear() === year &&
  now.getMonth() + 1 === month;

const today = isSameMonth ? now.getDate() : Infinity;


  // if all week days are out-of-month (-1), show not yet picket
  const validDays = weekDays.filter((d) => d > 0);
  if (validDays.length === 0) return <span className="text-muted">not yet picket</span>;

  // if any day in the week is >= today -> not yet picket, else no picket
  const hasFutureOrToday = validDays.some((d) => d >= today);
  if (hasFutureOrToday) return <span className="text-muted">not yet picket</span>;

  return <span className="text-muted">no picket</span>;
};

export const renderPicketCell = (
  day: string | number,
  rowIndex: number,
  data: any[],
  context?: { month?: number; year?: number; daysArray?: any[] }
) => {
  const user = data[rowIndex];
  const userId = user?._id;
  return <PicketCellInner userId={userId} day={day} context={context} />;
};

export default renderPicketCell;
