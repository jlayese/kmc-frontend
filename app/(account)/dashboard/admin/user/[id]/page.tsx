"use client";

import UserDetailsPage from "@/components/dashboard/admin/user-details";
import { useParams } from "next/navigation";

export default function AdminDashboard() {
  const params = useParams(); 
  const userId = params?.id as string;

  return (
    <div className="flex flex-col">
      <UserDetailsPage userId={userId} />
    </div>
  );
}
