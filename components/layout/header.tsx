"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/context/auth-store";

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();


  const handleLogout = async () => {
    await logout();
    router.push("/auth/signin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div>
            <Link href={user?.role === "user" ? "/dashboard/user" : "/dashboard/admin"} className="font-bold text-xl">
              Test App
            </Link>
          </div>

          {/* User Dropdown */}
          <div className="flex items-center gap-2">
            {user && <span className="text-sm font-medium">{user.firstName}</span>}

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={5} className="z-[60]">
                {!user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={user?.role === "user" ? "/dashboard/user" : "/dashboard/admin"}>Dashboard</Link>
                    </DropdownMenuItem>
                   
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
