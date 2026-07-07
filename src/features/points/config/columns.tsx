"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import PointsActionsCell from '@/features/points/components/PointsActionsCell';
import type { PointsRow } from '@/features/points/types';

interface CreatePointsColumnsParams {
  onEdit?: (item: PointsRow) => void;
}

export function createPointsColumns({ onEdit }: CreatePointsColumnsParams): TableColumn<PointsRow>[] {
  return [
    { key: 'kementerian', label: 'Ministry' },
    {
      key: 'point',
      label: 'Weight',
      render: (_v, row) => `${row.point}%`,
    },
    {
      key: 'utilized' as keyof PointsRow & string,
      label: 'Utilized',
      render: (_v, row) => {
        const utilized = row.utilized ?? 0;
        const isFull = utilized >= row.point;
        return (
          <>
            <span className={isFull ? 'text-green-600 font-medium' : 'text-amber-500 font-medium'}>
              {utilized}%
            </span>
            <span className="text-gray-400 text-xs ml-1">/ {row.point}%</span>
          </>
        );
      },
    },
    {
      key: 'action' as keyof PointsRow & string,
      label: 'Action',
      render: (_v, row) => <PointsActionsCell row={row} onEdit={onEdit} />,
    },
  ];
}
