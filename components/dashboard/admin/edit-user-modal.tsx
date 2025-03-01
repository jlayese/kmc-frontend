"use client";

import { useEffect, useState } from "react";
import { useUserStore, User } from "@/context/user-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadPhoto } from "@/utils/uploadPhoto";
import { useAuthStore } from "@/context/auth-store";
import Image from "next/image";

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    user?: User | null;
}

export default function UserModal({ isOpen, onClose, mode, user }: UserModalProps) {
    const { createUser, updateUser, clearSelectedUser, selectedUser } = useUserStore();
    const { getToken } = useAuthStore()
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<User>>(
        selectedUser || {
            firstName: "",
            lastName: "",
            email: "",
            contactNumber: "",
            password: "",
            role: "user",
            isApproved: false,
            isActive: true,
            profilePhoto: "",
        }
    );

    useEffect(() => {
        if (selectedUser) {
            setFormData(selectedUser);
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                contactNumber: "",
                password: "",
                role: "user",
                isApproved: false,
                isActive: true,
                profilePhoto: "",
            });
        }
    }, [selectedUser, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (name: keyof User, checked: boolean) => {
        setFormData({ ...formData, [name]: checked });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfilePhotoFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        const updatedData = { ...formData };
        const token = getToken();

        if (profilePhotoFile && token) {
            const uploadedImageUrl = await uploadPhoto(profilePhotoFile, token);

            if (uploadedImageUrl) {
                updatedData.profilePhoto = uploadedImageUrl;
            }
        }

        if (mode === "edit" && user) {
            await updateUser(user._id, updatedData);
        } else {
            await createUser(updatedData);
        }

        setIsLoading(false);
        onClose();
    };

    const handleClose = () => {
        onClose();
        clearSelectedUser();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit User" : "Add User"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>First Name</Label>
                        <Input name="firstName" value={formData.firstName || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <Input name="lastName" value={formData.lastName || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input name="email" value={formData.email || ""} onChange={handleChange} />
                    </div>

                    <div>
                        <Label>Contact Number</Label>
                        <Input name="contactNumber" value={formData.contactNumber || ""} onChange={handleChange} />
                    </div>

                    {mode === "add" && (
                        <div>
                            <Label>Password</Label>
                            <Input name="password" type="password" value={formData.password || ""} onChange={handleChange} />
                        </div>
                    )}

                    <div>
                        <Label>Role</Label>
                        <Input name="role" defaultValue={'user'} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isApproved"
                            checked={formData.isApproved || false}
                            onCheckedChange={(checked: boolean) => handleCheckboxChange("isApproved", checked)}
                        />
                        <Label htmlFor="isApproved">Approved</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isActive"
                            checked={formData.isActive || false}
                            onCheckedChange={(checked: boolean) => handleCheckboxChange("isActive", checked)}
                        />
                        <Label htmlFor="isActive">Active</Label>
                    </div>

                    <div>
                        <Label>Profile Photo</Label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        {formData.profilePhoto && (
                            <Image width={20} height={20} src={formData.profilePhoto} alt="Profile" className="mt-2 w-20 h-20 object-cover rounded-full" />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : mode === "edit" ? "Save Changes" : "Add User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
