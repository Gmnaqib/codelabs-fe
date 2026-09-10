"use client"

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Menubar } from '@/components/custom-ui/MenuBar';
import CardField from '@/components/custom-ui/CardField';
import EmptyState from '@/components/custom-ui/EmptyState';
import {
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import { BaseTable, type TableColumn } from '@/features/table/components';
import { useTableStore } from '@/shared/state';
import { useAttendanceTable } from '@/features/attendance/hooks/useAttendanceTable';
import { createAttendanceColumns, createLeaveRequestColumns } from '@/features/attendance/config/columns';
import type { AttendanceRow, LeaveRequestRow } from '@/features/attendance/types';
import type { TableSortConfig } from '@/types/domain';

interface AttendanceTableProps {
  showMenu?: boolean;
  [key: string]: unknown;
}

const ATTENDANCE_MENUS = ['Permissions', 'Total Attendance'];

function compareSortValues(a: unknown, b: unknown, direction: 'asc' | 'desc'): number {
  const dir = direction === 'asc' ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * dir;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' }) * dir;
}

function sortRows<T extends { _id: string }>(
  data: T[],
  columns: TableColumn<T>[],
  sortConfig: TableSortConfig | null
): T[] {
  if (!sortConfig) return data;
  const column = columns.find((c) => c.key === sortConfig.column);
  if (!column) return data;
  const getValue = (row: T): unknown => (column.sortValue ? column.sortValue(row) : row[column.key]);
  return [...data].sort((a, b) => compareSortValues(getValue(a), getValue(b), sortConfig.direction));
}

export default function AttendanceTable({ showMenu = true }: AttendanceTableProps) {
  const year = useTableStore((s) => s.year);
  const month = useTableStore((s) => s.month);
  const searchQuery = useTableStore((s) => s.searchQuery);
  const setSearchQuery = useTableStore((s) => s.setSearchQuery);
  const setDateRange = useTableStore((s) => s.setDateRange);

  const {
    activeTab,
    setActiveTab,
    todayData,
    loading,
    error,
    showToday,
    setShowToday,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredData,
    itemsPerPage,
    selectedLeave,
    handleOpenDialog,
    handleReview,
    summary,
    detailDialogUserId,
    detailData,
    detailLoading,
    handleOpenDetail,
  } = useAttendanceTable();

  const leaveColumns = useMemo(
    () => createLeaveRequestColumns({ selectedLeave, onOpenDialog: handleOpenDialog, onReview: handleReview }),
    [selectedLeave, handleOpenDialog, handleReview]
  );

  const attendanceColumns = useMemo(
    () =>
      createAttendanceColumns({
        onOpenDetail: handleOpenDetail,
        detailDialogUserId,
        detailData,
        detailLoading,
      }),
    [handleOpenDetail, detailDialogUserId, detailData, detailLoading]
  );

  const [leaveSortConfig, setLeaveSortConfig] = useState<TableSortConfig | null>(null);
  const [attendanceSortConfig, setAttendanceSortConfig] = useState<TableSortConfig | null>(null);

  const handleLeaveSort = (col: string, dir: 'asc' | 'desc') => {
    setLeaveSortConfig({ column: col, direction: dir });
    setCurrentPage(1);
  };

  const handleAttendanceSort = (col: string, dir: 'asc' | 'desc') => {
    setAttendanceSortConfig({ column: col, direction: dir });
    setCurrentPage(1);
  };

  // Sort across the FULL filtered dataset before slicing to a page, so a
  // header click reorders every row, not just the ones visible on this page.
  const sortedPageData = useMemo(() => {
    const sorted =
      activeTab === 'Permissions'
        ? sortRows(filteredData as LeaveRequestRow[], leaveColumns, leaveSortConfig)
        : sortRows(filteredData as AttendanceRow[], attendanceColumns, attendanceSortConfig);
    return sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [activeTab, filteredData, leaveColumns, attendanceColumns, leaveSortConfig, attendanceSortConfig, currentPage, itemsPerPage]);

  const totals = useMemo(() => {
    const acc = { present: 0, permit: 0, sick: 0, late: 0, absent: 0 };
    summary?.forEach((u) => {
      acc.present += u.counts?.present ?? 0;
      acc.permit += u.counts?.permit ?? 0;
      acc.sick += u.counts?.sick ?? 0;
      acc.late += u.counts?.late ?? 0;
      acc.absent += u.counts?.absent ?? 0;
    });
    return { ...acc, overall: acc.present + acc.permit + acc.sick + acc.late + acc.absent };
  }, [summary]);

  if (error) {
    return <Card className="border-destructive bg-destructive/10 p-4 text-destructive">{error.message}</Card>;
  }

  if (loading) {
    return <Card className="p-6 text-center text-gray-500">Loading data...</Card>;
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={ATTENDANCE_MENUS}
          activeMenu={activeTab}
          onChange={(menu) => setActiveTab(menu as 'Permissions' | 'Total Attendance')}
          filter
          search
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          filterProps={{
            onChange: (val) => setDateRange(val.month + 1, val.year),
            defaultYear: year,
            defaultMonth: month - 1,
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-3">
        <CardField title="Total Report" icon={<DocumentTextIcon />} noGap>
          <p className="text-primary font-medium text-center text-2xl mt-4">{totals.overall}</p>
        </CardField>
        <CardField title="Permit" icon={<HandRaisedIcon />} noGap>
          <p className="font-medium text-center text-2xl mt-4">{totals.permit}</p>
        </CardField>
        <CardField title="Sick" icon={<HeartIcon />} noGap>
          <p className="font-medium text-center text-2xl mt-4">{totals.sick}</p>
        </CardField>
        <CardField title="Late Arrivals" icon={<ClockIcon />} noGap>
          <p className="font-medium text-center text-2xl mt-4">{totals.late}</p>
        </CardField>
        <CardField title="No Report" icon={<ExclamationTriangleIcon />} noGap>
          <p className="font-medium text-center text-2xl mt-4">{totals.absent}</p>
        </CardField>
      </div>

      <div className="w-full h-0.5 bg-bg-neutral mt-8 mb-5" />

      {activeTab === 'Permissions' && (
        <>
          <div className="flex justify-between items-center w-full px-5 bg-white">
            <p className="font-medium text-xl">Today</p>
            <p
              onClick={() => setShowToday(!showToday)}
              className="text-primary font-normal text-sm cursor-pointer select-none"
            >
              {showToday ? 'Hide' : 'Show Today'}
            </p>
          </div>

          {showToday &&
            (todayData.length > 0 ? (
              <Card className="mt-4">
                <BaseTable<LeaveRequestRow>
                  data={todayData}
                  columns={leaveColumns}
                  emptyMessage="No data available"
                />
              </Card>
            ) : (
              <Card className="py-12">
                <EmptyState message="No one submitted sick leave, permission, or absence today." />
              </Card>
            ))}
        </>
      )}

      <Card>
        {activeTab === 'Permissions' && <p className="font-medium text-xl px-5">All Report</p>}

        {filteredData.length === 0 ? (
          <div className="py-12">
            <EmptyState message="No reports found for the selected period." />
          </div>
        ) : activeTab === 'Permissions' ? (
          <BaseTable<LeaveRequestRow>
            data={sortedPageData as LeaveRequestRow[]}
            columns={leaveColumns}
            sortConfig={leaveSortConfig}
            onSort={handleLeaveSort}
            emptyMessage="No data available"
          />
        ) : (
          <BaseTable<AttendanceRow>
            data={sortedPageData as AttendanceRow[]}
            columns={attendanceColumns}
            sortConfig={attendanceSortConfig}
            onSort={handleAttendanceSort}
            tableClassName="table-fixed"
            emptyMessage="No data available"
          />
        )}

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && <PaginationEllipsis />}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </div>
  );
}
