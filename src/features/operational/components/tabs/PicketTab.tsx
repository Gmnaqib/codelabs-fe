"use client"

import React, { useCallback, useMemo } from 'react';
import { ScheduleTable } from '@/features/operational/components/ScheduleTable';
import { createPicketColumns } from '@/features/operational/config/columns';
import { useOperationalTable, usePicketStatus } from '@/features/operational/hooks';
import { useTableStore } from '@/shared/state';
import { matchesSearch } from '@/features/operational/utils/search';
import type { OperationalTabProps } from '@/features/operational/types';

export default function PicketTab({ users, loading, searchQuery }: OperationalTabProps) {
  const { isChecked } = useOperationalTable();
  const { getStatus: getPicketStatus, loading: statusLoading } = usePicketStatus();
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);

  const filtered = useMemo(
    () => users.filter((u) => matchesSearch(u, searchQuery)),
    [users, searchQuery]
  );

  const getStatus = useCallback(
    (userId: string, week: number) => getPicketStatus(isChecked(userId, week), userId, week),
    [isChecked, getPicketStatus]
  );

  const { left, scroll, right } = useMemo(
    () => createPicketColumns(getStatus, year, month),
    [getStatus, year, month]
  );

  return (
    <ScheduleTable
      data={filtered}
      leftColumns={left}
      scrollColumns={scroll}
      rightColumns={right}
      loading={loading || statusLoading}
      emptyMessage="Tidak ada data piket"
    />
  );
}
