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
import type { TableColumn } from '@/features/table/components';
import type { TableSortConfig } from '@/types/domain';

interface RowWithId {
  _id: string;
}

function compareSortValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const dir = direction === 'asc' ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * dir;
}

interface ScheduleTableProps<T extends RowWithId> {
  data: T[];
  leftColumns: TableColumn<T>[];
  scrollColumns: TableColumn<T>[];
  rightColumns?: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
}

function renderCell<T extends RowWithId>(column: TableColumn<T>, row: T, i: number): React.ReactNode {
  const value = row[column.key];
  return column.render ? column.render(value, row, i) : String(value ?? '-');
}

function colWidth<T extends RowWithId>(column: TableColumn<T>): number {
  return Number(column.width) || 0;
}

function totalWidth<T extends RowWithId>(columns: TableColumn<T>[]): number {
  return columns.reduce((sum, column) => sum + colWidth(column), 0);
}

// Matches TableRow's own `even:bg-surface odd:bg-white` so sticky cells stay opaque
// and keep the same alternating color as the rest of their row while scrolling.
function rowBg(i: number): string {
  return i % 2 === 0 ? 'bg-white' : 'bg-surface';
}

function ScheduleTableInner<T extends RowWithId>({
  data,
  leftColumns,
  scrollColumns,
  rightColumns = [],
  loading = false,
  emptyMessage = 'Tidak ada data',
}: ScheduleTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<TableSortConfig | null>(null);

  const allColumns = React.useMemo(
    () => [...leftColumns, ...scrollColumns, ...rightColumns],
    [leftColumns, scrollColumns, rightColumns]
  );

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    const column = allColumns.find((c) => c.key === sortConfig.column);
    if (!column) return data;
    const getValue = (row: T): unknown => (column.sortValue ? column.sortValue(row) : row[column.key]);
    return [...data].sort((a, b) => compareSortValues(getValue(a), getValue(b), sortConfig.direction));
  }, [data, allColumns, sortConfig]);

  const handleHeaderClick = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    const isSameColumn = sortConfig?.column === column.key;
    const nextDirection: 'asc' | 'desc' =
      isSameColumn && sortConfig?.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column: column.key, direction: nextDirection });
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

  let leftOffset = 0;
  const leftOffsets = leftColumns.map((column) => {
    const offset = leftOffset;
    leftOffset += colWidth(column);
    return offset;
  });

  const pinnedWidth = totalWidth(leftColumns) + totalWidth(rightColumns);
  const tableWidth = pinnedWidth + totalWidth(scrollColumns);

  return (
    <div className="max-h-150 w-full max-w-full overflow-auto rounded-md">
      <Table
        className="min-w-(--tbl-w-mobile) sm:min-w-(--tbl-w-full)"
        style={{
          width: '100%',
          tableLayout: 'fixed',
          ['--tbl-w-mobile' as string]: `${pinnedWidth}px`,
          ['--tbl-w-full' as string]: `${tableWidth}px`,
        } as React.CSSProperties}
      >
        <TableHeader>
          <TableRow>
            {leftColumns.map((column, idx) => (
              <TableHead
                key={column.key}
                className={`z-20 sticky bg-secondary ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ width: column.width, left: leftOffsets[idx] }}
                onClick={() => handleHeaderClick(column)}
              >
                {column.label}
              </TableHead>
            ))}
            {scrollColumns.map((column) => (
              <TableHead
                key={column.key}
                className={`z-10 hidden text-center sm:table-cell ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ width: column.width }}
                onClick={() => handleHeaderClick(column)}
              >
                {column.label}
              </TableHead>
            ))}
            {rightColumns.map((column) => (
              <TableHead
                key={column.key}
                className={`z-20 sticky right-0 bg-secondary text-center ${column.sortable ? 'cursor-pointer select-none' : ''}`}
                style={{ width: column.width }}
                onClick={() => handleHeaderClick(column)}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, i) => (
            <TableRow key={row._id} className="h-12">
              {leftColumns.map((column, idx) => (
                <TableCell
                  key={column.key}
                  className={`z-10 sticky ${rowBg(i)} ${column.className ?? ''}`}
                  style={{ width: column.width, left: leftOffsets[idx] }}
                >
                  {renderCell(column, row, i)}
                </TableCell>
              ))}
              {scrollColumns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`hidden text-center sm:table-cell ${column.className ?? ''}`}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center justify-center">
                    {renderCell(column, row, i)}
                  </div>
                </TableCell>
              ))}
              {rightColumns.map((column) => (
                <TableCell
                  key={column.key}
                  className={`z-10 sticky right-0 text-center ${rowBg(i)}`}
                  style={{ width: column.width }}
                >
                  {renderCell(column, row, i)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

ScheduleTableInner.displayName = 'ScheduleTable';

export const ScheduleTable = ScheduleTableInner as <T extends RowWithId>(
  props: ScheduleTableProps<T>
) => React.ReactElement;
