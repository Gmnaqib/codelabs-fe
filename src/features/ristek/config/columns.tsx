"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import RistekReviewCell from '@/features/ristek/components/RistekReviewCell';
import { getResearchStatusDisplay } from '@/shared/constants';
import type { RistekRow } from '@/features/ristek/types';

interface CreateRistekColumnsParams {
  onReview: (id: string, status: number) => void;
}

export function createRistekColumns({ onReview }: CreateRistekColumnsParams): TableColumn<RistekRow>[] {
  return [
    {
      key: 'userId' as keyof RistekRow & string,
      label: 'Name',
      className: 'text-center',
      render: (_v, row) => row.userId?.name ?? '-',
    },
    {
      key: 'status',
      label: 'Label',
      className: 'text-center',
      render: (_v, row) => {
        const { label, className } = getResearchStatusDisplay(row.status);
        return (
          <span className={`px-2 py-1 rounded-md text-sm font-medium ${className}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'action' as keyof RistekRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <RistekReviewCell row={row} onReview={onReview} />,
    },
  ];
}
