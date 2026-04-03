import { create } from 'zustand';
import { Platform } from 'react-native';
import { api, setTokens, clearTokens, getAccessToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  isOnboarded?: boolean;
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
    // Persist isLoggedIn for cold-start flash prevention on web
    if (Platform.OS === 'web') {
      localStorage.setItem('isLoggedIn', 'true');
    }
  },

  logout: async () => {
    // Notify backend to delete session — on web the httpOnly refreshToken cookie is sent automatically.
    // On native the body is empty; the session will expire naturally (acceptable for native logout).
    try { await api.post('/auth/logout', {}); } catch { /* best-effort */ }

    await clearTokens();
    // Clear isLoggedIn flag on web
    if (Platform.OS === 'web') {
      localStorage.removeItem('isLoggedIn');
    }
    set({ user: null, accessToken: null });
  },

  hydrate: async () => {
    // Web cold-start optimization: set tentative isLoggedIn from localStorage synchronously
    // to prevent flash of the login screen on page reload. The /me call below confirms or resets it.
    if (Platform.OS === 'web') {
      const cachedLogin = localStorage.getItem('isLoggedIn') === 'true';
      if (cachedLogin) {
        set({ isReady: true }); // show app shell immediately; user is set async below
      }
    }

    try {
      const token = await getAccessToken();
      if (!token) {
        set({ user: null, isReady: true });
        return;
      }

      // api.ts handles reactive refresh on 401 automatically
      const res = await api.get<{ user: User }>('/auth/me');
      if (res.ok && res.data) {
        set({ user: res.data.user, accessToken: token, isReady: true });
      } else {
        await clearTokens();
        if (Platform.OS === 'web') localStorage.removeItem('isLoggedIn');
        set({ user: null, isReady: true });
      }
    } catch {
      set({ isReady: true });
    }
  },
}));
