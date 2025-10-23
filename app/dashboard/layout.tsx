"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/context/userContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth/login");
      } else if (!user.isVerified) {
        router.replace("/auth/verify-email");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!user || !user.isVerified) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-50">{children}</div>
    </div>
  );
}
