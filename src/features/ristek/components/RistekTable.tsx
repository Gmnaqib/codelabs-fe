"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import EmptyState from '@/components/custom-ui/EmptyState';
import { createRistekColumns } from '@/features/ristek/config/columns';
import { useRistekTable } from '@/features/ristek/hooks/useRistekTable';

interface RistekTableProps {
  filterWeek?: string;
  [key: string]: unknown;
}

export default function RistekTable({ filterWeek }: RistekTableProps) {
  const { data, loading, error, handleReview, isBackendEmpty } = useRistekTable({
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
      emptyMessage={
        isBackendEmpty ? (
          <EmptyState message="No research data available" />
        ) : (
          'No research data available'
        )
      }
    />
  );
}
