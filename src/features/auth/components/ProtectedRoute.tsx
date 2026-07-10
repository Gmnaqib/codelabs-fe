"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/shared/state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const hasRole = useAuthStore((s) => s.hasRole);

  useEffect(() => {
    useAuthStore.getState().hydrateFromToken();
  }, []);

  useEffect(() => {
    if (initialized && !user) {
      router.replace('/login');
      return;
    }
    if (roles && user && !hasRole(roles)) {
      router.replace('/');
    }
  }, [initialized, user, roles, hasRole, router]);

  if (!initialized) return null;

  return <>{children}</>;
}
