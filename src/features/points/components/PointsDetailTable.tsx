"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createPointsDetailColumns } from '@/features/points/config/detailColumns';
import { usePointsDetailTable } from '@/features/points/hooks/usePointsDetailTable';
import type { PointsDetailRow } from '@/features/points/types';

interface PointsDetailTableProps {
  fetchTrigger?: number;
  onEdit?: (item: PointsDetailRow) => void;
  [key: string]: unknown;
}

export default function PointsDetailTable({ fetchTrigger, onEdit }: PointsDetailTableProps) {
  const { data, loading, error } = usePointsDetailTable({ fetchTrigger });
  const columns = useMemo(() => createPointsDetailColumns({ onEdit }), [onEdit]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Tidak ada data"
    />
  );
}
