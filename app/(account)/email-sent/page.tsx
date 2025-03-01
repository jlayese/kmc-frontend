"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EmailSent() {

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Check Your Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        If an account with that email exists, you will receive a password reset link shortly.
                        Please check your inbox and spam folder.
                    </p>

                    <Link href="/auth/signin" className="text-blue-500 hover:underline">
                        Back to Sign In
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
