"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuthStore } from "@/context/auth-provider"

export default function Header() {
  const { user } = useAuthStore()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between h-16 gap-4">
          <div>
            <Link href="/" className="font-bold text-xl">
              Test App
            </Link>
          </div>

          <div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" alignOffset={5} className="z-[60]">
                {!user ? (
                  <>
                    <DropdownMenuItem>
                      <Link href="/auth/signin">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/auth/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/seller/dashboard">Seller Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
