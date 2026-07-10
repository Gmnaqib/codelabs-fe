import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { AuthUser, JwtPayload } from '@/types/domain';
import { getStoredToken, clearStoredToken } from '@/shared/utils';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  setUser: (u: AuthUser | null) => void;
  hydrateFromToken: () => void;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      user: null,
      loading: true,
      initialized: false,

      setUser: (u) => set({ user: u }),

      hydrateFromToken: () => {
        const token = getStoredToken();
        if (!token) {
          set({ user: null, loading: false, initialized: true });
          return;
        }

        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            clearStoredToken();
            set({ user: null });
          } else {
            set({
              user: {
                id: decoded.id,
                name: decoded.name,
                nim: decoded.nim,
                role: decoded.role as AuthUser['role'],
                major: decoded.major,
                status: decoded.status,
                deviceId: decoded.device_id,
              },
            });
          }
        } catch {
          clearStoredToken();
          set({ user: null });
        } finally {
          set({ loading: false, initialized: true });
        }
      },

      logout: () => {
        clearStoredToken();
        set({ user: null });
      },

      hasRole: (roles) => {
        const role = get().user?.role;
        return !!role && roles.includes(role);
      },
    }),
    { name: 'AuthStore' }
  )
);
