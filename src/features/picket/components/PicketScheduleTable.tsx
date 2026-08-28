"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createPicketScheduleColumns } from '@/features/picket/config/columns';
import { usePicketScheduleTable } from '@/features/picket/hooks/usePicketScheduleTable';

interface PicketScheduleTableProps {
  fetchTrigger?: number;
  // ISO date (yyyy-MM-dd) to view instead of today's schedule.
  date?: string;
  [key: string]: unknown;
}

export default function PicketScheduleTable({ fetchTrigger, date }: PicketScheduleTableProps) {
  const { picketData, loading, checkedUsers, rangeSchedules, handleToggle, handleSwap } =
    usePicketScheduleTable({ fetchTrigger, date });

  const columns = useMemo(
    () => createPicketScheduleColumns({ checkedUsers, rangeSchedules, onToggle: handleToggle, onSwap: handleSwap }),
    [checkedUsers, rangeSchedules, handleToggle, handleSwap]
  );

  return (
    <BaseTable
      data={picketData}
      columns={columns}
      loading={loading}
      emptyMessage="There is no picket data for this day"
    />
  );
}
