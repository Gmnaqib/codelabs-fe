"use client"

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';
import { createResearchRecord, updateResearchRecord } from '@/services/research/researchService';
import { getKPIItemsByKementerian } from '@/services/kpi/kpiService';
import { handleError } from '@/shared/services';
import { reportSchema, type ReportForm as ReportFormValues } from '@/features/report/config/schemas';
import type { ReportRow } from '@/features/report/types';

interface ReportFormProps {
  mode?: 'create' | 'edit';
  record?: ReportRow;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: ReportFormValues = {
  title: '',
  week: 'Week 1',
  progress: 'Finished',
  category: '',
  link: '',
  challenge: '',
};

function toDefaultValues(record?: ReportRow): ReportFormValues {
  if (!record) return DEFAULT_VALUES;
  const progressCapitalized =
    typeof record.progress === 'string' && record.progress.length > 0
      ? record.progress.charAt(0).toUpperCase() + record.progress.slice(1)
      : 'Finished';
  return {
    title: record.title ?? '',
    week: `Week ${record.week ?? 1}` as ReportFormValues['week'],
    progress: progressCapitalized as ReportFormValues['progress'],
    category: '',
    link: record.link ?? '',
    challenge: record.challenge ?? '',
  };
}

export default function ReportForm({ mode = 'create', record, onSuccess }: ReportFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [researchCategories, setResearchCategories] = useState<string[]>([]);

  useEffect(() => {
    getKPIItemsByKementerian('research')
      .then(setResearchCategories)
      .catch(() => setResearchCategories([]));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    mode: 'onChange',
    defaultValues: toDefaultValues(record),
  });

  useEffect(() => {
    if (isDialogOpen) {
      reset(toDefaultValues(record));
    }
  }, [isDialogOpen, record, reset]);

  const onSubmit = async (values: ReportFormValues) => {
    const weekNumber = parseInt(values.week.replace('Week ', ''), 10) || 1;
    const payload = {
      week: weekNumber,
      category: values.category,
      title: values.title,
      link: values.link || 'https://example.com/research',
      progress: values.progress.toLowerCase(),
      challenge: values.challenge,
    };

    try {
      if (mode === 'edit' && record) {
        await updateResearchRecord(record._id, payload);
        toast.success('Data berhasil diperbarui!');
      } else {
        await createResearchRecord(payload);
        toast.success('Data Berhasil Ditambahkan');
      }
      setIsDialogOpen(false);
      onSuccess?.();
    } catch (err) {
      const appError = handleError(err);
      toast.error(appError.message || 'Gagal menyimpan research.');
    }
  };

  return (
    <DialogField
      name={mode === 'edit' ? 'Edit' : 'Add New Plan'}
      title={mode === 'edit' ? 'Edit Plan' : 'Add New Plan'}
      size="full"
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      onSubmit={() => handleSubmit(onSubmit)()}
      submitDisabled={!isValid || isSubmitting}
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: Learn how to make responsive web"
              label="Title"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}

        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            control={control}
            name="week"
            render={({ field }) => (
              <DropdownField
                key="week-input"
                title="Choose Week"
                menu={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
                label="Week"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="progress"
            render={({ field }) => (
              <DropdownField
                key="progress-input"
                title="Your Progress"
                menu={['Finished', 'Unfinished']}
                label="Progress"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <DropdownField
              key="category-input"
              title="Category"
              menu={researchCategories}
              label="Category"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.category && <span className="text-sm text-red-500">{errors.category.message}</span>}

        <div className="flex flex-col gap-1">
          <Controller
            control={control}
            name="link"
            render={({ field }) => (
              <InputField
                type="string"
                placeholder="Ex: https://github.com/unikom-codelabs/"
                label="Link"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.link && <span className="text-sm text-red-500">{errors.link.message}</span>}
        </div>

        <Controller
          control={control}
          name="challenge"
          render={({ field }) => (
            <Textarea
              label="Challenge"
              placeholder="Ex: Ada kendala pada fitur upload gambar..."
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.challenge && <span className="text-sm text-red-500">{errors.challenge.message}</span>}
      </form>
    </DialogField>
  );
}
