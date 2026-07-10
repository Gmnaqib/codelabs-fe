import { useMemo } from 'react';
import { useTableStore } from '@/shared/state';
import { useTableData } from '@/features/table/hooks';
import { useAuth } from '@/features/auth/hooks';
import { getAllUsers } from '@/services/users/userService';
import type { RawProductRecord } from '@/services/product/productsService';
import type { User } from '@/types/domain';

interface UseMembersTableOptions {
  filterRole?: string;
  filterSubriset?: string;
  filterStatus?: string;
  filterProduct?: string;
  products?: RawProductRecord[];
  fetchTrigger?: number;
}

export function useMembersTable({
  filterRole = 'All Role',
  filterSubriset = 'All SubRiset',
  filterStatus = 'All Status',
  filterProduct = 'All Product',
  products = [],
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
    const productNameById = new Map(products.map((p) => [p._id, p.name]));

    return data
      .filter((u) => isAdmin || !['admin', 'lecturer'].includes((u.role || '').toLowerCase()))
      .filter((u) => u.name?.toLowerCase().includes(query) || u.nim?.toLowerCase().includes(query))
      .filter((u) => (filterRole === 'All Role' ? true : u.role === filterRole))
      .filter((u) => (filterSubriset === 'All SubRiset' ? true : u.research === filterSubriset))
      .filter((u) => (filterStatus === 'All Status' ? true : u.status === filterStatus))
      .filter((u) => (filterProduct === 'All Product' ? true : productNameById.get(u.product_id ?? '') === filterProduct));
  }, [data, searchQuery, user, filterRole, filterSubriset, filterStatus, filterProduct, products]);

  return { users, loading, error, refetch };
}
