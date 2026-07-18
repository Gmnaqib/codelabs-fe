"use client"

import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { handleError } from '@/shared/services';
import { timeSettingSchema, type TimeSettingForm as TimeSettingFormValues } from '@/features/settings/config/schemas';
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

const DAY_LABEL: Record<string, string> = {
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
      <Input ref={ref} type="time" value={value} onChange={onChange} onClick={handleClick} className="cursor-pointer" />
    </div>
  );
};

interface TimeSettingsFormProps {
  setting: TimeSetting;
  onSave: (id: string, payload: TimeSettingFormValues) => Promise<void>;
}

export default function TimeSettingsForm({ setting, onSave }: TimeSettingsFormProps) {
  const initial = settingToForm(setting);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<TimeSettingFormValues>({
    resolver: zodResolver(timeSettingSchema),
    defaultValues: initial,
  });

  const values = watch();
  const hasChanges = (Object.keys(initial) as (keyof TimeSettingFormValues)[]).some(
    (key) => values[key] !== initial[key]
  );

  const onSubmit = async (data: TimeSettingFormValues) => {
    try {
      await onSave(setting._id, data);
      toast.success(`${DAY_LABEL[setting.code] ?? setting.code} settings saved`);
    } catch (err) {
      handleError(err);
      toast.error('Failed to save settings');
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <div className="bg-white text-primary rounded-full p-1.5">
            <Cog6ToothIcon className="size-4" />
          </div>
          {DAY_LABEL[setting.code] ?? setting.code}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Check-in</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CHECKIN_KEYS.map((key) => (
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
              ))}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex flex-col gap-3">
            <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">Check-out</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHECKOUT_KEYS.map((key) => (
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
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !hasChanges} className="md:w-fit" size="full">
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
