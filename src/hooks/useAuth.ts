import { useEffect, useState } from "react";
import { getToken } from "@/lib/token";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  name: string;
  role: string;
  nim: string;
  major: string;
  status: string;
  device_id?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        interface JwtPayload {
          id: string;
          name: string;
          role: string;
          nim: string;
          major: string;
          status: string;
          device_id?: string;
          [key: string]: unknown;
        }
        const decoded = jwtDecode<JwtPayload>(token);
        let device_id = undefined;
        if (typeof window !== 'undefined') {
          const userData = localStorage.getItem('user');
          if (userData) {
            try {
              const parsed = JSON.parse(userData);
              device_id = parsed.device_id;
            } catch {}
          }
        }
        setUser({
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          nim: decoded.nim,
          major: decoded.major,
          status: decoded.status,
          device_id: device_id || decoded.device_id,
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return { user };
}
