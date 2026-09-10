"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createPointsColumns } from '@/features/points/config/columns';
import { usePointsTable } from '@/features/points/hooks/usePointsTable';
import type { PointsRow } from '@/features/points/types';

interface PointsTableProps {
  fetchTrigger?: number;
  onEdit?: (item: PointsRow) => void;
  [key: string]: unknown;
}

export default function PointsTable({ fetchTrigger, onEdit }: PointsTableProps) {
  const { data, loading, error } = usePointsTable({ fetchTrigger });
  const columns = useMemo(() => createPointsColumns({ onEdit }), [onEdit]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="No data available"
    />
  );
}
