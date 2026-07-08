import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { useAuth } from '@/features/auth/hooks';
import { getAllUsers } from '@/services/users/userService';
import type { User } from '@/types/domain';

interface UseMembersTableOptions {
  filterRole?: string;
  filterSubriset?: string;
  filterStatus?: string;
  fetchTrigger?: number;
}

export function useMembersTable({
  filterRole = 'All Role',
  filterSubriset = 'All SubRiset',
  filterStatus = 'All Status',
  fetchTrigger,
}: UseMembersTableOptions = {}) {
  const searchQuery = useTableStore((s) => s.searchQuery);
  const { user } = useAuth();

  const { data, loading, error, refetch } = useTableData<User>(
    () => getAllUsers() as Promise<User[]>,
    [fetchTrigger]
  );

  const users = useMemo(() => {
    const currentRole = user?.role;
    if (!currentRole) return [];

    const query = searchQuery.trim().toLowerCase();
    const isAdmin = currentRole.toLowerCase() === 'admin';

    return data
      .filter((u) => isAdmin || !['admin', 'lecturer'].includes((u.role || '').toLowerCase()))
      .filter((u) => u.name?.toLowerCase().includes(query))
      .filter((u) => (filterRole === 'All Role' ? true : u.role === filterRole))
      .filter((u) => (filterSubriset === 'All SubRiset' ? true : u.subriset === filterSubriset))
      .filter((u) => (filterStatus === 'All Status' ? true : u.status === filterStatus));
  }, [data, searchQuery, user, filterRole, filterSubriset, filterStatus]);

  return { users, loading, error, refetch };
}
