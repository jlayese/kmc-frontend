"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/context/auth-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading, setToken, setUser, checkToken } = useAuthStore();
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkToken();
      }, [checkToken]);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));

        setAuthChecked(true);
    }, [setToken, setUser]);

    useEffect(() => {
        if (!authChecked || loading) return;

        if (!user) {
            router.replace("/auth/signin");
            return;
        }

        const correctPath = user.role === "admin" || user.role === "super-admin"
            ? "/dashboard/admin"
            : "/dashboard/user";

        if (!pathname.startsWith(correctPath)) {
            router.replace(correctPath);
        }
    }, [authChecked, loading, user, router, pathname]);

    // Prevent layout from rendering until auth check is done
    if (!authChecked || loading || !user) {
        return <div className="flex h-screen justify-center items-center">Loading...</div>;
    }

    return (

        <div className="w-full md:max-w-[80%] mx-auto p-4">

            {children}

        </div>
    );
}
