"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import type { TableColumn } from '@/features/table/components';
import type { PointsDetailRow } from '@/features/points/types';

interface CreatePointsDetailColumnsParams {
  onEdit?: (item: PointsDetailRow) => void;
}

export function createPointsDetailColumns({ onEdit }: CreatePointsDetailColumnsParams): TableColumn<PointsDetailRow>[] {
  return [
    { key: 'kpi_item', label: 'Name', className: 'text-center' },
    {
      key: 'point',
      label: 'Weight',
      className: 'text-center',
      render: (_v, row) => `${row.point}%`,
    },
    { key: 'max_activity', label: 'Activity Limit', className: 'text-center' },
    { key: 'label', label: 'Requirement', className: 'text-center' },
    {
      key: 'action' as keyof PointsDetailRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) =>
        onEdit ? (
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            Edit
          </Button>
        ) : null,
    },
  ];
}
