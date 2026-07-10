"use client"

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { addBranding, updateBranding } from '@/services/branding/brandingService';
import { getKPIItemsByKementerian } from '@/services/kpi/kpiService';
import { handleError, showAppErrorToast } from '@/shared/services';
import { brandingSchema, type BrandingForm as BrandingFormValues } from '@/features/branding/config/schemas';
import type { BrandingRow } from '@/features/branding/types';

interface BrandingFormProps {
  mode?: 'create' | 'edit';
  branding?: BrandingRow;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: BrandingFormValues = {
  name: '',
  description: '',
  link: '',
  research: '',
  level: 'beginner',
};

function toDefaultValues(branding?: BrandingRow): BrandingFormValues {
  if (!branding) return DEFAULT_VALUES;
  return {
    name: branding.name ?? '',
    description: branding.description ?? '',
    link: branding.link ?? '',
    research: branding.research ?? '',
    level: (branding.level as BrandingFormValues['level']) ?? 'beginner',
  };
}

export default function BrandingForm({ mode = 'create', branding, onSuccess }: BrandingFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [brandingCategories, setBrandingCategories] = useState<string[]>([]);

  useEffect(() => {
    getKPIItemsByKementerian('branding')
      .then(setBrandingCategories)
      .catch(() => setBrandingCategories([]));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BrandingFormValues>({
    resolver: zodResolver(brandingSchema),
    mode: 'onChange',
    defaultValues: toDefaultValues(branding),
  });

  useEffect(() => {
    if (isDialogOpen) {
      reset(toDefaultValues(branding));
    }
  }, [isDialogOpen, branding, reset]);

  const submitValues = async (values: BrandingFormValues, closeDialog: () => void) => {
    try {
      if (mode === 'edit' && branding) {
        await updateBranding(branding._id, values);
        toast.success('Branding updated successfully!');
      } else {
        await addBranding(values);
        toast.success('Branding added successfully!');
      }
      closeDialog();
      onSuccess?.();
    } catch (err) {
      showAppErrorToast(handleError(err));
    }
  };

  return (
    <DialogField
      name={mode === 'edit' ? 'Edit' : 'Add Branding'}
      title={mode === 'edit' ? 'Edit Branding' : 'Add Branding'}
      size="lg"
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onSubmit={(closeDialog) => handleSubmit((values) => submitValues(values, closeDialog ?? (() => {})))()}
      submitDisabled={!isValid || isSubmitting}
    >
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: Branding Name"
              label="Title"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: Branding Description"
              label="Description"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}

        <Controller
          control={control}
          name="link"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: https://branding.com"
              label="Link"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.link && <span className="text-xs text-red-500">{errors.link.message}</span>}

        <Controller
          control={control}
          name="research"
          render={({ field }) => (
            <DropdownField
              key="research-branding-input"
              title="research"
              menu={brandingCategories}
              label="research"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.research && <span className="text-xs text-red-500">{errors.research.message}</span>}

        <Controller
          control={control}
          name="level"
          render={({ field }) => (
            <DropdownField
              key="level-branding-input"
              title="Level"
              menu={['beginner', 'intermediate', 'advanced']}
              label="Level"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </DialogField>
  );
}
