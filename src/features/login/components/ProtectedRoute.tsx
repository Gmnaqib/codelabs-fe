
"use client";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }
      } catch (e) {
        // Token tidak valid
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  return <>{children}</>;
}
