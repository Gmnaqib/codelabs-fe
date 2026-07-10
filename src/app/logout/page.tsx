"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/state";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    useAuthStore.getState().logout();
    router.replace("/login");
  }, [router]);

  return null;
}
