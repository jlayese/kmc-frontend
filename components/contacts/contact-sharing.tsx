"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContactStore } from "@/context/contact-store";

export function ShareContactDropdown({ sharedUsers, contactId, userId }: { sharedUsers: string[], contactId: string, userId: string }) {
    const { relativeUsers, shareContact, unshareContact } = useContactStore();

    const onShare = async (contactId: string, targetUserId: string) => {
        await shareContact(contactId, targetUserId, userId);
    };

    const onUnshare = async (contactId: string, targetUserId: string) => {
        await unshareContact(contactId, targetUserId, userId);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Share</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Share Contact</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {relativeUsers.length > 0 ? (
                    relativeUsers.map((u) => (
                        <DropdownMenuCheckboxItem
                            key={u._id}
                            checked={sharedUsers.includes(u._id)}
                            onCheckedChange={(checked) =>
                                checked
                                    ? onShare(contactId, u._id)
                                    : onUnshare(contactId, u._id)
                            }
                        >
                            {u.firstName} {u.lastName}
                        </DropdownMenuCheckboxItem>
                    ))
                ) : (
                    <p className="text-center text-gray-500 p-2">No users available</p>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
