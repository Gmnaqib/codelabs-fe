"use client"

import React, { useCallback, useMemo } from 'react';
import { ScheduleTable } from '@/features/operational/components/ScheduleTable';
import { createThematicColumns } from '@/features/operational/config/columns';
import { useOperationalTable, useThematicStatus } from '@/features/operational/hooks';
import { matchesSearch } from '@/features/operational/utils/search';
import type { OperationalTabProps } from '@/features/operational/types';

export default function ThematicTab({ users, loading, searchQuery }: OperationalTabProps) {
  const { isChecked } = useOperationalTable();
  const { getStatus: getThematicStatus, loading: statusLoading } = useThematicStatus();

  const filtered = useMemo(
    () => users.filter((u) => matchesSearch(u, searchQuery)),
    [users, searchQuery]
  );

  const getStatus = useCallback(
    (userId: string, day: number) => getThematicStatus(isChecked(userId, day), day),
    [isChecked, getThematicStatus]
  );

  const { left, scroll, right } = useMemo(() => createThematicColumns(getStatus), [getStatus]);

  return (
    <ScheduleTable
      data={filtered}
      leftColumns={left}
      scrollColumns={scroll}
      rightColumns={right}
      loading={loading || statusLoading}
      emptyMessage="Tidak ada data tematik"
    />
  );
}
