"use client"

import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputField from '@/components/custom-ui/InputField';
import { Button } from '@/components/ui/button';
import { updateKPIMaster } from '@/services/kpi/kpiService';
import { handleError } from '@/shared/services';
import { kpiItemSchema, type KpiItemForm as KpiItemFormValues } from '@/features/points/config/schemas';

interface KPIMasterItem {
  _id: string;
  kementerian: string;
  point: number;
}

interface KpiItemFormProps {
  item: KPIMasterItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function KpiItemForm({ item, open, onOpenChange, onSuccess }: KpiItemFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<KpiItemFormValues>({
    resolver: zodResolver(kpiItemSchema),
    mode: 'onChange',
    defaultValues: { point: item ? String(item.point) : '' },
  });

  useEffect(() => {
    if (open) {
      reset({ point: item ? String(item.point) : '' });
    }
  }, [open, item, reset]);

  const onSubmit = async (values: KpiItemFormValues) => {
    if (!item) return;
    try {
      await updateKPIMaster(item._id, { name: item.kementerian, point: Number(values.point) });
      toast.success('Category updated successfully!');
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Failed to update category.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Category {item?.kementerian}</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="point"
            render={({ field }) => (
              <InputField
                type="number"
                placeholder="Ex: 30"
                label="Weight"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
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
