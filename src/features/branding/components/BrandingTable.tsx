"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import EmptyState from '@/components/custom-ui/EmptyState';
import { createBrandingColumns } from '@/features/branding/config/columns';
import { useBrandingTable } from '@/features/branding/hooks/useBrandingTable';

interface BrandingTableProps {
  filterWeek?: string;
  filterContentType?: string;
  [key: string]: unknown;
}

export default function BrandingTable({ filterWeek, filterContentType }: BrandingTableProps) {
  const { data, loading, error, handleReview, isBackendEmpty } = useBrandingTable({ filterWeek, filterContentType });
  const columns = useMemo(() => createBrandingColumns({ onReview: handleReview }), [handleReview]);

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
          <EmptyState message="No branding data available." />
        ) : (
          'No branding data available.'
        )
      }
    />
  );
}
