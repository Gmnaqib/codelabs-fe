"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { Button } from '@/components/ui/button';
import type { PicketRow, PicketSwapSchedule } from '@/features/picket/types';

interface PicketSwapCellProps {
  row: PicketRow;
  rangeSchedules: PicketSwapSchedule[];
  onSwap: (userId: string, targetScheduleId: string, targetUserId: string) => void;
}

function formatSwapDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function PicketSwapCell({ row, rangeSchedules, onSwap }: PicketSwapCellProps) {
  const [searchName, setSearchName] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const pairs: { schedule: PicketSwapSchedule; assigned: PicketSwapSchedule['assignedUsers'][number] }[] = [];
  rangeSchedules.forEach((schedule) => {
    const scheduleDate = new Date(schedule.date);
    const scheduleStr = scheduleDate.toISOString().slice(0, 10);
    if (scheduleStr > todayStr && schedule.assignedUsers) {
      schedule.assignedUsers.forEach((assigned) => {
        if (assigned.name.toLowerCase().includes(searchName.toLowerCase())) {
          pairs.push({ schedule, assigned });
        }
      });
    }
  });
  const uniquePairs = pairs.filter(
    (pair, idx, arr) =>
      arr.findIndex((p) => p.schedule._id === pair.schedule._id && p.assigned._id === pair.assigned._id) === idx
  );

  return (
    <DialogField variant="outline" name="Swapping" title="Swapping" size="sm">
      <div className="flex flex-col gap-4">
        <InputField
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          size="sm"
        />

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {uniquePairs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No available schedules found.
            </p>
          ) : (
            uniquePairs.map(({ schedule, assigned }, idx) => (
              <div
                key={schedule._id + '-' + assigned._id + '-' + idx}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {assigned.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{assigned.name.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">{formatSwapDate(schedule.date)}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => onSwap(row._id, schedule._id, assigned._id)}
                >
                  Swap
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </DialogField>
  );
}
