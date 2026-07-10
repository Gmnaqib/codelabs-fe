"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { getCompetitionById, type CompetitionPayload } from '@/services/competition/competitionService';
import type { CompetitionRow } from '@/features/scoring/types';

interface CompetitionActionsCellProps {
  row: CompetitionRow;
  onEdit: (id: string, payload: CompetitionPayload) => Promise<void>;
}

export default function CompetitionActionsCell({ row, onEdit }: CompetitionActionsCellProps) {
  const isApproved = (row.status ?? '').toLowerCase() === 'approved';
  const [openEditId, setOpenEditId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editType, setEditType] = useState('');

  const [openDetailId, setOpenDetailId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<CompetitionRow | null>(null);

  const handleOpenEdit = async (id: string) => {
    setLoadingEdit(true);
    setOpenEditId(id);
    try {
      const detail = (await getCompetitionById(id)) as CompetitionRow;
      setEditName(detail.name || '');
      setEditDescription(detail.description || '');
      setEditDeadline(detail.deadline ? detail.deadline.slice(0, 16) : '');
      setEditLink(detail.link || '');
      setEditType(detail.type || '');
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
        deadline: editDeadline,
        link: editLink,
        type: editType,
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
      const detail = (await getCompetitionById(id)) as CompetitionRow;
      setSelectedCompetition(detail);
    } catch {
      setSelectedCompetition(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  return (
    <div className="gap-2 flex flex-col items-center text-center justify-center font-semibold text-primary lg:flex-row">
      {!isApproved && (
        <DialogField
          name="Edit"
          title="Edit Competition"
          variant="outline"
          noPadding
          open={openEditId === row._id}
          onOpenChange={(isOpen) => setOpenEditId(isOpen ? row._id : null)}
          onTriggerClick={() => handleOpenEdit(row._id)}
          onSubmit={handleEditSubmit}
          submitDisabled={loadingEdit || !editName || !editDescription || !editDeadline || !editLink || !editType}
        >
          {loadingEdit ? (
            <p className="text-center text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="flex flex-col gap-5">
              <InputField
                type="string"
                placeholder="Ex: Competition Name"
                label="Title"
                value={editName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
              />
              <InputField
                type="string"
                placeholder="Ex: Competition Description"
                label="Description"
                value={editDescription}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
              />
              <InputField
                placeholder="Ex: Competition Deadline"
                type="datetime-local"
                label="Deadline"
                value={editDeadline}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDeadline(e.target.value)}
              />
              <InputField
                type="string"
                placeholder="Ex: https://competition.com"
                label="Link"
                value={editLink}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLink(e.target.value)}
              />
              <DropdownField
                key="type-input"
                title="Type"
                menu={['international', 'national']}
                label="Type"
                value={editType}
                onChange={(value) => setEditType(value)}
              />
            </div>
          )}
        </DialogField>
      )}

      <DialogField
        name="Detail"
        title="Detail Competition"
        variant="outline"
        noPadding
        open={openDetailId === row._id}
        onOpenChange={(isOpen) => setOpenDetailId(isOpen ? row._id : null)}
        onTriggerClick={() => handleOpenDetail(row._id)}
      >
        {loadingDetail ? (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        ) : selectedCompetition ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <div>
              <p className="font-semibold">Title</p>
              <p>{selectedCompetition.name}</p>
            </div>
            <div>
              <p className="font-semibold">Type</p>
              <p>{selectedCompetition.type}</p>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>{selectedCompetition.description}</p>
            </div>
            <div>
              <p className="font-semibold">Link</p>
              <a
                href={selectedCompetition.link?.startsWith('http') ? selectedCompetition.link : `https://${selectedCompetition.link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {selectedCompetition.link}
              </a>
            </div>
            <div>
              <p className="font-semibold">Deadline</p>
              <p>{selectedCompetition.deadline ? new Date(selectedCompetition.deadline).toLocaleString() : '-'}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{selectedCompetition.status}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">No data found</p>
        )}
      </DialogField>
    </div>
  );
}
