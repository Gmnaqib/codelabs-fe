"use client"

import React from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { RESEARCH_STATUS_LABELS } from '@/shared/constants';
import type { RistekRow } from '@/features/ristek/types';

interface RistekReviewCellProps {
  row: RistekRow;
  onReview: (id: string, status: number) => void;
}

const RATING_OPTIONS = Object.entries(RESEARCH_STATUS_LABELS).map(
  ([value, label]) => `${value} - ${label}`
);

export default function RistekReviewCell({ row, onReview }: RistekReviewCellProps) {
  const currentLabel =
    row.status === null || row.status === undefined
      ? 'Not Reviewed'
      : `${row.status} - ${RESEARCH_STATUS_LABELS[row.status] ?? row.status}`;
  return (
    <DialogField name="Review" title="Detail Plan" variant="outline" noPadding>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold mt-2">Title</p>
          <p>{row.title}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Week</p>
          <p>{row.week}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Progress</p>
          <p>{row.progress}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Challenge</p>
          <p>{row.challenge}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Output Link</p>
          <a href={row.link} target="_blank" rel="noopener noreferrer">
            {row.link}
          </a>
        </div>

        <div className="w-fit">
          <p className="font-semibold mt-4">Status</p>
          <div className="mt-2">
            <DropdownField
              title={currentLabel}
              menu={RATING_OPTIONS}
              onSelect={(value) => onReview(row._id, Number(value.split(' - ')[0]))}
            />
          </div>
        </div>
      </div>
    </DialogField>
  );
}
