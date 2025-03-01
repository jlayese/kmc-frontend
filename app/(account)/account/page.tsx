"use client";

import { useEffect, useState } from "react";
import { useUserStore, User } from "@/context/user-store"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadPhoto } from "@/utils/uploadPhoto";
import { useAuthStore } from "@/context/auth-store";
import Image from "next/image";

interface AccountPageProps {
    user: User | null;
}

export default function AccountPage({ user }: AccountPageProps) {
    const { updateUser } = useUserStore();
    const { getToken } = useAuthStore();
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>(
        user || {
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
        if (user) {
            setFormData(user); // When user is available, populate form data
        }
    }, [user]);

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

        // Update user data if user is logged in
        if (user) {
            await updateUser(user._id, updatedData); // Assuming user has an _id field
        }

        setIsLoading(false);
    };

    return (
        <div className="container mx-auto p-4 w-full md:w-4/5">
            <h1 className="text-2xl font-bold mb-6">Account Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    <div>
                        <Label>First Name</Label>
                        <Input
                            name="firstName"
                            value={formData.firstName || ""}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label>Last Name</Label>
                        <Input
                            name="lastName"
                            value={formData.lastName || ""}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label>Contact Number</Label>
                        <Input
                            name="contactNumber"
                            value={formData.contactNumber || ""}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            name="password"
                            type="password"
                            value={formData.password || ""}
                            onChange={handleChange}
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <Label>Role</Label>
                        <Input
                            name="role"
                            value={formData.role || "user"}
                            disabled
                            className="mt-1"
                        />
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
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1"
                        />
                        {formData.profilePhoto && (
                            <Image
                                width={50}
                                height={50}
                                src={formData.profilePhoto}
                                alt="Profile"
                                className="mt-2 w-20 h-20 object-cover rounded-full"
                            />
                        )}
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="mt-4"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
