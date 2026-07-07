import { useEffect, useState } from 'react';
import { getAllUsers } from '@/services/users/userService';
import { handleError } from '@/shared/services';

interface User {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}

export function useTotalMembersCard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = (await getAllUsers()) as User[];
        const filtered = users.filter((u) => {
          const status = (u.status || '').toLowerCase();
          const role = (u.role || '').toLowerCase();
          return status === 'active' && !['admin', 'lecturer'].includes(role);
        });
        setTotalUsers(filtered.length);
      } catch (err) {
        setError(handleError(err));
      }
    };

    fetchUsers();
  }, []);

  return { totalUsers, error };
}
