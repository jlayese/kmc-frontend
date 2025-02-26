'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { getAccountSignInPath } from '@/helpers/common/functions/paths';
import { newSomethingWentWrongToast } from '@/helpers/common/toast/newToastSearchParams';


export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  profilePhoto: string;
  role: 'user' | 'admin' | 'super-admin';
  isApproved: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string; 
  __v: number;
}


type AuthState = {
  token: string | null;
  user: User | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: true,

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { token, user } = await response.json();
      set({ token, user });
      localStorage.setItem('authToken', token); // Store token for persistence

      return true;
    } catch (error) {
      console.error('Login failed:', (error as Error).message);
      return false;
    }
  },

  logout: async () => {
    set({ token: null, user: null });
    localStorage.removeItem('authToken');
  },
}));

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setToken, user, setUser } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, [setToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        router.push(getAccountSignInPath(newSomethingWentWrongToast()));
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user');

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error((error as Error).message);
        setUser(null);
        router.push(getAccountSignInPath(newSomethingWentWrongToast()));
      }
    };

    if (!user && token) {
      fetchUserData();
    }
  }, [router, token, user, pathname, setUser]);

  return <>{children}</>;
};

export default AuthProvider;
