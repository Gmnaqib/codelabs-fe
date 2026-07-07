import React from 'react';
import type { TableColumn } from '@/features/table/components';
import type { User } from '@/types/domain';
import { WEEK_TO_DATE } from '@/shared/constants';

const baseColumns = (): TableColumn<User>[] => [
  { key: 'name', label: 'Nama', width: 200 },
  { key: 'nim', label: 'NIM', width: 150 },
];

function checkboxRender(checked: boolean, onChange: () => void): React.ReactNode {
  return React.createElement('input', {
    type: 'checkbox',
    checked,
    onChange,
  });
}

export function createPicketColumns(
  onToggle: (userId: string, week: number) => void,
  isChecked: (userId: string, week: number) => boolean
): TableColumn<User>[] {
  const weeks = Object.keys(WEEK_TO_DATE)
    .map(Number)
    .sort((a, b) => a - b);

  const weekColumns: TableColumn<User>[] = weeks.map((week) => ({
    key: `week-${week}` as keyof User & string,
    label: `Minggu ${week}`,
    width: 80,
    render: (_value, row) =>
      checkboxRender(isChecked(row._id, week), () => onToggle(row._id, week)),
  }));

  return [...baseColumns(), ...weekColumns];
}

export function createThematicColumns(
  onToggle: (userId: string, day: number) => void,
  isChecked: (userId: string, day: number) => boolean
): TableColumn<User>[] {
  const dayColumns: TableColumn<User>[] = Array.from({ length: 31 }, (_, i) => i + 1).map(
    (day) => ({
      key: `day-${day}` as keyof User & string,
      label: String(day),
      width: 40,
      render: (_value, row) =>
        checkboxRender(isChecked(row._id, day), () => onToggle(row._id, day)),
    })
  );

  return [...baseColumns(), ...dayColumns];
}

export function createAbsenceColumns(
  onToggle: (userId: string, day: number) => void,
  isChecked: (userId: string, day: number) => boolean
): TableColumn<User>[] {
  const dayColumns: TableColumn<User>[] = Array.from({ length: 31 }, (_, i) => i + 1).map(
    (day) => ({
      key: `day-${day}` as keyof User & string,
      label: String(day),
      width: 40,
      render: (_value, row) =>
        checkboxRender(isChecked(row._id, day), () => onToggle(row._id, day)),
    })
  );

  return [...baseColumns(), ...dayColumns];
}
