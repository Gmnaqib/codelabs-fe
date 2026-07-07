"use client"

import React, { useMemo } from 'react';
import Image from 'next/image';
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
import {
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  HeartIcon,
} from '@heroicons/react/24/solid';
import { BaseTable } from '@/features/table/components';
import { useTableStore } from '@/shared/state';
import { useAttendanceTable } from '@/features/attendance/hooks/useAttendanceTable';
import { createAttendanceColumns, createLeaveRequestColumns } from '@/features/attendance/config/columns';
import type { AttendanceRow, LeaveRequestRow } from '@/features/attendance/types';

interface AttendanceTableProps {
  showMenu?: boolean;
  [key: string]: unknown;
}

const ATTENDANCE_MENUS = ['Permissions', 'Total Attendance'];

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
    paginatedData,
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

      <div className="grid grid-cols-5 gap-5 mt-3">
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
                  emptyMessage="Tidak ada data"
                />
              </Card>
            ) : (
              <Card className="py-12">
                <div className="text-center">
                  <Image
                    src="/icon/no-data.png"
                    alt="No Data"
                    width={200}
                    height={200}
                    className="mx-auto mb-4"
                  />
                  <p className="font-medium text-lg">All Clear</p>
                  <p className="text-base text-neutral">
                    No one submitted sick leave, permission, or absence today.
                  </p>
                </div>
              </Card>
            ))}
        </>
      )}

      <Card>
        {activeTab === 'Permissions' && <p className="font-medium text-xl px-5">All Report</p>}

        {activeTab === 'Permissions' ? (
          <BaseTable<LeaveRequestRow>
            data={paginatedData as LeaveRequestRow[]}
            columns={leaveColumns}
            emptyMessage="Tidak ada data"
          />
        ) : (
          <BaseTable<AttendanceRow>
            data={paginatedData as AttendanceRow[]}
            columns={attendanceColumns}
            emptyMessage="Tidak ada data"
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
