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
    { key: 'kpi_item', label: 'Name' },
    {
      key: 'point',
      label: 'Weight',
      render: (_v, row) => `${row.point}%`,
    },
    { key: 'max_activity', label: 'Activity Limit' },
    { key: 'label', label: 'Requirement' },
    {
      key: 'action' as keyof PointsDetailRow & string,
      label: 'Action',
      render: (_v, row) =>
        onEdit ? (
          <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
            Edit
          </Button>
        ) : null,
    },
  ];
}
