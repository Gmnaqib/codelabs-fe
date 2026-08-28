"use client"

import React, { useState } from 'react';
import DialogField from '@/components/custom-ui/DialogField';
import InputField from '@/components/custom-ui/InputField';
import { Button } from '@/components/ui/button';
import type { ThematicSwapSchedule } from '@/features/thematic/types';

interface ThematicSwapCellProps {
  rangeSchedules: ThematicSwapSchedule[];
  onSwap: (targetScheduleId: string) => void;
}

function formatSwapDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// Unlike PicketSwapCell (which swaps one specific person), thematic swaps
// the whole day's team at once — so this lists candidate DAYS, not people.
export default function ThematicSwapCell({ rangeSchedules, onSwap }: ThematicSwapCellProps) {
  const [open, setOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const upcoming = rangeSchedules.filter((schedule) => {
    const scheduleStr = new Date(schedule.date).toISOString().slice(0, 10);
    if (scheduleStr <= todayStr) return false;
    if (!searchName.trim()) return true;
    return (schedule.assignedUsers ?? []).some((u) =>
      u.name.toLowerCase().includes(searchName.toLowerCase())
    );
  });

  return (
    <DialogField variant="outline" name="Swap Team" title="Swap Team" open={open} onOpenChange={setOpen}>
      <div className="flex flex-col gap-4">
        <InputField
          type="text"
          placeholder="Search by team member name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          size="sm"
        />

        <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No available schedules found.
            </p>
          ) : (
            upcoming.map((schedule) => (
              <div
                key={schedule._id}
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/50"
              >
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{formatSwapDate(schedule.date)}</p>
                  <p className="truncate text-sm font-medium">
                    {(schedule.assignedUsers ?? []).map((u) => u.name.split(' ')[0]).join(', ') || '-'}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    onSwap(schedule._id);
                    setOpen(false);
                  }}
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
