import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import type { TableColumn } from '@/features/table/components';
import type { User } from '@/types/domain';
import { getWeeksInMonth } from '@/shared/utils';
import type { AbsenceStatus } from '@/features/operational/hooks/useAbsenceStatus';
import type { ThematicStatus } from '@/features/operational/hooks/useThematicStatus';
import type { PicketStatus } from '@/features/operational/hooks/usePicketStatus';

const baseColumns = (): TableColumn<User>[] => [
  { key: 'nim', label: 'NIM', width: 100 },
  { key: 'name', label: 'Name', width: 100 },
];

const ABSENCE_STATUS_ICON: Record<AbsenceStatus, React.ReactNode> = {
  checked: React.createElement(CheckCircleIcon, { className: 'size-6 text-primary' }),
  sick: React.createElement(PlusCircleIcon, { className: 'size-6 text-success' }),
  permit: React.createElement(ExclamationCircleIcon, { className: 'size-6 text-warning' }),
  absent: React.createElement(MinusCircleIcon, { className: 'size-6 text-neutral' }),
  // In the live table a future day is still shown with the same icon as
  // "absent" — only the Excel export blanks it out (see exportExcel.ts).
  future: React.createElement(MinusCircleIcon, { className: 'size-6 text-neutral' }),
};

export const ABSENCE_STATUS_LABEL: Record<AbsenceStatus, string> = {
  checked: 'Checked',
  sick: 'Sick',
  permit: 'Permit',
  absent: 'Absent',
  future: '',
};

export type StatusVariant = 'positive' | 'negative' | 'pending';

export const ABSENCE_STATUS_VARIANT: Record<AbsenceStatus, StatusVariant> = {
  checked: 'positive',
  absent: 'negative',
  sick: 'pending',
  permit: 'pending',
  future: 'pending',
};

const STATUS_VARIANT_CLASS: Record<StatusVariant, string> = {
  positive: 'bg-green-100 text-green-700',
  negative: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-500',
};

function statusBadge(label: string, variant: StatusVariant): React.ReactNode {
  return React.createElement(
    'span',
    {
      className: `rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${STATUS_VARIANT_CLASS[variant]}`,
    },
    label
  );
}

export const THEMATIC_STATUS_LABEL: Record<ThematicStatus, string> = {
  thematic: 'Thematic',
  'no-thematic': 'No Thematic',
  'not-yet': 'Not Yet Thematic',
  // In the live table a future day reads the same as "not yet" — only the
  // Excel export blanks it out (see exportExcel.ts).
  future: 'Not Yet Thematic',
};

export const THEMATIC_STATUS_VARIANT: Record<ThematicStatus, StatusVariant> = {
  thematic: 'positive',
  'no-thematic': 'negative',
  'not-yet': 'pending',
  future: 'pending',
};

export const PICKET_STATUS_LABEL: Record<PicketStatus, string> = {
  picket: 'Picket',
  'no-picket': 'No Picket',
  'not-yet': 'Not Yet Picket',
};

export const PICKET_STATUS_VARIANT: Record<PicketStatus, StatusVariant> = {
  picket: 'positive',
  'no-picket': 'negative',
  'not-yet': 'pending',
};

export interface ScheduleColumns {
  left: TableColumn<User>[];
  scroll: TableColumn<User>[];
  right: TableColumn<User>[];
}

export function createPicketColumns(
  getStatus: (userId: string, week: number) => PicketStatus,
  year: number,
  month: number
): ScheduleColumns {
  const weeks = getWeeksInMonth(year, month);

  const weekColumns: TableColumn<User>[] = weeks.map((week) => ({
    key: `week-${week}` as keyof User & string,
    label: `Week ${week}`,
    width: 150,
    render: (_value, row) => {
      const status = getStatus(row._id, week);
      return statusBadge(PICKET_STATUS_LABEL[status], PICKET_STATUS_VARIANT[status]);
    },
  }));

  return { left: baseColumns(), scroll: weekColumns, right: [] };
}

export function createThematicColumns(
  getStatus: (userId: string, day: number) => ThematicStatus
): ScheduleColumns {
  const dayColumns: TableColumn<User>[] = Array.from({ length: 31 }, (_, i) => i + 1).map(
    (day) => ({
      key: `day-${day}` as keyof User & string,
      label: String(day),
      width: 150,
      render: (_value, row) => {
        const status = getStatus(row._id, day);
        return statusBadge(THEMATIC_STATUS_LABEL[status], THEMATIC_STATUS_VARIANT[status]);
      },
    })
  );

  const totalColumn: TableColumn<User> = {
    key: 'total' as keyof User & string,
    label: 'Total',
    width: 80,
    render: (_value, row) => {
      let count = 0;
      for (let day = 1; day <= 31; day++) {
        if (getStatus(row._id, day) === 'thematic') count++;
      }
      return count;
    },
  };

  return { left: baseColumns(), scroll: dayColumns, right: [totalColumn] };
}

export function createAbsenceColumns(
  getStatus: (userId: string, day: number) => AbsenceStatus
): ScheduleColumns {
  const dayColumns: TableColumn<User>[] = Array.from({ length: 31 }, (_, i) => i + 1).map(
    (day) => ({
      key: `day-${day}` as keyof User & string,
      label: String(day),
      width: 80,
      render: (_value, row) => ABSENCE_STATUS_ICON[getStatus(row._id, day)],
    })
  );

  const totalColumn: TableColumn<User> = {
    key: 'total' as keyof User & string,
    label: 'Total',
    width: 80,
    render: (_value, row) => {
      let count = 0;
      for (let day = 1; day <= 31; day++) {
        if (getStatus(row._id, day) === 'checked') count++;
      }
      return count;
    },
  };

  return { left: baseColumns(), scroll: dayColumns, right: [totalColumn] };
}
