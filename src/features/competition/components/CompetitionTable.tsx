"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createCompetitionColumns } from '@/features/competition/config/columns';
import { useCompetitionTable } from '@/features/competition/hooks/useCompetitionTable';

interface CompetitionTableProps {
  [key: string]: unknown;
}

export default function CompetitionTable(_props: CompetitionTableProps) {
  const { data, loading, error, handleReview } = useCompetitionTable();
  const columns = useMemo(() => createCompetitionColumns({ onReview: handleReview }), [handleReview]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      emptyMessage="Tidak ada data lomba"
    />
  );
}
