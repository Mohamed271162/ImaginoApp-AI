'use client';

import {
  getAuthState,
  logoutAction,
  type AuthState,
  type User,
} from '@/services/Auth.Server.service';

import { getCookie } from '@/services/ClientCookies.service';
import { getServerCookies } from '@/services/ServerCookies.service';
import { ACCESS_TOKEN_COOKIE_KEY } from '@/utils/Cookies.keys';
import { decodeJwtPayload } from '@/utils/JWT';
import { create } from 'zustand';

type AuthStoreState = AuthState & {
  loading: boolean;
  hydrated: boolean;
  refreshAuth: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: User | null | undefined) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  loading: true,
  hydrated: false,
  isAuthenticated: false,
  user: undefined,

  refreshAuth: async () => {
    const token =
      (await getServerCookies(ACCESS_TOKEN_COOKIE_KEY)) || getCookie(ACCESS_TOKEN_COOKIE_KEY);
    set({ loading: true });

    if (!token) {
      set({ isAuthenticated: false, user: null, loading: false });
      return;
    }

    const user = decodeJwtPayload<User>(token);
    set({ isAuthenticated: true, user, loading: false });
  },

  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),

  hydrate: async () => {
    if (get().hydrated && !get().loading) return;

    set({ loading: true });

    try {
      const authState = await getAuthState();

      set({
        ...authState,
        loading: false,
        hydrated: true,
      });
    } catch (error) {
      console.error('Auth hydrate error:', error);

      set({
        isAuthenticated: false,
        user: undefined,
        loading: false,
        hydrated: true,
      });
    }
  },

  logout: async () => {
    try {
      await logoutAction();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        isAuthenticated: false,
        user: undefined,
      });
    }
  },
}));
