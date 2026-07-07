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
      <InputField
        type="text"
        placeholder="Search by Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
        {uniquePairs.map(({ schedule, assigned }, idx) => (
          <div
            key={schedule._id + '-' + assigned._id + '-' + idx}
            className="grid grid-cols-3 border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
          >
            <p>{assigned.name.split(' ')[0]}</p>
            <p>{schedule.date ? new Date(schedule.date).toISOString().slice(0, 10) : ''}</p>
            <Button
              className="text-sm px-0 py-1"
              onClick={() => onSwap(row._id, schedule._id, assigned._id)}
            >
              Swapping
            </Button>
          </div>
        ))}
      </div>
    </DialogField>
  );
}
