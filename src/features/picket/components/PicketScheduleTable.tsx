"use client"

import React, { useMemo, useState } from 'react';
import { BaseTable } from '@/features/table/components';
import DialogField from '@/components/custom-ui/DialogField';
import { MultiSelectDropdownField } from '@/components/custom-ui/MultiSelectDropdownField';
import { createPicketScheduleColumns } from '@/features/picket/config/columns';
import { usePicketScheduleTable } from '@/features/picket/hooks/usePicketScheduleTable';
import { MAX_PICKET_USERS_PER_DAY } from '@/features/picket/types';

interface PicketScheduleTableProps {
  fetchTrigger?: number;
  // ISO date (yyyy-MM-dd) to view instead of today's schedule.
  date?: string;
  [key: string]: unknown;
}

export default function PicketScheduleTable({ fetchTrigger, date }: PicketScheduleTableProps) {
  const { picketData, loading, checkedUsers, rangeSchedules, activeUsers, isAddingMembers, handleToggle, handleSwap, handleAddMembers } =
    usePicketScheduleTable({ fetchTrigger, date });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const columns = useMemo(
    () => createPicketScheduleColumns({ checkedUsers, rangeSchedules, onToggle: handleToggle, onSwap: handleSwap }),
    [checkedUsers, rangeSchedules, handleToggle, handleSwap]
  );

  const remainingSlots = MAX_PICKET_USERS_PER_DAY - picketData.length;

  const availableOptions = useMemo(() => {
    const assignedIds = new Set(picketData.map((u) => u._id));
    return activeUsers
      .filter((u) => !assignedIds.has(u._id))
      .map((u) => ({ value: u._id, label: u.name }));
  }, [activeUsers, picketData]);

  const selectedLabels = availableOptions
    .filter((o) => selectedUserIds.includes(o.value))
    .map((o) => o.label);

  return (
    <div className="space-y-3">
      <BaseTable
        data={picketData}
        columns={columns}
        loading={loading}
        emptyMessage="There is no picket data for this day"
      />

      {!loading && remainingSlots > 0 && (
        <DialogField
          name="+ Add People"
          title="Add Picket Members"
          variant="outline"
          size="sm"
          submitDisabled={selectedUserIds.length === 0 || isAddingMembers}
          onCancel={() => setSelectedUserIds([])}
          onSubmit={async (closeDialog?: () => void) => {
            await handleAddMembers(selectedUserIds);
            setSelectedUserIds([]);
            if (typeof closeDialog === 'function') closeDialog();
          }}
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              This day currently has {picketData.length}/{MAX_PICKET_USERS_PER_DAY} members — you can add up to {remainingSlots} more.
            </p>
            <MultiSelectDropdownField
              options={availableOptions}
              title="Select Member"
              value={selectedUserIds}
              displayValue={selectedLabels}
              onChange={(ids) => setSelectedUserIds(ids.slice(0, remainingSlots))}
            />
          </div>
        </DialogField>
      )}
    </div>
  );
}
