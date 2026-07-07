"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createReportColumns } from '@/features/report/config/columns';
import { useReportTable } from '@/features/report/hooks/useReportTable';

interface ReportTableProps {
  filterWeek?: string;
  filterProgress?: string;
  fetchTrigger?: number;
  [key: string]: unknown;
}

export default function ReportTable({ filterWeek, filterProgress, fetchTrigger }: ReportTableProps) {
  const { data, loading, error } = useReportTable({ filterWeek, filterProgress, fetchTrigger });
  const columns = useMemo(() => createReportColumns(), []);

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
