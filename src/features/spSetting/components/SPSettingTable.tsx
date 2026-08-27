"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createSPSettingColumns } from '@/features/spSetting/config/columns';
import { useSPSettingTable } from '@/features/spSetting/hooks/useSPSettingTable';
import type { SPSettingRow } from '@/features/spSetting/types';

interface SPSettingTableProps {
  fetchTrigger?: number;
  onEdit: (item: SPSettingRow) => void;
  [key: string]: unknown;
}

export default function SPSettingTable({ fetchTrigger, onEdit }: SPSettingTableProps) {
  const { data, loading, error, refetch } = useSPSettingTable({ fetchTrigger });
  const columns = useMemo(() => createSPSettingColumns({ onEdit, onDeleted: refetch }), [onEdit, refetch]);

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
