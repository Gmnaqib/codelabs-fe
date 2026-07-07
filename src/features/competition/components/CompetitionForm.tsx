"use client"

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { addCompetition, updateCompetition } from '@/services/competition/competitionService';
import { getKPIItemsByKementerian } from '@/services/kpi/kpiService';
import { handleError, showAppErrorToast } from '@/shared/services';
import { competitionSchema, type CompetitionForm as CompetitionFormValues } from '@/features/competition/config/schemas';

export interface CompetitionDetail {
  _id: string;
  name?: string;
  description?: string;
  deadline?: string;
  link?: string;
  type?: string;
  category?: string;
}

interface CompetitionFormProps {
  mode?: 'create' | 'edit';
  competition?: CompetitionDetail;
  onSuccess?: () => void;
}

const DEFAULT_VALUES: CompetitionFormValues = {
  name: '',
  description: '',
  deadline: '',
  link: '',
  type: 'national',
  category: '',
};

function toDefaultValues(competition?: CompetitionDetail): CompetitionFormValues {
  if (!competition) return DEFAULT_VALUES;
  return {
    name: competition.name ?? '',
    description: competition.description ?? '',
    deadline: competition.deadline ? competition.deadline.slice(0, 16) : '',
    link: competition.link ?? '',
    type: (competition.type as CompetitionFormValues['type']) ?? 'national',
    category: competition.category ?? '',
  };
}

export default function CompetitionForm({ mode = 'create', competition, onSuccess }: CompetitionFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [competitionCategories, setCompetitionCategories] = useState<string[]>([]);

  useEffect(() => {
    getKPIItemsByKementerian('competition')
      .then(setCompetitionCategories)
      .catch(() => setCompetitionCategories([]));
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionSchema),
    mode: 'onChange',
    defaultValues: toDefaultValues(competition),
  });

  useEffect(() => {
    if (isDialogOpen) {
      reset(toDefaultValues(competition));
    }
  }, [isDialogOpen, competition, reset]);

  const submitValues = async (values: CompetitionFormValues, closeDialog: () => void) => {
    try {
      if (mode === 'edit' && competition) {
        await updateCompetition(competition._id, values);
        toast.success('Competition updated successfully!');
      } else {
        await addCompetition(values);
        toast.success('Competition added successfully!');
      }
      closeDialog();
      onSuccess?.();
    } catch (err) {
      showAppErrorToast(handleError(err));
    }
  };

  return (
    <DialogField
      name={mode === 'edit' ? 'Edit' : 'Add Competition'}
      title={mode === 'edit' ? 'Edit Competition' : 'Add Competition'}
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
              placeholder="Ex: Competition Name"
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
              placeholder="Ex: Competition Description"
              label="Description"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}

        <Controller
          control={control}
          name="deadline"
          render={({ field }) => (
            <InputField
              placeholder="Ex: Competition Deadline"
              type="datetime-local"
              label="Deadline"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.deadline && <span className="text-xs text-red-500">{errors.deadline.message}</span>}

        <Controller
          control={control}
          name="link"
          render={({ field }) => (
            <InputField
              type="string"
              placeholder="Ex: https://competition.com"
              label="Link"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        {errors.link && <span className="text-xs text-red-500">{errors.link.message}</span>}

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <DropdownField
              key="type-input"
              title="Type"
              menu={['international', 'national']}
              label="Type"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <DropdownField
              key="category-input"
              title="Category"
              menu={competitionCategories}
              label="Category"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
      </div>
    </DialogField>
  );
}
