"use client";

import { create } from "zustand";
import { API_URL } from "./constants";
import { toast } from "sonner";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    profilePhoto: string;
    role: "user" | "admin" | "super-admin";
    isApproved: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    password?: string;
}

type UserStore = {
    users: User[];
    loading: boolean;
    selectedUser: User | null;
    fetchUsers: () => Promise<void>;
    createUser: (data: Partial<User>) => Promise<void>;
    updateUser: (userId: string, data: Partial<User>) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    clearSelectedUser: () => void;
    fetchUserById:(userId: string) => Promise<User| null>;
};

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
};

export const useUserStore = create<UserStore>((set) => ({
    users: [],
    loading: false,
    selectedUser: null,

    setSelectedUser: (user: User | null) => {
        set({ selectedUser: user });
    },

    clearSelectedUser: () => {
        set({ selectedUser: null });
    },

    fetchUsers: async () => {
        set({ loading: true });
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to fetch users")
                return
            }
            const data = await response.json();

            set({ users: data?.data?.users || [], loading: false });
        } catch (error) {
            console.error("Fetch Users Error:", error);
            set({ loading: false });
        }
    },

    fetchUserById: async (userId: string): Promise<User | null> => {
        set({ loading: true });
        const token = getAuthToken();
    
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response)
    
            if (!response.ok) {
                toast.error("Failed to fetch user")
                return null;
            }
            const data = await response.json();
    
            const user = data?.data?.user || null;
            console.log(user)
            set({ selectedUser: user, loading: false });
    
            return user;
        } catch (error) {
            console.error("Fetch User by ID Error:", error);
            set({ loading: false });
    
            return null;
        }
    },
    

    createUser: async (data) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/admin/users/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Failed to create user")
                return
            }
            const newUser = await response.json();

            toast.success(newUser?.message || "User created successfully!");

            await useUserStore.getState().fetchUsers();
        } catch (error) {
            console.error("Create User Error:", error);
            toast.error("Failed to create user. Please try again.");
        }
    },

    updateUser: async (userId, data) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Failed to update user")
                return
            }
            const updatedUser = await response.json();

            toast.success(updatedUser?.message || "Updated Successfully!");

            await useUserStore.getState().fetchUsers();
        } catch (error) {
            console.error("Update User Error:", error);
            toast.error("Failed to update user. Please try again.");
        }
    },

    deleteUser: async (userId) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to delete user")
                return
            }

            set((state) => ({
                users: state.users.filter((user) => user._id !== userId),
            }));

            toast.success("User deleted successfully!");
        } catch (error) {
            console.error("Delete User Error:", error);
            toast.error("Failed to delete user.");
        }
    },
}));
