"use client";

import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { handleError } from '@/shared/services';
import {
  timeSettingSchema,
  type TimeSettingForm as TimeSettingFormValues,
} from '@/features/settings/config/schemas';
import type { TimeSetting } from '@/services/timeSetting/timeSettingService';

const CHECKIN_KEYS = ['checkin', 'checkinlimit', 'checkinlatelimit'] as const;
const CHECKOUT_KEYS = ['checkout', 'checkoutlate'] as const;

const TIME_LABELS: Record<keyof TimeSettingFormValues, string> = {
  checkin: 'Check-in Start',
  checkinlimit: 'Late Check-in',
  checkinlatelimit: 'Last Check-in',
  checkout: 'Check-out Start',
  checkoutlate: 'Last Check-out',
};

export const DAY_LABEL: Record<string, string> = {
  WEEKDAY: 'Weekday (Mon – Fri)',
  WEEKEND: 'Weekend (Sat)',
};

const normalizeTime = (t: string): string => {
  if (!t) return '';
  const [h, m] = t.split(':');
  return `${h.padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}`;
};

function settingToForm(s: TimeSetting): TimeSettingFormValues {
  return {
    checkin: normalizeTime(s.checkin),
    checkinlimit: normalizeTime(s.checkinlimit),
    checkinlatelimit: normalizeTime(s.checkinlatelimit),
    checkout: normalizeTime(s.checkout),
    checkoutlate: normalizeTime(s.checkoutlate),
  };
}

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeInput = ({ label, value, onChange }: TimeInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    ref.current?.showPicker?.();
  };
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        ref={ref}
        type="time"
        value={value}
        onChange={onChange}
        onClick={handleClick}
        className="cursor-pointer"
      />
    </div>
  );
};

interface TimeSettingsFormProps {
  setting: TimeSetting;
  onSave: (id: string, payload: TimeSettingFormValues) => Promise<void>;
}

export default function TimeSettingsForm({
  setting,
  onSave,
}: TimeSettingsFormProps) {
  const initial = settingToForm(setting);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<TimeSettingFormValues>({
    resolver: zodResolver(timeSettingSchema),
    defaultValues: initial,
  });

  const values = watch();
  const hasChanges = (
    Object.keys(initial) as (keyof TimeSettingFormValues)[]
  ).some((key) => values[key] !== initial[key]);

  const onSubmit = async (data: TimeSettingFormValues) => {
    try {
      await onSave(setting._id, data);
      toast.success(
        `${DAY_LABEL[setting.code] ?? setting.code} settings saved`,
      );
    } catch (err) {
      handleError(err);
      toast.error("Failed to save settings");
    }
  };

  const renderFields = (keys: readonly (keyof TimeSettingFormValues)[]) =>
    keys.map((key) => (
      <Controller
        key={key}
        control={control}
        name={key}
        render={({ field }) => (
          <TimeInput
            label={TIME_LABELS[key]}
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
          />
        )}
      />
    ));

  const Hint = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-3 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
      <InformationCircleIcon className="size-5 shrink-0 text-primary" />
      <p>{children}</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Card className="gap-4 pt-2">
        <CardHeader>
          <CardTitle className="text-lg font-xl font-semibold">
            Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderFields(CHECKIN_KEYS)}
          </div>
          <Hint>
            Members can check in from <b>{values.checkin}</b> to{" "}
            <b>{values.checkinlatelimit}</b>. After <b>{values.checkinlimit}</b>{" "}
            they are marked late.
          </Hint>
        </CardContent>
      </Card>

      <Card className="gap-4 pt-2">
        <CardHeader>
          <CardTitle className="text-lg font-xl font-semibold">
            Check-out
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderFields(CHECKOUT_KEYS)}
          </div>
          <Hint>
            Members can check out from <b>{values.checkout}</b> to{" "}
            <b>{values.checkoutlate}</b>.
          </Hint>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting || !hasChanges}
          onClick={() => reset(initial)}
        >
          Reset
        </Button>
        <Button
          type="submit"
          size="lg"
          className="font-medium"
          disabled={isSubmitting || !hasChanges}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
