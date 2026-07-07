"use client"

import React from 'react';
import type { TableColumn } from '@/features/table/components';
import { getStatusColor } from '@/utils/statusColor';
import ReportDetailCell from '@/features/report/components/ReportDetailCell';
import type { ReportRow } from '@/features/report/types';

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
      render: (_v, row) => wrapTitle(row.title),
    },
    {
      key: 'week',
      label: 'Week',
      render: (_v, row) => `Week ${row.week ?? '-'}`,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (_v, row) => row.progress ?? '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (_v, row) => (
        <span className={`text-base px-7 py-1 rounded-full uppercase text-center w-fit ${getStatusColor(row.status ?? '')}`}>
          {row.status ? row.status.toUpperCase() : '-'}
        </span>
      ),
    },
    {
      key: 'action' as keyof ReportRow & string,
      label: 'Action',
      render: (_v, row) => <ReportDetailCell row={row} />,
    },
  ];
}
