"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { RESEARCH_STATUS_LABELS } from '@/shared/constants';
import { getBrandingById } from '@/services/branding/brandingService';
import type { BrandingRow } from '@/features/branding/types';

interface BrandingReviewCellProps {
  row: BrandingRow;
  onReview: (id: string, status: string) => void;
}

const RATING_OPTIONS = Object.entries(RESEARCH_STATUS_LABELS).map(
  ([value, label]) => `${value} - ${label}`
);

export default function BrandingReviewCell({ row, onReview }: BrandingReviewCellProps) {
  const [selected, setSelected] = useState<BrandingRow | null>(null);

  const handleOpenDialog = async (id: string) => {
    const detail = (await getBrandingById(id)) as BrandingRow;
    setSelected(detail);
  };

  const status = selected?.status ?? row.status;
  const currentLabel =
    status === null || status === undefined || status === ''
      ? 'Not Reviewed'
      : `${status} - ${RESEARCH_STATUS_LABELS[Number(status)] ?? status}`;

  return (
    <DialogField
      name="Review"
      title="Detail"
      onTriggerClick={() => handleOpenDialog(row._id)}
      variant="outline"
      noPadding
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Title</p>
          <p>{selected?.name ?? row.name}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Level Type</p>
          <p>{selected?.level ?? row.level}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Description</p>
          <p>{selected?.description ?? row.description}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Content Link</p>
          <p>{selected?.link ?? row.link}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Research Category</p>
          <p>{selected?.research ?? row.research}</p>
        </div>

        <div>
          <p className="font-semibold mt-2">Status</p>
          <div className="mt-1">
            <DropdownField
              title={currentLabel}
              menu={RATING_OPTIONS}
              onSelect={(value) => onReview(row._id, value.split(' - ')[0])}
            />
          </div>
        </div>
      </div>
    </DialogField>
  );
}
