"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import type { TableColumn } from '@/features/table/components';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { getStatusColor } from '@/utils/statusColor';
import { fixAttachmentUrl } from '@/shared/utils';
import DetailAttendanceCard, {
  type StatusSummary,
} from '@/features/attendance/components/DetailAttendanceCard';
import type { LeaveRequestRow, AttendanceRow } from '@/features/attendance/types';

function getReviewerByDate(dateString?: string | Date): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  const day = d.getDay();
  const reviewers: Record<number, string> = {
    1: 'Hakim',
    2: 'Hakim',
    3: 'Ilham',
    4: 'Aldzikra',
    5: 'Aldzikra',
    6: 'Ilham',
  };
  return reviewers[day] ?? '-';
}

function formatLongDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function EvidenceViewer({ attachmentUrl }: { attachmentUrl?: string }) {
  const [failed, setFailed] = useState(false);

  if (!attachmentUrl) {
    return <span className="text-sm">No attachment</span>;
  }

  const fixedUrl = fixAttachmentUrl(attachmentUrl);

  if (failed) {
    return (
      <a
        href={fixedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 underline break-all"
      >
        {fixedUrl}
      </a>
    );
  }

  return (
    <Image
      src={fixedUrl}
      alt="Attachment"
      width={300}
      height={300}
      className="mt-2 rounded-lg object-contain max-w-full h-auto"
      onError={() => setFailed(true)}
    />
  );
}

interface CreateLeaveRequestColumnsParams {
  selectedLeave: LeaveRequestRow | null;
  onOpenDialog: (id: string) => void;
  onReview: (status: string) => void;
}

export function createLeaveRequestColumns({
  selectedLeave,
  onOpenDialog,
  onReview,
}: CreateLeaveRequestColumnsParams): TableColumn<LeaveRequestRow>[] {
  return [
    {
      key: 'userName',
      label: 'Name',
      className: 'text-center',
      sortable: true,
      render: (_v, row) => row.userName?.split(' ')[0] ?? '-',
    },
    {
      key: 'type',
      label: 'Status',
      className: 'text-center hidden sm:table-cell',
      sortable: true,
      render: (_v, row) => <span className="uppercase">{row.type}</span>,
    },
    {
      key: 'startDate',
      label: 'Date',
      className: 'text-center hidden lg:table-cell',
      sortable: true,
      sortValue: (row) => new Date(row.startDate).getTime(),
      render: (_v, row) => formatLongDate(row.startDate),
    },
    {
      key: 'reviewed' as keyof LeaveRequestRow & string,
      label: 'Reviewed',
      className: 'text-center hidden lg:table-cell',
      sortable: true,
      sortValue: (row) => getReviewerByDate(row.startDate),
      render: (_v, row) => getReviewerByDate(row.startDate),
    },
    {
      key: 'approvalStatus',
      label: 'Permission',
      className: 'text-center hidden md:table-cell',
      sortable: true,
      render: (_v, row) => (
        <span
          className={`px-7 py-1 rounded-full text-base uppercase ${getStatusColor(row.approvalStatus)}`}
        >
          {row.approvalStatus}
        </span>
      ),
    },
    {
      key: 'action' as keyof LeaveRequestRow & string,
      label: 'Detail',
      className: 'text-center',
      render: (_v, row) => (
        <DialogField
          name="Review"
          title="Reason"
          variant="outline"
          noPadding
          onTriggerClick={() => onOpenDialog(row._id)}
        >
          {!selectedLeave ? (
            <p>Loading ...</p>
          ) : (
            <div className="flex flex-col gap-7 w-full min-w-0">
              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedLeave.userName}</p>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:gap-12 lg:items-center">
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{selectedLeave?.type?.toUpperCase() || '-'}</p>
                </div>

                <div>
                  <p className="font-semibold">Date</p>
                  <p>{formatLongDate(selectedLeave.startDate)}</p>
                </div>

                <div className="flex flex-col gap-3 w-full lg:w-auto">
                  <p className="font-semibold">Permission</p>
                  <DropdownField
                    key={selectedLeave._id}
                    title={selectedLeave.approvalStatus}
                    menu={['Approved', 'Rejected']}
                    onSelect={(value) => onReview(value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold">Reason</p>
                <p>{selectedLeave.reason}</p>
              </div>
              <div className="min-w-0">
                <p className="font-semibold">Evidencea</p>
                <EvidenceViewer attachmentUrl={selectedLeave.attachment_url} />
              </div>
            </div>
          )}
        </DialogField>
      ),
    },
  ];
}

// Mirrors the cap shown on the dashboard's Total Attendance card: sick and
// late top out at 4, permit at 2. Anything past the cap doesn't just
// disappear — it gets folded into "No Report" so it still counts against the user.
const SICK_LIMIT = 4;
const PERMIT_LIMIT = 2;
const LATE_LIMIT = 4;

function getLimitColor(value: number, limit: number): string {
  if (value >= limit) return ' text-destructive';
  if (value === limit - 1) return ' text-warning';
  return '';
}

function getAdjustedAbsent(row: AttendanceRow): number {
  const sickOverflow = Math.max((row.counts?.sick ?? 0) - SICK_LIMIT, 0);
  const permitOverflow = Math.max((row.counts?.permit ?? 0) - PERMIT_LIMIT, 0);
  const lateOverflow = Math.max((row.counts?.late ?? 0) - LATE_LIMIT, 0);
  return (row.counts?.absent ?? 0) + sickOverflow + permitOverflow + lateOverflow;
}

interface CreateAttendanceColumnsParams {
  onOpenDetail: (userId: string) => void;
  detailDialogUserId: string | null;
  detailData: { statusSummary: StatusSummary[] } | null;
  detailLoading: boolean;
}

export function createAttendanceColumns({
  onOpenDetail,
  detailDialogUserId,
  detailData,
  detailLoading,
}: CreateAttendanceColumnsParams): TableColumn<AttendanceRow>[] {
  return [
    {
      key: 'userName',
      label: 'Name',
      className: 'text-center whitespace-normal',
      sortable: true,
      render: (_v, row) => row.userName,
    },
    {
      key: 'present' as keyof AttendanceRow & string,
      label: 'Present',
      className: 'text-center whitespace-normal',
      sortable: true,
      sortValue: (row) => row.counts?.present ?? 0,
      render: (_v, row) => row.counts?.present ?? 0,
    },
    {
      key: 'permit' as keyof AttendanceRow & string,
      label: 'Permit',
      className: 'text-center whitespace-normal',
      sortable: true,
      sortValue: (row) => Math.min(row.counts?.permit ?? 0, PERMIT_LIMIT),
      render: (_v, row) => {
        const permit = row.counts?.permit ?? 0;
        return (
          <span className={getLimitColor(permit, PERMIT_LIMIT)}>
            {Math.min(permit, PERMIT_LIMIT)}
          </span>
        );
      },
    },
    {
      key: 'sick' as keyof AttendanceRow & string,
      label: 'Sick',
      className: 'text-center whitespace-normal',
      sortable: true,
      sortValue: (row) => Math.min(row.counts?.sick ?? 0, SICK_LIMIT),
      render: (_v, row) => {
        const sick = row.counts?.sick ?? 0;
        return (
          <span className={getLimitColor(sick, SICK_LIMIT)}>
            {Math.min(sick, SICK_LIMIT)}
          </span>
        );
      },
    },
    {
      key: 'late' as keyof AttendanceRow & string,
      label: 'Late Arrivals',
      className: 'text-center whitespace-normal',
      sortable: true,
      sortValue: (row) => Math.min(row.counts?.late ?? 0, LATE_LIMIT),
      render: (_v, row) => {
        const late = row.counts?.late ?? 0;
        return (
          <span className={getLimitColor(late, LATE_LIMIT)}>
            {Math.min(late, LATE_LIMIT)}
          </span>
        );
      },
    },
    {
      key: 'absent' as keyof AttendanceRow & string,
      label: 'No Report',
      className: 'text-center whitespace-normal',
      sortable: true,
      sortValue: (row) => getAdjustedAbsent(row),
      render: (_v, row) => getAdjustedAbsent(row),
    },
    {
      key: 'score' as keyof AttendanceRow & string,
      label: 'SP',
      className: 'text-center whitespace-normal',
      sortable: true,
      // Resolved server-side against the dynamic SP setting thresholds
      // (grand_total vs. the configured points) — not computed here.
      sortValue: (row) => row.counts?.sp ?? '',
      render: (_v, row) => {
        const sp = row.counts?.sp;
        return <span className={sp ? 'text-destructive' : ''}>{sp ?? '-'}</span>;
      },
    },
    {
      key: 'action' as keyof AttendanceRow & string,
      label: 'Action',
      className: 'text-center whitespace-normal',
      render: (_v, row) => (
        <DialogField
          name="Detail"
          title="Attendance Detail"
          variant="outline"
          noPadding
          onTriggerClick={() => onOpenDetail(row.userId)}
        >
          {detailDialogUserId === row.userId && detailLoading ? (
            <p>Loading...</p>
          ) : detailDialogUserId === row.userId && detailData?.statusSummary ? (
            <div className="max-h-96 overflow-y-auto">
              <DetailAttendanceCard statusSummary={detailData.statusSummary} />
            </div>
          ) : (
            <p>No detail data available.</p>
          )}
        </DialogField>
      ),
    },
  ];
}
