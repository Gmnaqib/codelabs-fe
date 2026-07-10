"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import CompetitionReviewCell from '@/features/competition/components/CompetitionReviewCell';
import type { CompetitionRow } from '@/features/competition/types';

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

interface CreateCompetitionColumnsParams {
  onReview: (id: string, status: string) => void;
}

export function createCompetitionColumns({ onReview }: CreateCompetitionColumnsParams): TableColumn<CompetitionRow>[] {
  return [
    { key: 'name', label: 'Name', className: 'text-center', render: (_v, row) => row.name ?? '-' },
    {
      key: 'status',
      label: 'Label',
      className: 'text-center hidden md:table-cell',
      render: (_v, row) => (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusClass(row.status)}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'action' as keyof CompetitionRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <CompetitionReviewCell row={row} onReview={onReview} />,
    },
  ];
}
