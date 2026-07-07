"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createPicketColumns } from '@/features/operational/config/columns';
import { useOperationalTable } from '@/features/operational/hooks';
import type { OperationalTabProps } from '@/features/operational/types';

export default function PicketTab({ users, loading, searchQuery }: OperationalTabProps) {
  const { handleToggle, isChecked } = useOperationalTable();

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [users, searchQuery]
  );

  const columns = useMemo(
    () => createPicketColumns(handleToggle, isChecked),
    [handleToggle, isChecked]
  );

  return (
    <BaseTable
      data={filtered}
      columns={columns}
      loading={loading}
      emptyMessage="Tidak ada data piket"
    />
  );
}
