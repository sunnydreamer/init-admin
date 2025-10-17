"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/fireabse";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        router.replace("/dashboard/coaches");
      } else {
        // User is not logged in
        router.replace("/auth/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <div>Checking authentication...</div>;
}
