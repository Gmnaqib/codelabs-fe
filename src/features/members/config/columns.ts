import type { TableColumn } from '@/features/table/components';
import type { User } from '@/types/domain';
import { ROLE_LABELS } from '@/shared/constants';

export function createMemberColumns(): TableColumn<User>[] {
  return [
    { key: 'nim', label: 'NIM', width: 120 },
    {
      key: 'name',
      label: 'Name',
      width: 180,
      render: (_value, row) => row.name?.split(' ')[0] ?? '-',
    },
    { key: 'email', label: 'Email', width: 260 },
    { key: 'subriset', label: 'Sub Riset', width: 150 },
    {
      key: 'role',
      label: 'Role',
      width: 200,
      render: (_value, row) => ROLE_LABELS[row.role] ?? row.role,
    },
    { key: 'status', label: 'Status', width: 150 },
  ];
}
