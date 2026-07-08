"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createMemberColumns } from '@/features/members/config/columns';
import { useMembersTable } from '@/features/members/hooks/useMembersTable';

interface MembersTableProps {
  filterRole?: string;
  filterSubriset?: string;
  filterStatus?: string;
  fetchTrigger?: number;
  [key: string]: unknown;
}

export default function MembersTable({ filterRole, filterSubriset, filterStatus, fetchTrigger }: MembersTableProps) {
  const { users, loading, error, refetch } = useMembersTable({ filterRole, filterSubriset, filterStatus, fetchTrigger });
  const columns = useMemo(() => createMemberColumns({ onEdit: refetch }), [refetch]);

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={users}
      columns={columns}
      loading={loading}
      emptyMessage="No data available"
    />
  );
}
