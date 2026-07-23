"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import { getBrandingStatusDisplay } from '@/shared/constants';
import BrandingReviewCell from '@/features/branding/components/BrandingReviewCell';
import type { BrandingRow } from '@/features/branding/types';

interface CreateBrandingColumnsParams {
  onReview: (id: string, status: string) => void;
}

export function createBrandingColumns({ onReview }: CreateBrandingColumnsParams): TableColumn<BrandingRow>[] {
  return [
    { key: 'name', label: 'Name', className: 'text-center', sortable: true, render: (_v, row) => row.name },
    {
      key: 'status',
      label: 'Label',
      className: 'text-center hidden md:table-cell',
      sortable: true,
      sortValue: (row) => getBrandingStatusDisplay(row.status).label,
      render: (_v, row) => {
        const { label, className } = getBrandingStatusDisplay(row.status);
        return (
          <span className={`px-2 py-1 rounded-md text-sm font-medium ${className}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'action' as keyof BrandingRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <BrandingReviewCell row={row} onReview={onReview} />,
    },
  ];
}
