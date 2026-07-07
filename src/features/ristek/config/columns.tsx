"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import RistekReviewCell from '@/features/ristek/components/RistekReviewCell';
import type { RistekRow } from '@/features/ristek/types';

function getStatusClass(status?: string): string {
  switch ((status ?? '').toUpperCase()) {
    case 'APPROVED':
      return 'bg-green-100 text-green-700';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'REJECTED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

interface CreateRistekColumnsParams {
  onReview: (id: string, status: string) => void;
}

export function createRistekColumns({ onReview }: CreateRistekColumnsParams): TableColumn<RistekRow>[] {
  return [
    {
      key: 'userId' as keyof RistekRow & string,
      label: 'Name',
      render: (_v, row) => row.userId?.name ?? '-',
    },
    {
      key: 'status',
      label: 'Label',
      render: (_v, row) => (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'action' as keyof RistekRow & string,
      label: 'Action',
      render: (_v, row) => <RistekReviewCell row={row} onReview={onReview} />,
    },
  ];
}
