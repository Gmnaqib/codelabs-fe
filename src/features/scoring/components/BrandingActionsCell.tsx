"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { getBrandingById } from '@/services/branding/brandingService';
import { getBrandingStatusDisplay } from '@/shared/constants';
import type { BrandingRow } from '@/features/scoring/types';

function brandingStatusLabel(status?: number | string | null): string {
  const BRANDING_STATUS_LABELS: Record<number, string> = {
    0: 'Not Suitable',
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };
  if (status === null || status === undefined || status === '') return 'PENDING';
  const num = Number(status);
  return isNaN(num) ? String(status).toUpperCase() : (BRANDING_STATUS_LABELS[num] ?? 'PENDING').toUpperCase();
}

interface BrandingActionsCellProps {
  row: BrandingRow;
  categories: string[];
  onEdit: (id: string, payload: Record<string, unknown>) => Promise<void>;
}

export default function BrandingActionsCell({ row, categories, onEdit }: BrandingActionsCellProps) {
  const isApproved = getBrandingStatusDisplay(row.status).label === 'APPROVED';
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editLevel, setEditLevel] = useState('');
  const [editResearch, setEditResearch] = useState('');

  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedBranding, setSelectedBranding] = useState<BrandingRow | null>(null);

  const handleOpenEdit = async (id: string) => {
    setLoadingEdit(true);
    setOpenEditId(id);
    try {
      const detail = (await getBrandingById(id)) as BrandingRow;
      setEditName(detail.name || '');
      setEditDescription(detail.description || '');
      setEditLink(detail.link || '');
      setEditStatus(String(detail.status ?? ''));
      setEditLevel(detail.level || '');
      setEditResearch(detail.research || '');
    } catch {
      setOpenEditId(null);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleEditSubmit = async () => {
    try {
      setLoadingEdit(true);
      await onEdit(row._id, {
        name: editName,
        description: editDescription,
        link: editLink,
        research: editResearch,
        level: editLevel,
        status: editStatus,
      });
      setOpenEditId(null);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    setOpenDetailId(id);
    try {
      const detail = (await getBrandingById(id)) as BrandingRow;
      setSelectedBranding(detail);
    } catch {
      setSelectedBranding(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="gap-2 flex flex-col items-center text-center justify-center font-semibold text-primary lg:flex-row">
      {!isApproved && (
        <DialogField
          name="Edit"
          title="Edit Branding"
          variant="outline"
          noPadding
          open={openEditId === row._id}
          onOpenChange={(isOpen) => setOpenEditId(isOpen ? row._id : null)}
          onTriggerClick={() => handleOpenEdit(row._id)}
          onSubmit={handleEditSubmit}
          submitDisabled={loadingEdit || !editName || !editDescription || !editLink}
        >
          {loadingEdit ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="flex flex-col gap-5">
              <InputField
                type="string"
                placeholder="Ex: Branding Name"
                label="Title"
                value={editName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
              />
              <InputField
                type="string"
                placeholder="Ex: Branding Description"
                label="Description"
                value={editDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
              />
              <InputField
                type="string"
                placeholder="Ex: https://branding.com"
                label="Link"
                value={editLink}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLink(e.target.value)}
              />
              <DropdownField
                key="research-branding-input"
                title="research"
                menu={categories}
                label="research"
                value={editResearch}
                onChange={(value) => setEditResearch(value)}
              />
              <DropdownField
                key="level-branding-input"
                title="Level"
                menu={['beginner', 'intermediate', 'advanced']}
                label="Level"
                value={editLevel}
                onChange={(value) => setEditLevel(value)}
              />
            </div>
          )}
        </DialogField>
      )}

      <DialogField
        name="Detail"
        title="Detail"
        variant="outline"
        noPadding
        open={openDetailId === row._id}
        onOpenChange={(isOpen) => setOpenDetailId(isOpen ? row._id : null)}
        onTriggerClick={() => handleOpenDetail(row._id)}
      >
        {loadingDetail ? (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        ) : selectedBranding ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <div>
              <p className="font-semibold">Title</p>
              <p>{selectedBranding.name}</p>
            </div>
            <div>
              <p className="font-semibold">Level Type</p>
              <p>{selectedBranding.level}</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>{selectedBranding.description}</p>
            </div>
            <div>
              <p className="font-semibold">Content Link</p>
              <a
                href={selectedBranding.link?.startsWith('http') ? selectedBranding.link : `https://${selectedBranding.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {selectedBranding.link}
              </a>
            </div>
            <div>
              <p className="font-semibold">Research Category</p>
              <p>{selectedBranding.research}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{brandingStatusLabel(selectedBranding.status)}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">No data found</p>
        )}
      </DialogField>
    </div>
  );
}
