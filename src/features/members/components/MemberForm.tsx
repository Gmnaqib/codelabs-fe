"use client"

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import SelectField from '@/components/custom-ui/SelectField';
import { Button } from '@/components/ui/button';
import { createUser, updateUser } from '@/services/users/userService';
import { handleError } from '@/shared/services';
import { USER_ROLES, ROLE_LABELS } from '@/shared/constants';
import { memberSchema, type MemberForm as MemberFormValues } from '@/features/members/config/schemas';
import type { User } from '@/types/domain';

interface MemberFormProps {
  mode: 'create' | 'edit';
  member?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'active', title: 'Active' },
  { value: 'inactive', title: 'Inactive' },
  { value: 'suspended', title: 'Suspended' },
  { value: 'resigned', title: 'Resigned' },
];

const ROLE_OPTIONS = USER_ROLES.map((role) => ({ value: role, title: ROLE_LABELS[role] }));

function buildDefaultValues(member?: User): MemberFormValues {
  return {
    nim: member?.nim ?? '',
    name: member?.name ?? '',
    email: member?.email ?? '',
    role: member?.role ?? 'user',
    subriset: member?.subriset ?? '',
    status: member?.status ?? 'active',
  };
}

export default function MemberForm({ mode, member, open, onOpenChange, onSuccess }: MemberFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: buildDefaultValues(member),
  });

  useEffect(() => {
    if (open) {
      reset(buildDefaultValues(member));
    }
  }, [open, member, reset]);

  const onSubmit = async (values: MemberFormValues) => {
    try {
      if (mode === 'create') {
        await createUser(values);
        toast.success('Member created successfully!');
      } else if (member) {
        await updateUser(member._id, values);
        toast.success('Member updated successfully!');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to save member.');
    }
  };

  return (
    <DialogField
      name={mode === 'create' ? 'Add Member' : 'Edit'}
      title={mode === 'create' ? 'Add Member' : 'Edit Member'}
      variant="outline"
      open={open}
      onOpenChange={onOpenChange}
    >
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="nim"
          render={({ field }) => (
            <InputField
              label="NIM"
              type="text"
              placeholder="Ex: 1023456"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.nim && <span className="text-xs text-red-500">{errors.nim.message}</span>}

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <InputField
              label="Name"
              type="text"
              placeholder="Ex: John Doe"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}

        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <InputField
              label="Email"
              type="text"
              placeholder="Ex: john@mail.com"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}

        <Controller
          control={control}
          name="subriset"
          render={({ field }) => (
            <InputField
              label="Sub Riset"
              type="text"
              placeholder="Ex: Website"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.subriset && <span className="text-xs text-red-500">{errors.subriset.message}</span>}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Role</label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <SelectField options={ROLE_OPTIONS} value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <SelectField options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.status && <span className="text-xs text-red-500">{errors.status.message}</span>}
        </div>

        <div className="flex justify-center mt-2">
          <Button type="submit" disabled={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </DialogField>
  );
}
