"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import type { TableColumn } from '@/features/table/components';
import type { PointsDetailRow } from '@/features/points/types';

interface CreatePointsDetailColumnsParams {
  onEdit?: (item: PointsDetailRow) => void;
  onDelete?: (item: PointsDetailRow) => void;
}

export function createPointsDetailColumns({ onEdit, onDelete }: CreatePointsDetailColumnsParams): TableColumn<PointsDetailRow>[] {
  return [
    { key: 'kpi_item', label: 'Name', className: 'text-center', sortable: true },
    {
      key: 'point',
      label: 'Weight',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => `${row.point}%`,
    },
    { key: 'max_activity', label: 'Activity Limit', className: 'text-center', sortable: true },
    { key: 'label', label: 'Requirement', className: 'text-center', sortable: true },
    {
      key: 'action' as keyof PointsDetailRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-2">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
              onClick={() => onDelete(row)}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];
}
