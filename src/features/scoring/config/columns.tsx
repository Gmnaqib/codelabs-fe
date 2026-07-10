"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import { getStatusColor } from '@/utils/statusColor';
import { getBrandingStatusDisplay } from '@/shared/constants';
import type { CompetitionPayload } from '@/services/competition/competitionService';
import CompetitionActionsCell from '@/features/scoring/components/CompetitionActionsCell';
import BrandingActionsCell from '@/features/scoring/components/BrandingActionsCell';
import type { BrandingRow, CompetitionRow, SummaryRow } from '@/features/scoring/types';

export function createResearchColumns(): TableColumn<SummaryRow>[] {
  return [
    { key: 'label', label: 'Ristek & Education Point', className: 'text-center' },
    { key: 'total', label: 'Total', className: 'text-center' },
    {
      key: 'point',
      label: 'Point',
      className: 'text-center',
      render: (_v, row) => <span className="font-semibold text-primary">{row.point}</span>,
    },
  ];
}

export function createOperationalColumns(): TableColumn<SummaryRow>[] {
  return [
    { key: 'label', label: 'Type of Absence', className: 'text-center' },
    { key: 'total', label: 'Total', className: 'text-center' },
    {
      key: 'point',
      label: 'Point',
      className: 'text-center',
      render: (_v, row) => <span className="font-semibold text-primary">{row.point}</span>,
    },
  ];
}

interface CreateCompetitionColumnsParams {
  onEdit: (id: string, payload: CompetitionPayload) => Promise<void>;
}

export function createCompetitionColumns({ onEdit }: CreateCompetitionColumnsParams): TableColumn<CompetitionRow>[] {
  return [
    { key: 'name', label: 'Competition Name', className: 'text-center' },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      render: (_v, row) => (
        <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(row.status ?? '')}`}>
          {(row.status ?? '').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'action' as keyof CompetitionRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <CompetitionActionsCell row={row} onEdit={onEdit} />,
    },
  ];
}

interface CreateBrandingColumnsParams {
  categories: string[];
  onEdit: (id: string, payload: Record<string, unknown>) => Promise<void>;
}

export function createBrandingColumns({ categories, onEdit }: CreateBrandingColumnsParams): TableColumn<BrandingRow>[] {
  return [
    { key: 'name', label: 'Content Name', className: 'text-center' },
    { key: 'research', label: 'Type', className: 'text-center' },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      render: (_v, row) => {
        const { label, className } = getBrandingStatusDisplay(row.status);
        return (
          <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${className}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'action' as keyof BrandingRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <BrandingActionsCell row={row} categories={categories} onEdit={onEdit} />,
    },
  ];
}
