"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';

interface AddBrandingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}

export default function AddBrandingDialog({ open, onOpenChange, categories, onSubmit }: AddBrandingDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [research, setResearch] = useState('');
  const [level, setLevel] = useState('');
  const [loading, setLoading] = useState(false);

  const isLinkValid = /^https:\/\/.+/i.test(link);

  const reset = () => {
    setName('');
    setDescription('');
    setLink('');
    setResearch('');
    setLevel('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({ name, description, link, research, level });
      onOpenChange(false);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogField
      name="Add Branding"
      title="Add Branding"
      size="lg"
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      submitDisabled={loading || !name || !description || !link || !isLinkValid || !research || !level}
    >
      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="flex flex-col gap-5">
          <InputField
            type="string"
            placeholder="Ex: Branding Name"
            label="Title"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />
          <InputField
            type="string"
            placeholder="Ex: Branding Description"
            label="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
          />
          <InputField
            type="string"
            placeholder="Ex: https://branding.com"
            label="Link"
            value={link}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
          />
          {link !== '' && !isLinkValid && (
            <span className="text-xs text-red-500">Link harus diawali dengan &apos;https://&apos;</span>
          )}
          <DropdownField
            key="research-branding-input"
            title="research"
            menu={categories}
            label="research"
            value={research}
            onChange={(value) => setResearch(value)}
          />
          <DropdownField
            key="level-branding-input"
            title="Level"
            menu={['beginner', 'intermediate', 'advanced']}
            label="Level"
            value={level}
            onChange={(value) => setLevel(value)}
          />
        </div>
      )}
    </DialogField>
  );
}
