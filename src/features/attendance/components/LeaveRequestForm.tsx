"use client"

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import DialogField from '@/components/custom-ui/DialogField';
import { DropdownField } from '@/components/custom-ui/DropdownField';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/custom-ui/DateRangePicker';
import CameraCapture from '@/components/custom-ui/CameraCapture';
import { ArrowUpRightIcon } from 'lucide-react';
import { postLeaveRequest } from '@/services/attendance/attendanceService';
import { handleError, showAppErrorToast } from '@/shared/services';
import { leaveRequestSchema, type LeaveRequestForm as LeaveRequestFormValues } from '@/features/attendance/config/leaveSchemas';

interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

export default function LeaveRequestForm({ onSuccess }: LeaveRequestFormProps) {
  const [showDateModal, setShowDateModal] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: 'sick',
      reason: '',
      startDate: '',
      endDate: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const attachment = watch('attachment');
  const typeValue = watch('type');

  const submitValues = async (values: LeaveRequestFormValues, closeDialog: () => void) => {
    const finalEndDate = values.endDate || values.startDate;
    try {
      await postLeaveRequest({
        type: values.type,
        reason: values.reason,
        attachment: values.attachment,
        start_date: values.startDate,
        end_date: finalEndDate,
      });
      toast.success('Leave request submitted successfully!');

      const day = new Date().getDay();
      let telegramUsername = 'HakimMajid123';
      if (day === 3 || day === 6) telegramUsername = 'iammmth';
      else if (day === 4 || day === 5) telegramUsername = 'Aldzikra';
      const reasonText = encodeURIComponent(
        `I am requesting leave due to ${values.reason} from ${values.startDate} to ${finalEndDate}`
      );
      window.location.href = `https://t.me/${telegramUsername}?text=${reasonText}`;

      reset({ type: 'sick', reason: '', startDate: '', endDate: '' });
      closeDialog();
      onSuccess?.();
    } catch (err) {
      showAppErrorToast(handleError(err));
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3 cursor-pointer">
      <DialogField
        name="Add Permission"
        title="Permission"
        variant="link"
        size="noPadding"
        onSubmit={(closeDialog) => handleSubmit((values) => submitValues(values, closeDialog ?? (() => {})))()}
        submitDisabled={isSubmitting}
      >
        <div>
          <p className="mb-1">Select Permission</p>
          <DropdownField
            title={typeValue === 'sick' ? 'Sick' : 'Permit'}
            menu={['Sick', 'Permit']}
            onSelect={(v) => setValue('type', v === 'Sick' ? 'sick' : 'permit')}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Controller
            control={control}
            name="reason"
            render={({ field }) => (
              <Textarea
                label="Reason"
                placeholder="Enter reason..."
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.reason && <span className="text-xs text-red-500">{errors.reason.message}</span>}

          <div>
            <label className="block mb-1">Leave Date</label>
            <Button
              type="button"
              className="rounded-full px-2 py-4 w-full text-base bg-white text-black border border-muted-foreground font-light hover:bg-primary hover:text-white"
              onClick={() => { if (!showDateModal) setShowDateModal(true); }}
            >
              {startDate && endDate && startDate !== endDate
                ? `${startDate} s/d ${endDate}`
                : startDate
                ? startDate
                : 'Select Leave Date'}
            </Button>
            {showDateModal && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: 'transparent' }}
                onClick={() => setShowDateModal(false)}
              >
                <div
                  className="bg-white rounded shadow-lg p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DateRangePicker
                    startDate={startDate || null}
                    endDate={endDate || null}
                    minDate={new Date().toISOString().split('T')[0]}
                    onChange={(start, end) => {
                      setValue('startDate', start || '', { shouldValidate: true });
                      setValue('endDate', end || '', { shouldValidate: true });
                    }}
                  />
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button type="button" onClick={() => { if (startDate) setShowDateModal(false); }}>
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {errors.startDate && <span className="text-xs text-red-500">{errors.startDate.message}</span>}

          {!attachment ? (
            <div>
              <label className="block text-base font-light mb-1">Choose Picture</label>
              <CameraCapture onCapture={(file) => setValue('attachment', file, { shouldValidate: true })} />
            </div>
          ) : (
            <span className="text-base text-center mt-1 text-primary">Photo already taken</span>
          )}
          {errors.attachment && <span className="text-xs text-red-500">{errors.attachment.message}</span>}
        </div>
      </DialogField>
      <ArrowUpRightIcon className="size-5 text-primary" />
    </div>
  );
}
