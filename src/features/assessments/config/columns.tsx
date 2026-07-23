"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import AssessmentDetailCell from '@/features/assessments/components/AssessmentDetailCell';
import type { AssessmentRow } from '@/features/assessments/types';

function getStatus(totalPoints?: number): { label: string; className: string } {
  let label = 'Not Safe';
  let className = 'text-warning';
  if (totalPoints !== null && totalPoints !== undefined) {
    if (totalPoints <= 150) {
      label = 'Danger';
      className = 'text-destructive';
    } else if (totalPoints <= 250) {
      label = 'Warning';
      className = 'text-warning';
    } else if (totalPoints <= 400) {
      label = 'Safe';
      className = 'text-success';
    } else if (totalPoints > 400) {
      label = 'Excellent';
      className = 'text-primary';
    }
  }
  return { label, className };
}

interface CreateAssessmentsColumnsParams {
  year: number;
  month: number;
}

export function createAssessmentsColumns({ year, month }: CreateAssessmentsColumnsParams): TableColumn<AssessmentRow>[] {
  return [
    { key: 'rank', label: 'Rank', className: 'text-center', sortable: true },
    {
      key: 'name',
      label: 'Name',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => row.name?.split(' ')[0] ?? '-',
    },
    {
      key: 'totalPoints',
      label: 'Monthly Points',
      className: 'hidden text-center sm:table-cell',
      sortable: true,
      render: (_v, row) => row.totalPoints ?? '-',
    },
    {
      key: 'status' as keyof AssessmentRow & string,
      label: 'Status',
      className: 'hidden text-center sm:table-cell',
      sortable: true,
      sortValue: (row) => getStatus(row.totalPoints).label,
      render: (_v, row) => {
        const { label, className } = getStatus(row.totalPoints);
        return <span className={`font-semibold ${className}`}>{label}</span>;
      },
    },
    {
      key: 'action' as keyof AssessmentRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <AssessmentDetailCell row={row} year={year} month={month} />,
    },
  ];
}
