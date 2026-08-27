"use client"

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputField from '@/components/custom-ui/InputField';
import { Button } from '@/components/ui/button';
import { postSPSetting, updateSPSetting } from '@/services/spSetting/spSettingService';
import { handleError } from '@/shared/services';
import { spSettingSchema, type SPSettingForm as SPSettingFormValues } from '@/features/spSetting/config/schemas';
import type { SPSettingRow } from '@/features/spSetting/types';

interface SPSettingFormDialogProps {
  item: SPSettingRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: SPSettingFormValues = { name: '', point: '' };

function toDefaultValues(item: SPSettingRow | null): SPSettingFormValues {
  if (!item) return DEFAULT_VALUES;
  return { name: item.name ?? '', point: String(item.point) };
}

export default function SPSettingFormDialog({ item, open, onOpenChange, onSuccess }: SPSettingFormDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SPSettingFormValues>({
    resolver: zodResolver(spSettingSchema),
    mode: 'onChange',
    defaultValues: toDefaultValues(item),
  });

  useEffect(() => {
    if (open) {
      reset(toDefaultValues(item));
    }
  }, [open, item, reset]);

  const onSubmit = async (values: SPSettingFormValues) => {
    try {
      const payload = { name: values.name, point: Number(values.point) };
      if (item) {
        await updateSPSetting(item._id, payload);
        toast.success('SP setting updated successfully!');
      } else {
        await postSPSetting(payload);
        toast.success('SP setting added successfully!');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to save SP setting.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{item ? `Edit ${item.name}` : 'Add SP Setting'}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputField
                type="string"
                placeholder="Ex: SP 1"
                label="Name"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}

          <Controller
            control={control}
            name="point"
            render={({ field }) => (
              <InputField
                type="number"
                placeholder="Ex: 27"
                label="Point"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.point && <span className="text-xs text-red-500">{errors.point.message}</span>}

          <div className="flex justify-center gap-4 mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
