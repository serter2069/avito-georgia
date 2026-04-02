import { create } from 'zustand';
import { api, setTokens, clearTokens, getAccessToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isReady: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,
  isReady: false,

  setAuth: async (user, accessToken, refreshToken) => {
    // Set state synchronously first so navigation guards see the user immediately
    set({ user, accessToken, isReady: true });
    await setTokens(accessToken, refreshToken);
  },

  logout: async () => {
    await clearTokens();
    set({ user: null, accessToken: null });
  },

  hydrate: async () => {
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ isReady: true });
        return;
      }

      const res = await api.get<{ user: User }>('/auth/me');
      if (res.ok && res.data) {
        set({ user: res.data.user, accessToken: token, isReady: true });
      } else {
        await clearTokens();
        set({ isReady: true });
      }
    } catch {
      set({ isReady: true });
    }
  },
}));
