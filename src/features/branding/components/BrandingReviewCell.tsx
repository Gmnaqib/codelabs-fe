"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { getBrandingById } from '@/services/branding/brandingService';
import type { BrandingRow } from '@/features/branding/types';

interface BrandingReviewCellProps {
  row: BrandingRow;
  onReview: (id: string, status: string) => void;
}

export default function BrandingReviewCell({ row, onReview }: BrandingReviewCellProps) {
  const [selected, setSelected] = useState<BrandingRow | null>(null);

  const handleOpenDialog = async (id: string) => {
    const detail = (await getBrandingById(id)) as BrandingRow;
    setSelected(detail);
  };

  return (
    <DialogField
      name="Review"
      title="Detail Branding"
      onTriggerClick={() => handleOpenDialog(row._id)}
      variant="outline"
      noPadding
    >
      <div className="grid grid-cols-2 gap-4">
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
              title="Select Status"
              menu={['0', '1', '2', '3', '4', '5']}
              onSelect={(value) => onReview(row._id, value)}
            />
          </div>
        </div>
      </div>
    </DialogField>
  );
}
