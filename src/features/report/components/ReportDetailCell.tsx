"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import { getResearchById } from '@/services/research/researchService';
import { handleError } from '@/shared/services';
import type { ReportRow } from '@/features/report/types';

interface ReportDetailCellProps {
  row: ReportRow;
}

export default function ReportDetailCell({ row }: ReportDetailCellProps) {
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<ReportRow | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setOpenDetailId(id);
    setErrorMessage(null);
    try {
      const research = (await getResearchById(id)) as ReportRow;
      setSelectedResearch(research);
    } catch (err) {
      setSelectedResearch(null);
      setErrorMessage(handleError(err).message);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <DialogField
      name="Detail"
      title="Detail Plan"
      variant="outline"
      noPadding
      open={openDetailId === row._id}
      onOpenChange={(isOpen) => setOpenDetailId(isOpen ? row._id : null)}
      onTriggerClick={() => handleOpenDetail(row._id)}
    >
      {loadingDetail ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : errorMessage ? (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      ) : selectedResearch ? (
        <div className="flex flex-col gap-5 text-lg">
          <div>
            <p className="font-semibold">Title</p>
            <p>{selectedResearch.title ?? '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Week</p>
            <p>{selectedResearch.week ?? '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Progress</p>
            <p>{selectedResearch.progress ?? '-'}</p>
          </div>
          <div>
            <p className="font-semibold">Output Link</p>
            <a href={selectedResearch.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {selectedResearch.link ?? '-'}
            </a>
          </div>
          <div>
            <p className="font-semibold">Problem</p>
            <p>{selectedResearch.challenge ?? '-'}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center">No data found</p>
      )}
    </DialogField>
  );
}
