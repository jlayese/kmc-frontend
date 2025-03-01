"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Contact, useContactStore } from "@/context/contact-store";
import { uploadPhoto } from "@/utils/uploadPhoto";
import { useAuthStore } from "@/context/auth-store";
import Image from "next/image";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    userId: string;
    contact?: Contact | null;
}

export default function ContactModal({ isOpen, onClose, mode, userId }: ContactModalProps) {
    const { createContact, updateContact, clearSelectedContact, selectedContact } = useContactStore();
    const { getToken } = useAuthStore();

    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Contact>>({});
    const [initialData, setInitialData] = useState<Partial<Contact> | null>(null);

    useEffect(() => {
        if (selectedContact) {
            setFormData(selectedContact);
            setInitialData(selectedContact);
        } else {
            const defaultData = {
                firstName: "",
                lastName: "",
                email: "",
                contactNumber: "",
                profilePhoto: "",
            };
            setFormData(defaultData);
            setInitialData(defaultData);
        }
    }, [selectedContact, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFile = e.target.files[0];
            setProfilePhotoFile(newFile);
    
            setFormData(prev => ({
                ...prev,
                profilePhoto: URL.createObjectURL(newFile),
            }));
        }
    };

    // const getUpdatedFields = (): Partial<Contact> => {
    //     if (!initialData) return formData;
    
    //     return Object.keys(formData).reduce((acc, key) => {
    //         const typedKey = key as keyof Contact;
    //         if (formData[typedKey] !== initialData[typedKey]) {
    //             acc[typedKey] = formData[typedKey];
    //         }
    //         return acc;
    //     }, {} as Partial<Contact>);
    // };

    const getUpdatedFields = (): Partial<Contact> => {
        if (!initialData) return formData;
    
        console.log("Initial Data:", initialData);
        console.log("Form Data:", formData);
    
        return Object.keys(formData).reduce((acc, key) => {
            const typedKey = key as keyof Contact;
            if (formData[typedKey] !== initialData[typedKey]) {
                acc[typedKey] = formData[typedKey];
            }
            return acc;
        }, {} as Partial<Contact>);
    };


    const handleSave = async () => {
        setIsLoading(true);
        const updatedData = getUpdatedFields();
        const token = getToken();
        console.log('profilePhotoFile', profilePhotoFile)

        if (profilePhotoFile && token) {
            if (!initialData?.profilePhoto || formData.profilePhoto !== initialData.profilePhoto) {
                const uploadedImageUrl = await uploadPhoto(profilePhotoFile, token);
                if (uploadedImageUrl) {
                    updatedData.profilePhoto = uploadedImageUrl;
                }
            }
        }
    
        if (Object.keys(updatedData).length > 0) {
            if (mode === "edit" && selectedContact) {
                await updateContact(userId, selectedContact._id, updatedData);
            } else {
                await createContact(userId, updatedData);
            }
        }
    
        setIsLoading(false);
        onClose();
    };
    

    const handleClose = () => {
        onClose();
        clearSelectedContact();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "edit" ? "Edit Contact" : "Add Contact"}</DialogTitle>
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

                    <div>
                        <Label>Profile Photo</Label>
                        <Input type="file" onChange={handleFileChange} />
                        {formData.profilePhoto && (
                            <Image width={20} height={20} src={formData.profilePhoto} alt="Profile" className="mt-2 w-20 h-20 object-cover rounded-full" />
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSave} disabled={isLoading || Object.keys(getUpdatedFields()).length === 0 }>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
