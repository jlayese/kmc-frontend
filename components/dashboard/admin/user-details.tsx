"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/context/user-store";
import { Contact, useContactStore } from "@/context/contact-store";
import { Card, CardHeader } from "@/components/ui/card";
import ContactModal from "./edit-contact-modal";
import TooltipWrapper from "@/components/common/tooltip-wrapper";
import { Edit, Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/common/confirmation-dialog";
import { useAuthStore } from "@/context/auth-store";
import { ShareContactDropdown } from "@/components/contacts/contact-sharing";

export default function UserDetailsPage({ userId }: { userId: string }) {
    const router = useRouter();
    const { user } = useAuthStore();

    const [isAddEditModalOpen, setAddEditModalOpen] = useState(false);

    const { fetchUserById, selectedUser } = useUserStore();
    const { contacts, fetchContacts, clearSelectedContact, selectedContact, setSelectedContact, deleteContact, getContactsGroupedByOwner } = useContactStore();

    const [modalData, setModalData] = useState({
        isOpen: false,
        title: "",
        description: "",
        confirmText: "",
        confirmVariant: "default" as "default" | "destructive" | "outline",
        action: async () => { },
    });

    useEffect(() => {
        if (userId) {
            fetchUserById(userId);
        }
    }, [userId, fetchUserById]);

    useEffect(() => {
        if (userId) {
            fetchContacts(userId);
        }
    }, [userId, fetchContacts]);

    useEffect(() => {
        if (userId) {
            getContactsGroupedByOwner(userId);

        }
    }, [userId, getContactsGroupedByOwner]);

    if (!selectedUser) {
        return <p>User not found!</p>;
    }

    const openAddUserModal = () => {
        clearSelectedContact();
        setAddEditModalOpen(true);
    };

    const handleSelectedContact = (contact: Contact) => {
        if (contact) {

            setSelectedContact(contact)
        }
    }

    const openConfirmationDialog = (
        title: string,
        description: string,
        confirmText: string,
        confirmVariant: "default" | "destructive" | "outline",
        action: () => Promise<void>
    ) => {
        setModalData({ isOpen: true, title, description, confirmText, confirmVariant, action });
    };

    const handleDelete = async (contactId: string) => {
        openConfirmationDialog(
            "Delete Contact",
            "Are you sure you want to delete this contact? This action cannot be undone.",
            "Delete",
            "destructive",
            async () => {
                await deleteContact(userId, contactId);
                setModalData((prev) => ({ ...prev, isOpen: false }));
            }
        );
    };

    console.log('CONTACTS =====>', contacts)

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                {user?.role !== "user" && <Button variant="outline" onClick={() => router.back()}>Back</Button>
                }
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Contact Management</h1>
                {user?.role == "user" && <Button variant="outline" onClick={openAddUserModal}>Add Contact</Button>}
            </div>
            {user?.role !== "user" && <Card className="shadow-md border mt-6 mb-4">
                <CardHeader className="flex  gap-4">

                    <h3 className=" font-bold mt-4">
                        {selectedUser.firstName} {selectedUser.lastName}
                    </h3>

                    <p>Email: {selectedUser.email}</p>

                    <div>
                        Role: <Badge>{selectedUser.role}</Badge>
                    </div>
                </CardHeader>
            </Card>}



            <Table>
                <TableHeader>
                    <TableRow>
                        {/* <TableHead>Photo</TableHead> */}
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact Number</TableHead>
                        <TableHead className="text-right">Actions</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {contacts?.length ? (
                        contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                {/* <TableCell>
                                    <Image width={50} height={50} src={contact.profilePhoto} alt="Profile" className="mt-2  object-cover rounded-full" />
                                </TableCell> */}
                                <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.contactNumber}</TableCell>

                                {user?.role === "user" && contact.owner.toString() === user._id.toString() &&
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <TooltipWrapper tooltipText="Update">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => {
                                                    handleSelectedContact(contact);
                                                    setAddEditModalOpen(true);
                                                }}
                                            >
                                                <Edit className="w-5 h-5 text-blue-500" />
                                            </Button>
                                        </TooltipWrapper>

                                        <TooltipWrapper tooltipText="Delete Contact">
                                            <Button size="icon" variant="destructive" onClick={() => handleDelete(contact._id)}>
                                                <Trash2 className="w-5 h-5 " />
                                            </Button>
                                        </TooltipWrapper>


                                    </TableCell>
                                }
                                {user?.role === "user" && contact.owner.toString() !== user._id.toString() &&
                                    <TableCell className="text-right flex justify-end gap-2" >
                                        <Badge variant="outline" className="ml-2">
                                            Shared
                                        </Badge>
                                    </TableCell>
                                }
                                {user?.role !== "user" &&
                                    <TableCell className="text-right flex justify-end gap-2"> <ShareContactDropdown sharedUsers={contact.sharedUsers} contactId={contact._id} userId={userId} /></TableCell>
                                }

                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-4">
                                No contacts found!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>

            </Table>

            <ConfirmationDialog
                isOpen={modalData.isOpen}
                onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={modalData.action}
                title={modalData.title}
                description={modalData.description}
                confirmText={modalData.confirmText}
                confirmVariant={modalData.confirmVariant}
            />


            {selectedContact ? (
                <ContactModal
                    userId={userId}
                    contact={selectedContact}
                    onClose={() => {
                        setAddEditModalOpen(false)

                    }}
                    isOpen={isAddEditModalOpen} mode={"edit"} />

            ) : (
                <ContactModal
                    isOpen={isAddEditModalOpen}
                    onClose={() => {
                        setAddEditModalOpen(false);
                    }} mode="add" userId={userId} />
            )}
        </div>
    );
}
