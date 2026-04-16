import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  initial: string;
  avatarUrl: string | null;
  isOnboarded: boolean;
}

interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  loading: boolean;
  setUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  loading: true,
  setUser: (user) => set({ isLoggedIn: true, user, loading: false }),
  logout: async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch {}
    set({ isLoggedIn: false, user: null, loading: false });
  },
  fetchMe: async () => {
    try {
      const { user } = await apiFetch('/auth/me');
      const initial = (user.name || user.email || 'Г')[0].toUpperCase();
      set({ isLoggedIn: true, user: { ...user, initial }, loading: false });
    } catch {
      set({ isLoggedIn: false, user: null, loading: false });
    }
  },
}));
