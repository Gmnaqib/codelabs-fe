"use client"

import React from 'react';
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
      render: (_v, row) => row.userName?.split(' ')[0] ?? '-',
    },
    {
      key: 'type',
      label: 'Status',
      className: 'text-center',
      render: (_v, row) => <span className="uppercase">{row.type}</span>,
    },
    {
      key: 'startDate',
      label: 'Date',
      className: 'text-center',
      render: (_v, row) => formatLongDate(row.startDate),
    },
    {
      key: 'reviewed' as keyof LeaveRequestRow & string,
      label: 'Reviewed',
      className: 'text-center',
      render: (_v, row) => getReviewerByDate(row.startDate),
    },
    {
      key: 'approvalStatus',
      label: 'Permission',
      className: 'text-center',
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
            <div className="flex flex-col gap-7">
              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedLeave.userName}</p>
              </div>

              <div className="flex gap-12 items-center">
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{selectedLeave?.type?.toUpperCase() || '-'}</p>
                </div>

                <div>
                  <p className="font-semibold">Date</p>
                  <p>{formatLongDate(selectedLeave.startDate)}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-semibold">Permission</p>
                  <DropdownField
                    key={selectedLeave._id}
                    title={selectedLeave.approvalStatus}
                    menu={['Approved', 'Rejected']}
                    onSelect={(value) => onReview(value)}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold">Reason</p>
                <p>{selectedLeave.reason}</p>
              </div>
              <div>
                <p className="font-semibold">Evidancea</p>
                {selectedLeave.attachment_url ? (
                  <Image
                    src={fixAttachmentUrl(selectedLeave.attachment_url)}
                    alt="Attachment"
                    width={300}
                    height={300}
                    style={{
                      objectFit: 'contain',
                      borderRadius: '8px',
                      marginTop: '8px',
                      maxWidth: '300px',
                      maxHeight: '300px',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const link = document.createElement('a');
                      link.href = fixAttachmentUrl(selectedLeave.attachment_url!);
                      link.target = '_blank';
                      link.rel = 'noopener noreferrer';
                      link.innerText = fixAttachmentUrl(selectedLeave.attachment_url!);
                      target.parentElement?.appendChild(link);
                    }}
                  />
                ) : (
                  <span className="text-sm">No attachment</span>
                )}
              </div>
            </div>
          )}
        </DialogField>
      ),
    },
  ];
}

function computeScore(absent: number): number {
  if (absent >= 12) return 3;
  if (absent >= 8) return 2;
  if (absent >= 4) return 1;
  return 0;
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
    { key: 'userName', label: 'Name', className: 'text-center whitespace-normal', render: (_v, row) => row.userName },
    {
      key: 'present' as keyof AttendanceRow & string,
      label: 'Present',
      className: 'text-center whitespace-normal',
      render: (_v, row) => row.counts?.present ?? 0,
    },
    {
      key: 'permit' as keyof AttendanceRow & string,
      label: 'Permit',
      className: 'text-center whitespace-normal',
      render: (_v, row) => row.counts?.permit ?? 0,
    },
    {
      key: 'sick' as keyof AttendanceRow & string,
      label: 'Sick',
      className: 'text-center whitespace-normal',
      render: (_v, row) => row.counts?.sick ?? 0,
    },
    {
      key: 'late' as keyof AttendanceRow & string,
      label: 'Late Arrivals',
      className: 'text-center whitespace-normal',
      render: (_v, row) => row.counts?.late ?? 0,
    },
    {
      key: 'absent' as keyof AttendanceRow & string,
      label: 'No Report',
      className: 'text-center whitespace-normal',
      render: (_v, row) => row.counts?.absent ?? 0,
    },
    {
      key: 'score' as keyof AttendanceRow & string,
      label: 'SP',
      className: 'text-center whitespace-normal',
      render: (_v, row) => computeScore(row.counts?.absent ?? 0),
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
