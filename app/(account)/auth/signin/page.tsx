"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/auth-store";

export default function SignIn() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === "admin" || user.role === "super-admin"
          ? "/dashboard/admin"
          : "/dashboard/user";
      router.replace(redirectPath);
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(email, password);
    setLoading(false);

    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Admin Credentials Note */}
          <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm text-gray-700">
            <p className="font-semibold">For Admin Use:</p>
            <p>Email: <span className="font-mono">admin@gmail.com</span></p>
            <p>Password: <span className="font-mono">mypassword123</span></p>
          </div>

          <div className="mt-8 flex flex-wrap justify-between text-sm">
            <span className="mb-2 sm:mb-0">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-blue-500 hover:underline">
                Sign Up
              </Link>
            </span>
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
