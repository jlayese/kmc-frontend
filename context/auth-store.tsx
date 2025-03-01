'use client';

import { create } from 'zustand';
import { toast } from "sonner";

import { API_URL } from './constants';

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
  checkToken: () => Promise<boolean>;
  fetchUser: () => Promise<boolean>;
  getToken: () => string | null;
  signup: (data: any) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;

};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  loading: false,

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  getToken: () => {
    return get().token || localStorage.getItem("authToken");
  },


  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const userData = await response.json();

        console.log(userData)

        if (userData.status === "deactivated") {
          set({ token: null, user: null, loading: false });
          localStorage.removeItem("authToken");
          toast.error("Your account has been deactivated. Contact support.");
          return false;
        }

        else if (userData.status === "deleted") {
          set({ token: null, user: null, loading: false });
          localStorage.removeItem("authToken");
          toast.error("Your account has been deleted.");
          return false;
        }

        else if (userData.status !== "approved") {
          set({ token: null, user: null, loading: false });
          localStorage.removeItem("authToken");
          toast.error("Your account is not approved yet.");
          return false;
        } else {
          toast.error('Login Failed!');
          return false;
        }

      }



      const { token } = await response.json();

      console.log(token)
      set({ token });
      localStorage.setItem('authToken', token);

      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          console.warn('Auth token expired or invalid.');
          set({ token: null, user: null, loading: false });
          localStorage.removeItem('authToken');
          toast.error('Session expired. Please log in again.');
          return false;
        }
        toast.error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      console.log(userData, userData.data.user)
      set({ user: userData.data.user, loading: false });
      localStorage.setItem('authUser', JSON.stringify(userData.data.user));

      return true;
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ token: null, user: null, loading: false });
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  },

  fetchUser: async () => {
    const token = get().token || localStorage.getItem("authToken");
    if (!token) {
      get().logout();
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.warn("Auth token expired or invalid.");
          get().logout();
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error("Failed to fetch user data.");
        }
        return false;
      }

      const userData = await response.json();
      set({ user: userData.data.user, loading: false });
      localStorage.setItem("authUser", JSON.stringify(userData.data.user));

      return true;
    } catch (error) {
      console.error("Fetch user error:", error);
      get().logout();
      return false;
    }
  },

  checkToken: async () => {
    return await get().fetchUser();
  },

  signup: async (data: any) => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const dataResponse = await response.json();
      if (!response.ok) {
        toast.error(dataResponse.message);
        set({ loading: false });
        return false;
      }

      toast.success(dataResponse.message)
      return true
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred during signup.');
      set({ loading: false });
      return false;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      console.log()
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const dataResponse = await response.json();
      if (!response.ok) {
        toast.error(dataResponse.message);
        set({ loading: false });
        return false;
      }

      toast.success(dataResponse.message)
      return true
    } catch (error) {
      console.error("Forgot Password error:", error);
      return false;
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const dataResponse = await response.json();
      if (!response.ok) {
        toast.error(dataResponse.message);
        set({ loading: false });
        return false;
      }

      toast.success(dataResponse.message)
      return true
    } catch (error) {
      console.error("Reset Passwrod error:", error);
      return false;
    }
  },

}));

