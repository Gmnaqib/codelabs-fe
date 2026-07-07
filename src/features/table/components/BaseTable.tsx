"use client"

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { TableSortConfig } from '@/types/domain';

interface RowWithId {
  _id: string;
}

export interface TableColumn<T extends RowWithId> {
  key: keyof T & string;
  label: string;
  width?: string | number;
  sortable?: boolean;
  render?: (value: unknown, row: T, i: number) => React.ReactNode;
  className?: string;
}

interface BaseTableProps<T extends RowWithId> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  onSort?: (col: string, dir: 'asc' | 'desc') => void;
  loading?: boolean;
  emptyMessage?: string;
  sortConfig?: TableSortConfig | null;
  rowClassName?: (row: T) => string;
}

function BaseTableInner<T extends RowWithId>({
  data,
  columns,
  onRowClick,
  onSort,
  loading = false,
  emptyMessage = 'Tidak ada data',
  sortConfig,
  rowClassName,
}: BaseTableProps<T>) {
  const handleHeaderClick = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return;
    const isSameColumn = sortConfig?.column === column.key;
    const nextDirection: 'asc' | 'desc' =
      isSameColumn && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    onSort(column.key, nextDirection);
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center py-10">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-10 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => {
            const isSorted = sortConfig?.column === column.key;
            return (
              <TableHead
                key={column.key}
                style={{ width: column.width }}
                className={column.sortable ? 'cursor-pointer select-none' : undefined}
                onClick={() => handleHeaderClick(column)}
              >
                {column.label}
                {column.sortable && isSorted && (
                  <span className="ml-1">
                    {sortConfig?.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={row._id}
            onClick={() => onRowClick?.(row)}
            className={[onRowClick ? 'cursor-pointer' : '', rowClassName?.(row) ?? '']
              .filter(Boolean)
              .join(' ')}
          >
            {columns.map((column) => {
              const value = row[column.key];
              return (
                <TableCell key={column.key} className={column.className}>
                  {column.render ? column.render(value, row, i) : String(value ?? '-')}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

BaseTableInner.displayName = 'BaseTable';

export const BaseTable = BaseTableInner as <T extends RowWithId>(
  props: BaseTableProps<T>
) => React.ReactElement;
