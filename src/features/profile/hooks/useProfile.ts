import { useCallback, useEffect, useState } from 'react';
import { getMe, updateMe, registerMacAddress } from '@/services/users/userService';
import { handleError } from '@/shared/services';
import type { UserType } from '@/types/user';

export function useProfile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getMe();
      setUser(res);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const uploadPhoto = useCallback(
    async (formData: FormData) => {
      await updateMe(formData);
      await fetchUser();
    },
    [fetchUser]
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!user) return;
      const formData = new FormData();
      formData.append('password', password);
      await updateMe(formData);
      await fetchUser();
    },
    [fetchUser, user]
  );

  const resetMacAddress = useCallback(async () => {
    await registerMacAddress();
    await fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser, uploadPhoto, updatePassword, resetMacAddress };
}
