"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { getCompetitionById } from '@/services/competition/competitionService';
import type { CompetitionRow } from '@/features/competition/types';

interface CompetitionReviewCellProps {
  row: CompetitionRow;
  onReview: (id: string, status: string) => void;
}

export default function CompetitionReviewCell({ row, onReview }: CompetitionReviewCellProps) {
  const [selected, setSelected] = useState<CompetitionRow | null>(null);

  const handleOpenDialog = async (id: string) => {
    const detail = (await getCompetitionById(id)) as CompetitionRow;
    setSelected(detail);
  };

  return (
    <DialogField
      name="Review"
      title="Detail Competition"
      onTriggerClick={() => handleOpenDialog(row._id)}
      variant="outline"
      noPadding
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold mt-2">Title</p>
            <p>{selected?.name ?? row.name}</p>
          </div>

          <div>
            <p className="font-semibold mt-2">Competition Type</p>
            <p>{selected?.type ?? row.type}</p>
          </div>

          <div>
            <p className="font-semibold mt-2">Description</p>
            <p>{selected?.description ?? row.description}</p>
          </div>

          <div>
            <p className="font-semibold mt-2">Competition Link</p>
            <a href={selected?.link ?? row.link} target="_blank" rel="noopener noreferrer">
              {selected?.link ?? row.link}
            </a>
          </div>

          <div>
            <p className="font-semibold mt-2">Change Label</p>
            <div className="mt-2 w-fit">
              <DropdownField
                title={selected?.status ?? row.status}
                menu={['Approved', 'Rejected']}
                onSelect={(value) => onReview(row._id, value)}
              />
            </div>
          </div>
        </div>
      </div>
    </DialogField>
  );
}
