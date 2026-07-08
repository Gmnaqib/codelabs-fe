import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getStoredTokenMock, clearStoredTokenMock } = vi.hoisted(() => ({
  getStoredTokenMock: vi.fn(),
  clearStoredTokenMock: vi.fn(),
}));

vi.mock('@/shared/utils', () => ({
  getStoredToken: getStoredTokenMock,
  clearStoredToken: clearStoredTokenMock,
}));

const { jwtDecodeMock } = vi.hoisted(() => ({
  jwtDecodeMock: vi.fn(),
}));

vi.mock('jwt-decode', () => ({
  jwtDecode: jwtDecodeMock,
}));

import { useAuthStore } from '@/shared/state/authStore';

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, loading: true, initialized: false });
  });

  describe('hydrateFromToken', () => {
    it('fills the user when the token is valid', () => {
      getStoredTokenMock.mockReturnValue('valid-token');
      jwtDecodeMock.mockReturnValue({
        id: '1',
        name: 'Jane',
        nim: '123',
        role: 'admin',
        major: 'IT',
        status: 'active',
        device_id: 'device-1',
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      useAuthStore.getState().hydrateFromToken();

      const state = useAuthStore.getState();
      expect(state.user).toEqual({
        id: '1',
        name: 'Jane',
        nim: '123',
        role: 'admin',
        major: 'IT',
        status: 'active',
        deviceId: 'device-1',
      });
      expect(state.loading).toBe(false);
      expect(state.initialized).toBe(true);
      expect(clearStoredTokenMock).not.toHaveBeenCalled();
    });

    it('clears the user and the stored token when the token is expired', () => {
      getStoredTokenMock.mockReturnValue('expired-token');
      jwtDecodeMock.mockReturnValue({
        id: '1',
        name: 'Jane',
        nim: '123',
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) - 3600,
      });

      useAuthStore.getState().hydrateFromToken();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.initialized).toBe(true);
      expect(clearStoredTokenMock).toHaveBeenCalledTimes(1);
    });

    it('sets user to null without touching the token when there is no stored token', () => {
      getStoredTokenMock.mockReturnValue(null);

      useAuthStore.getState().hydrateFromToken();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.initialized).toBe(true);
      expect(clearStoredTokenMock).not.toHaveBeenCalled();
    });

    it('clears the user and the stored token when decoding fails', () => {
      getStoredTokenMock.mockReturnValue('malformed-token');
      jwtDecodeMock.mockImplementation(() => {
        throw new Error('invalid token');
      });

      useAuthStore.getState().hydrateFromToken();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(clearStoredTokenMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('clears the user and the stored token', () => {
      useAuthStore.setState({
        user: { id: '1', name: 'Jane', nim: '123', role: 'admin' },
      });

      useAuthStore.getState().logout();

      expect(useAuthStore.getState().user).toBeNull();
      expect(clearStoredTokenMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('hasRole', () => {
    it('returns true when the current user role is in the list', () => {
      useAuthStore.setState({
        user: { id: '1', name: 'Jane', nim: '123', role: 'admin' },
      });

      expect(useAuthStore.getState().hasRole(['admin', 'president'])).toBe(true);
    });

    it('returns false when the current user role is not in the list', () => {
      useAuthStore.setState({
        user: { id: '1', name: 'Jane', nim: '123', role: 'user' },
      });

      expect(useAuthStore.getState().hasRole(['admin', 'president'])).toBe(false);
    });

    it('returns false when there is no user', () => {
      useAuthStore.setState({ user: null });

      expect(useAuthStore.getState().hasRole(['admin'])).toBe(false);
    });
  });
});
