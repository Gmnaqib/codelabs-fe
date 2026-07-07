import React from 'react';
import type { TableColumn } from '@/features/table/components';
import type { User } from '@/types/domain';
import { ROLE_LABELS } from '@/shared/constants';
import MemberEditCell from '@/features/members/components/MemberEditCell';

interface CreateMemberColumnsParams {
  onEdit?: () => void;
}

export function createMemberColumns({ onEdit }: CreateMemberColumnsParams = {}): TableColumn<User>[] {
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
    {
      key: 'action' as keyof User & string,
      label: 'Action',
      render: (_value, row) => <MemberEditCell member={row} onSuccess={onEdit} />,
    },
  ];
}
