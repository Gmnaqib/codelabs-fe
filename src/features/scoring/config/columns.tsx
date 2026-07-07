"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import { getStatusColor } from '@/utils/statusColor';
import type { CompetitionPayload } from '@/services/competition/competitionService';
import CompetitionActionsCell from '@/features/scoring/components/CompetitionActionsCell';
import BrandingActionsCell, { brandingStatusLabel } from '@/features/scoring/components/BrandingActionsCell';
import type { BrandingRow, CompetitionRow, SummaryRow } from '@/features/scoring/types';

export function createResearchColumns(): TableColumn<SummaryRow>[] {
  return [
    { key: 'label', label: 'Ristek & Education Point' },
    { key: 'total', label: 'Total' },
    {
      key: 'point',
      label: 'Point',
      render: (_v, row) => <span className="font-semibold text-primary">{row.point}</span>,
    },
  ];
}

export function createOperationalColumns(): TableColumn<SummaryRow>[] {
  return [
    { key: 'label', label: 'Type of Absence' },
    { key: 'total', label: 'Total' },
    {
      key: 'point',
      label: 'Point',
      render: (_v, row) => <span className="font-semibold text-primary">{row.point}</span>,
    },
  ];
}

interface CreateCompetitionColumnsParams {
  onEdit: (id: string, payload: CompetitionPayload) => Promise<void>;
}

export function createCompetitionColumns({ onEdit }: CreateCompetitionColumnsParams): TableColumn<CompetitionRow>[] {
  return [
    { key: 'name', label: 'Competition Name' },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => (
        <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(row.status ?? '')}`}>
          {(row.status ?? '').toUpperCase()}
        </span>
      ),
    },
    {
      key: 'point' as keyof CompetitionRow & string,
      label: 'Point',
      render: () => 0,
    },
    {
      key: 'action' as keyof CompetitionRow & string,
      label: 'Action',
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
    { key: 'name', label: 'Content Name' },
    { key: 'research', label: 'Type' },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => (
        <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(String(row.status ?? ''))}`}>
          {brandingStatusLabel(row.status)}
        </span>
      ),
    },
    {
      key: 'point' as keyof BrandingRow & string,
      label: 'Point',
      render: () => 0,
    },
    {
      key: 'action' as keyof BrandingRow & string,
      label: 'Action',
      render: (_v, row) => <BrandingActionsCell row={row} categories={categories} onEdit={onEdit} />,
    },
  ];
}
