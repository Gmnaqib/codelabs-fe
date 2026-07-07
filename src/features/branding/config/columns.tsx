"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import { getStatusColor } from '@/utils/statusColor';
import BrandingReviewCell from '@/features/branding/components/BrandingReviewCell';
import type { BrandingRow } from '@/features/branding/types';

function getStatusLabel(status: string | number | null | undefined): string {
  if (status === null || status === undefined || status === '') return 'Pending';
  const num = Number(status);
  if (num === 0) return 'Rejected';
  if (num >= 1 && num <= 5) return 'Approved';
  return 'Pending';
}

interface CreateBrandingColumnsParams {
  onReview: (id: string, status: string) => void;
}

export function createBrandingColumns({ onReview }: CreateBrandingColumnsParams): TableColumn<BrandingRow>[] {
  return [
    { key: 'name', label: 'Name', render: (_v, row) => row.name },
    {
      key: 'status',
      label: 'Label',
      render: (_v, row) => (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(getStatusLabel(row.status))}`}>
          {getStatusLabel(row.status)}
        </span>
      ),
    },
    {
      key: 'action' as keyof BrandingRow & string,
      label: 'Action',
      render: (_v, row) => <BrandingReviewCell row={row} onReview={onReview} />,
    },
  ];
}
