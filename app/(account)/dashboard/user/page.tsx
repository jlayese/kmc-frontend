"use client";

import UserDetailsPage from "@/components/dashboard/admin/user-details";
import { useAuthStore } from "@/context/auth-store";

export default function UserDashboard() {
  const { user } = useAuthStore();
  console.log(user)
  if (!user) {
    return;
  }

  return (
    <div className="flex flex-col">
      <UserDetailsPage userId={user?._id} />
    </div>
  );
}
