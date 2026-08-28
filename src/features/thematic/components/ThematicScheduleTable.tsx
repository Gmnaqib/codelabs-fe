"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createThematicScheduleColumns } from '@/features/thematic/config/columns';
import type { ThematicRow } from '@/features/thematic/types';

interface ThematicScheduleTableProps {
  data: ThematicRow[];
  loading?: boolean;
}

// Presentational: the swap action and the day's category badge both live
// outside the table now — see schedule/page.tsx's button row.
export default function ThematicScheduleTable({ data, loading = false }: ThematicScheduleTableProps) {
  const columns = useMemo(() => createThematicScheduleColumns(), []);

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="There is no thematic data for this day"
    />
  );
}
