"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import type { CompetitionPayload } from '@/services/competition/competitionService';

interface AddCompetitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onSubmit: (payload: CompetitionPayload) => Promise<void>;
}

export default function AddCompetitionDialog({ open, onOpenChange, categories, onSubmit }: AddCompetitionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const isLinkValid = /^https:\/\/.+/i.test(link);

  const reset = () => {
    setName('');
    setDescription('');
    setDeadline('');
    setLink('');
    setType('');
    setCategory('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ name, description, deadline, link, type, category });
      onOpenChange(false);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogField
      name="Add Competition"
      title="Add Competition"
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      submitDisabled={loading || !name || !description || !deadline || !link || !isLinkValid || !type || !category}
    >
      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-5">
          <InputField
            type="string"
            placeholder="Ex: Competition Name"
            label="Title"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <InputField
            type="string"
            placeholder="Ex: Competition Description"
            label="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          />
          <InputField
            placeholder="Ex: Competition Deadline"
            type="datetime-local"
            label="Deadline"
            value={deadline}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
          />
          <InputField
            type="string"
            placeholder="Ex: https://competition.com"
            label="Link"
            value={link}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
          />
          {link !== '' && !isLinkValid && (
            <span className="text-xs text-red-500">Link must start with &apos;https://&apos;</span>
          )}
          <DropdownField
            key="type-input"
            title="Type"
            menu={['international', 'national']}
            label="Type"
            value={type}
            onChange={(value) => setType(value)}
          />
          <DropdownField
            key="category-input"
            title="Category"
            menu={categories}
            label="Category"
            value={category}
            onChange={(value) => setCategory(value)}
          />
        </div>
      )}
    </DialogField>
  );
}
