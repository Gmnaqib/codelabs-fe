"use client"

import React from 'react';
import EmptyState from '@/components/custom-ui/EmptyState';
import ThematicSwapCell from '@/features/thematic/components/ThematicSwapCell';
import type { ThematicSwapSchedule } from '@/features/thematic/types';

interface MonthlyThematicScheduleListProps {
  schedules: ThematicSwapSchedule[];
  loading?: boolean;
  onSwap: (schedule1Id: string, schedule2Id: string) => void;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function MonthlyThematicScheduleList({ schedules, loading = false, onSwap }: MonthlyThematicScheduleListProps) {
  if (loading) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>;
  }

  if (schedules.length === 0) {
    return <EmptyState message="There is no thematic schedule for this month" className="py-8" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {schedules.map((schedule) => {
        const candidates = schedules.filter((s) => s._id !== schedule._id);
        return (
          <div
            key={schedule._id}
            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <p className="text-base font-semibold text-primary">{schedule.description || 'Uncategorized'}</p>
                <p className="text-xs text-muted-foreground">{formatDate(schedule.date)}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {schedule.assignedUsers.length === 0 ? (
                  <span className="text-sm text-muted-foreground">No team assigned</span>
                ) : (
                  schedule.assignedUsers.map((u) => (
                    <span
                      key={u._id}
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                    >
                      {u.name}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="shrink-0 self-end sm:self-center">
              <ThematicSwapCell rangeSchedules={candidates} onSwap={(targetId) => onSwap(schedule._id, targetId)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
