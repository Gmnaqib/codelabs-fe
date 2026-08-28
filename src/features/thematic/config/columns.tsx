"use client"

import type { TableColumn } from '@/features/table/components';
import type { ThematicRow } from '@/features/thematic/types';

export function createThematicScheduleColumns(): TableColumn<ThematicRow>[] {
  return [
    {
      key: 'name',
      label: 'Name',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => row.name.split(' ')[0],
    },
  ];
}
