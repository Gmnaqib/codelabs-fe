"use client"

import React, { useState } from 'react';
import { toast } from 'sonner';
import SelectField from '@/components/custom-ui/SelectField';
import { updateUser } from '@/services/users/userService';
import { handleError } from '@/shared/services';

interface MemberInlineSelectProps {
  userId: string;
  field: string;
  value: string;
  options: { value: string; title: string }[];
  displayValue?: string;
  /** Converts the dropdown's string value into whatever shape the API field expects (e.g. boolean). */
  serialize?: (value: string) => unknown;
  onSaved?: () => void;
}

export default function MemberInlineSelect({ userId, field, value, options, displayValue, serialize, onSaved }: MemberInlineSelectProps) {
  const [saving, setSaving] = useState(false);

  const handleChange = async (next: string) => {
    if (next === value || saving) return;
    setSaving(true);
    try {
      const payloadValue = serialize ? serialize(next) : next;
      await updateUser(userId, { [field]: payloadValue });
      toast.success('Member updated successfully!');
      onSaved?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to update member.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SelectField
      options={options}
      value={value}
      onChange={handleChange}
      displayValue={displayValue}
      className="w-full"
    />
  );
}
