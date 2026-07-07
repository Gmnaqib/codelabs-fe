"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createAssessmentsColumns } from '@/features/assessments/config/columns';
import { useAssessmentsTable } from '@/features/assessments/hooks/useAssessmentsTable';

interface AssessmentsTableProps {
  [key: string]: unknown;
}

export default function AssessmentsTable(_props: AssessmentsTableProps) {
  const { data, loading, error, year, month } = useAssessmentsTable();
  const columns = useMemo(() => createAssessmentsColumns({ year, month }), [year, month]);

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
