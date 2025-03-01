"use client";

import { create } from "zustand";
import { API_URL } from "./constants";
import { toast } from "sonner";

export interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    profilePhoto: string;
    owner: string;
    sharedUsers: string[];
    createdAt: string;
    updatedAt: string;
    [key: string]: any
}

type ContactStore = {
    contacts: Contact[];
    relativeUsers: Contact[];
    loading: boolean;
    selectedContact: Contact | null;
    fetchContacts: (userId: string) => Promise<void>;
    getContactsGroupedByOwner: (userId: string) => Promise<void>;
    createContact: (userId: string, data: Partial<Contact>) => Promise<void>;
    updateContact: (userId: string, contactId: string, data: Partial<Contact>) => Promise<void>;
    deleteContact: (userId: string, contactId: string) => Promise<void>;
    shareContact: (contactId: string, targetUserId: string, userId: string) => Promise<boolean>;
    unshareContact: (contactId: string, targetUserId: string, userId: string) => Promise<boolean>;
    setSelectedContact: (contact: Contact | null) => void;
    clearSelectedContact: () => void;
    // getContactsGroupedByOwner: () => Record<string, Contact[]>
};

const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
};

export const useContactStore = create<ContactStore>((set, get) => ({
    contacts: [],
    relativeUsers: [],
    loading: false,
    selectedContact: null,

    setSelectedContact: (contact: Contact | null) => {
        set({ selectedContact: contact });
    },

    clearSelectedContact: () => {
        set({ selectedContact: null });
    },

    fetchContacts: async (userId: string) => {
        set({ loading: true });
        const token = getAuthToken();


        try {
            const response = await fetch(`${API_URL}/contacts/user/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to fetch contacts")
                return;
            }
            const data = await response.json();

            set({ contacts: data?.data?.contacts || [], loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    getContactsGroupedByOwner: async (userId: string) => {
        set({ loading: true });
        const token = getAuthToken();


        try {
            const response = await fetch(`${API_URL}/users/user/${userId}/other-users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


            if (!response.ok) {
                toast.error("Failed to fetch contacts")
                return
            }
            const data = await response.json();


            set({ relativeUsers: data?.data || [], loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    createContact: async (userId, data) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/contacts/user/${userId}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Failed to fetch contacts")
                return
            }
            const newContact = await response.json();

            toast.success(newContact?.message || "Contact created successfully!");

            await useContactStore.getState().fetchContacts(userId);
        } catch (error) {
            toast.error("Failed to create contact. Please try again.");
        }
    },

    updateContact: async (userId, contactId, data) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/contacts/user/${userId}/contact/${contactId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                toast.error("Failed to update contact")

            };
            const updatedContact = await response.json();

            toast.success(updatedContact?.message || "Updated Successfully!");

            await useContactStore.getState().fetchContacts(userId);
        } catch (error) {
            toast.error("Failed to update contact. Please try again.");
        }
    },

    deleteContact: async (userId, contactId) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/contacts/user/${userId}/contact/${contactId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to delete contacts")
                return
            }

            set((state) => ({
                contacts: state.contacts.filter((contact) => contact._id !== contactId),
            }));

            toast.success("Contact deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete contact.");
        }
    },

    shareContact: async (contactId, targetUserId, userId) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/contacts/${contactId}/share/${targetUserId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to share contact")
                return false;
            }

            toast.success("Contact shared successfully!");

            await useContactStore.getState().fetchContacts(userId);
            return true;
        } catch (error) {
            toast.error("Failed to share contact.");
            return false;
        }
    },

    unshareContact: async (contactId, targetUserId, userId) => {
        const token = getAuthToken();

        try {
            const response = await fetch(`${API_URL}/contacts/${contactId}/unshare/${targetUserId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                toast.error("Failed to unshare contacts")
                return false
            }

            toast.success("Contact unshared successfully!");

            await useContactStore.getState().fetchContacts(userId);
            return true;
        } catch (error) {
            console.error("Unshare Contact Error:", error);
            toast.error("Failed to unshare contact.");
            return false;
        }
    },
}));
