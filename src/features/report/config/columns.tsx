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

function wrapTitle(title?: string): React.ReactNode {
  if (typeof title !== 'string') return '-';
  if (title.length <= 15) return title;

  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  for (const word of words) {
    if ((currentLine + (currentLine ? ' ' : '') + word).length > 15) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine += (currentLine ? ' ' : '') + word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {line}
      {idx !== lines.length - 1 && <br />}
    </React.Fragment>
  ));
}

export function createReportColumns(): TableColumn<ReportRow>[] {
  return [
    {
      key: 'title',
      label: 'Research Plan',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => wrapTitle(row.title),
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
