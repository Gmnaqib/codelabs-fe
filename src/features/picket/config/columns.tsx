"use client"

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { TableColumn } from '@/features/table/components';
import PicketSwapCell from '@/features/picket/components/PicketSwapCell';
import type { PicketRow, PicketSwapSchedule } from '@/features/picket/types';

interface CreatePicketScheduleColumnsParams {
  checkedUsers: Record<string, boolean>;
  rangeSchedules: PicketSwapSchedule[];
  onToggle: (userId: string, checked: boolean) => void;
  onSwap: (userId: string, targetScheduleId: string, targetUserId: string) => void;
}

export function createPicketScheduleColumns({
  checkedUsers,
  rangeSchedules,
  onToggle,
  onSwap,
}: CreatePicketScheduleColumnsParams): TableColumn<PicketRow>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => row.name.split(' ')[0],
    },
    {
      key: 'status' as keyof PicketRow & string,
      label: 'Status',
      className: 'text-center',
      render: (_v, row) => (
        <Checkbox
          checked={!!checkedUsers[row._id]}
          onCheckedChange={(checked) => onToggle(row._id, !!checked)}
        />
      ),
    },
    {
      key: 'swap' as keyof PicketRow & string,
      label: 'Swap',
      className: 'text-center',
      render: (_v, row) => (
        <PicketSwapCell row={row} rangeSchedules={rangeSchedules} onSwap={onSwap} />
      ),
    },
  ];
}
