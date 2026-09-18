"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import ReportDetailCell from '@/features/report/components/ReportDetailCell';
import type { ReportRow } from '@/features/report/types';

// Report shows the student's own submission status as a simple
// Rejected/Accepted/Pending verdict, unlike Ristek's reviewer-facing
// 0-5 rating label (see getResearchStatusDisplay in @/shared/constants).
function getReportStatusDisplay(status?: number | null): { label: string; className: string } {
  if (status === null || status === undefined) {
    return { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' };
  }
  if (status === 0) {
    return { label: 'Rejected', className: 'bg-red-100 text-red-700' };
  }
  return { label: 'Accepted', className: 'bg-green-100 text-green-700' };
}

function renderTitle(title?: string): React.ReactNode {
  if (typeof title !== 'string' || !title) return '-';
  return (
    <p className="mx-auto line-clamp-2 max-w-55" title={title}>
      {title}
    </p>
  );
}

export function createReportColumns(): TableColumn<ReportRow>[] {
  return [
    {
      key: 'title',
      label: 'Research Plan',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => renderTitle(row.title),
    },
    {
      key: 'week',
      label: 'Week',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => `Week ${row.week ?? '-'}`,
    },
    {
      key: 'progress',
      label: 'Progress',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => row.progress ?? '-',
    },
    {
      key: 'status',
      label: 'Status',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => {
        const { label, className } = getReportStatusDisplay(row.status);
        return (
          <span className={`px-2 py-1 rounded-md text-sm font-medium ${className}`}>
            {label}
          </span>
        );
      },
    },
    {
      key: 'action' as keyof ReportRow & string,
      label: 'Action',
      className: 'text-center',
      render: (_v, row) => <ReportDetailCell row={row} />,
    },
  ];
}
