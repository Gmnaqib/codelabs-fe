"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createRistekColumns } from '@/features/ristek/config/columns';
import { useRistekTable } from '@/features/ristek/hooks/useRistekTable';

interface RistekTableProps {
  filterContentType?: string;
  filterWeek?: string;
  [key: string]: unknown;
}

export default function RistekTable({ filterContentType, filterWeek }: RistekTableProps) {
  const { data, loading, error, handleReview } = useRistekTable({
    filterSubResearch: filterContentType,
    filterWeek,
  });
  const columns = useMemo(() => createRistekColumns({ onReview: handleReview }), [handleReview]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Tidak ada data research"
    />
  );
}
