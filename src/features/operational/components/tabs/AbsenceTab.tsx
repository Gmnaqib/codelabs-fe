"use client"

import React, { useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { ScheduleTable } from '@/features/operational/components/ScheduleTable';
import { createAbsenceColumns } from '@/features/operational/config/columns';
import { useAbsenceStatus } from '@/features/operational/hooks';
import { matchesSearch } from '@/features/operational/utils/search';
import type { OperationalTabProps } from '@/features/operational/types';

const STATUS_LEGEND = [
  { icon: <CheckCircleIcon className="size-5 text-primary" />, label: 'The member checked in and checked out on this day.' },
  { icon: <MinusCircleIcon className="size-5 text-neutral" />, label: 'Absent without any explanation.' },
  { icon: <PlusCircleIcon className="size-5 text-success" />, label: 'Absent due to illness.' },
  { icon: <ExclamationCircleIcon className="size-5 text-warning" />, label: 'Absent with permission.' },
];

export default function AbsenceTab({ users, loading, searchQuery }: OperationalTabProps) {
  const [showLegend, setShowLegend] = useState(true);
  const { getStatus, loading: statusLoading, error } = useAbsenceStatus();

  const filtered = useMemo(
    () => users.filter((u) => matchesSearch(u, searchQuery)),
    [users, searchQuery]
  );

  const { left, scroll, right } = useMemo(() => createAbsenceColumns(getStatus), [getStatus]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden rounded-md bg-secondary p-4 sm:block">
        <div className="flex items-center justify-between">
          <p className="font-medium">Attendance Status Indicators :</p>
          <button
            type="button"
            className="text-sm text-primary hover:underline"
            onClick={() => setShowLegend((prev) => !prev)}
          >
            {showLegend ? 'Hide' : 'Show information'}
          </button>
        </div>
        {showLegend && (
          <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            {STATUS_LEGEND.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                {item.icon} : {item.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ScheduleTable
        data={filtered}
        leftColumns={left}
        scrollColumns={scroll}
        rightColumns={right}
        loading={loading || statusLoading}
        emptyMessage="Tidak ada data absensi"
      />
    </div>
  );
}
