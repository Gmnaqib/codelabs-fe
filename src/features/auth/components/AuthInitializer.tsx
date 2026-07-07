"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/shared/state";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().hydrateFromToken();
  }, []);

  return <>{children}</>;
}
