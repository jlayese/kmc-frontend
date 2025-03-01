"use client";

import { useEffect, useState } from "react";
import { User, useUserStore } from "@/context/user-store";
import { Button } from "@/components/ui/button";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,

    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, CheckCircle, XCircle, View } from "lucide-react";
import { useAuthStore } from "@/context/auth-store";
import ConfirmationDialog from "@/components/common/confirmation-dialog";
import { Badge } from "@/components/ui/badge";
import UserModal from "./edit-user-modal";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import Link from "next/link";

export default function UserManagement() {
    const { user } = useAuthStore();
    const { users, fetchUsers, updateUser, loading, selectedUser, setSelectedUser, clearSelectedUser } = useUserStore();
    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);
    const [modalData, setModalData] = useState({
        isOpen: false,
        title: "",
        description: "",
        confirmText: "",
        confirmVariant: "default" as "default" | "destructive" | "outline",
        action: async () => { },
    });

    useEffect(() => {
        if (user && ["admin", "super-admin"].includes(user.role)) {
            fetchUsers();
        }
    }, [user, fetchUsers]);

    const openConfirmationDialog = (
        title: string,
        description: string,
        confirmText: string,
        confirmVariant: "default" | "destructive" | "outline",
        action: () => Promise<void>
    ) => {
        setModalData({ isOpen: true, title, description, confirmText, confirmVariant, action });
    };

    const handleSelecteUser = (user: User) => {
        setSelectedUser(user)
    }

    const handleApprove = async (userId: string) => {
        openConfirmationDialog(
            "Approve User",
            "Are you sure you want to approve this user?",
            "Approve",
            "default",
            async () => {
                await updateUser(userId, { isApproved: true });
                setModalData((prev) => ({ ...prev, isOpen: false }));
            }
        );
    };

    const handleDeactivate = async (userId: string) => {
        openConfirmationDialog(
            "Deactivate User",
            "Are you sure you want to deactivate this user?",
            "Deactivate",
            "destructive",
            async () => {
                await updateUser(userId, { isActive: false });
                setModalData((prev) => ({ ...prev, isOpen: false }));
            }
        );
    };

    const handleDelete = async (userId: string) => {
        openConfirmationDialog(
            "Delete User",
            "Are you sure you want to delete this user? This action cannot be undone.",
            "Delete",
            "destructive",
            async () => {
                await updateUser(userId, { isDeleted: true });
                setModalData((prev) => ({ ...prev, isOpen: false }));
            }
        );
    };


    const openAddUserModal = () => {
        clearSelectedUser();
        setAddEditModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button onClick={openAddUserModal} variant="outline">Add User</Button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <Table>
                    <TableCaption>A list of registered users.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">
                                    {user.firstName} {user.lastName}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Badge variant={user.isApproved ? "primary" : "warning"}>
                                        {user.isApproved ? "Approved" : "Pending"}
                                    </Badge>
                                    <Badge variant={user.isActive ? "success" : "destructive"} className="ml-2">
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right flex justify-end gap-2">

                                    <TooltipWrapper tooltipText="Approve">
                                        {!user.isApproved && (
                                            <Button size="icon" variant="outline" onClick={() => handleApprove(user._id)}>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </Button>
                                        )}
                                    </TooltipWrapper>
                                    <TooltipWrapper tooltipText="Deactivate">
                                        {user.isActive ? (
                                            <Button size="icon" variant="outline" onClick={() => handleDeactivate(user._id)}>
                                                <XCircle className="w-5 h-5 text-yellow-500" />
                                            </Button>
                                        ) : null}
                                    </TooltipWrapper>
                                    <TooltipWrapper tooltipText="Update">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => {
                                                handleSelecteUser(user);
                                                setAddEditModalOpen(true);
                                            }}
                                        >
                                            <Edit className="w-5 h-5 text-blue-500" />
                                        </Button>
                                    </TooltipWrapper>
                                    <TooltipWrapper tooltipText="View User">
                                        <Link href={`/dashboard/admin/user/${user._id}`}>
                                            <Button size="icon" variant="outline" >
                                                <View className="w-5 h-5 " />
                                            </Button>
                                        </Link>
                                    </TooltipWrapper>
                                    <TooltipWrapper tooltipText="Delete User">
                                        <Button size="icon" variant="destructive" onClick={() => handleDelete(user._id)}>
                                            <Trash2 className="w-5 h-5 " />
                                        </Button>
                                    </TooltipWrapper>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <ConfirmationDialog
                isOpen={modalData.isOpen}
                onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={modalData.action}
                title={modalData.title}
                description={modalData.description}
                confirmText={modalData.confirmText}
                confirmVariant={modalData.confirmVariant}
            />

            {selectedUser ? (
                <UserModal
                    user={selectedUser}
                    onClose={() => {
                        setAddEditModalOpen(false)

                    }}
                    isOpen={isAddEditModalOpen} mode={"edit"} />

            ) : (
                <UserModal isOpen={isAddEditModalOpen} onClose={() => {
                    setAddEditModalOpen(false)

                }} mode="add" />
            )}
        </div>
    );
}
