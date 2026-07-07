"use client"
import LoginForm from '@/features/auth/components/LoginForm'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/shared/state'

const Login = () => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    useAuthStore.getState().hydrateFromToken();
  }, []);

  useEffect(() => {
    if (initialized && user) {
      router.replace('/');
    }
  }, [initialized, user, router]);

  if (!initialized || user) return null;

  return (
    <div>
      <LoginForm/>
    </div>
  )
}

export default Login
