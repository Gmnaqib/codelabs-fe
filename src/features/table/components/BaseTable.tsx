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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePagination } from '@/features/table/hooks/usePagination';
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
  paginate?: boolean;
}

interface BaseTableRowProps<T extends RowWithId> {
  row: T;
  index: number;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
}

function BaseTableRowInner<T extends RowWithId>({
  row,
  index,
  columns,
  onRowClick,
  rowClassName,
}: BaseTableRowProps<T>) {
  return (
    <TableRow
      onClick={() => onRowClick?.(row)}
      className={[onRowClick ? 'cursor-pointer' : '', rowClassName?.(row) ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      {columns.map((column) => {
        const value = row[column.key];
        return (
          <TableCell key={column.key} className={column.className}>
            {column.render ? column.render(value, row, index) : String(value ?? '-')}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

BaseTableRowInner.displayName = 'BaseTableRow';

const BaseTableRow = React.memo(BaseTableRowInner) as <T extends RowWithId>(
  props: BaseTableRowProps<T>
) => React.ReactElement;

function BaseTableInner<T extends RowWithId>({
  data,
  columns,
  onRowClick,
  onSort,
  loading = false,
  emptyMessage = 'Tidak ada data',
  sortConfig,
  rowClassName,
  paginate = false,
}: BaseTableProps<T>) {
  const { page, setPage, pageSize } = usePagination();

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

  const totalPages = paginate ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const currentPage = paginate ? Math.min(page, totalPages) : 1;
  const rows = paginate ? data.slice((currentPage - 1) * pageSize, currentPage * pageSize) : data;

  return (
    <>
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
          {rows.map((row, i) => (
            <BaseTableRow
              key={row._id}
              row={row}
              index={i}
              columns={columns}
              onRowClick={onRowClick}
              rowClassName={rowClassName}
            />
          ))}
        </TableBody>
      </Table>

      {paginate && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.max(1, currentPage - 1));
                }}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(Math.min(totalPages, currentPage + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

BaseTableInner.displayName = 'BaseTable';

export const BaseTable = BaseTableInner as <T extends RowWithId>(
  props: BaseTableProps<T>
) => React.ReactElement;
