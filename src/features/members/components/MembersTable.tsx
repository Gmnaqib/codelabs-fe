"use client"

import React, { useMemo } from 'react';
import { BaseTable } from '@/features/table/components';
import { createMemberColumns } from '@/features/members/config/columns';
import { useMembersTable } from '@/features/members/hooks/useMembersTable';
import { useAuth } from '@/features/auth/hooks';
import type { RawProductRecord } from '@/services/product/productsService';
import { USER_ROLES, ROLE_LABELS } from '@/shared/constants';

interface MembersTableProps {
  filterRole?: string;
  filterSubriset?: string;
  filterStatus?: string;
  filterProduct?: string;
  products?: RawProductRecord[];
  fetchTrigger?: number;
  [key: string]: unknown;
}

export default function MembersTable({
  filterRole,
  filterSubriset,
  filterStatus,
  filterProduct,
  products = [],
  fetchTrigger,
}: MembersTableProps) {
  const { users, loading, error, refetch } = useMembersTable({
    filterRole,
    filterSubriset,
    filterStatus,
    filterProduct,
    products,
    fetchTrigger,
  });
  const { user: currentUser } = useAuth();
  const isAdmin = (currentUser?.role ?? '').toLowerCase() === 'admin';

  const roleOptions = useMemo(
    () =>
      USER_ROLES.filter((role) => isAdmin || role !== 'admin').map((role) => ({
        value: role,
        title: ROLE_LABELS[role],
      })),
    [isAdmin]
  );

  const productOptions = useMemo(
    () => products.map((product) => ({ value: product._id, title: product.name })),
    [products]
  );

  const columns = useMemo(
    () => createMemberColumns({ roleOptions, productOptions, onSaved: refetch }),
    [roleOptions, productOptions, refetch]
  );

  if (error) {
    return <div className="text-destructive p-4">{error.message}</div>;
  }

  return (
    <BaseTable
      data={users}
      columns={columns}
      loading={loading}
      emptyMessage="No data available"
      paginate
    />
  );
}
