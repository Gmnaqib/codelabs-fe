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
        const users = (await getAllUsers({ activeOnly: true })) as User[];
        // activeOnly already excludes inactive/graduated/lecturer server-side;
        // admin still needs excluding here since "Total Members" shouldn't
        // count staff accounts either.
        const filtered = users.filter((u) => (u.role || '').toLowerCase() !== 'admin');
        setTotalUsers(filtered.length);
      } catch (err) {
        setError(handleError(err));
      }
    };

    fetchUsers();
  }, []);

  return { totalUsers, error };
}
