import { useAuthStore } from '@/shared/state';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);
  const hasRole = useAuthStore((s) => s.hasRole);
  return { user, loading, logout, hasRole, isAuthenticated: !!user };
};
