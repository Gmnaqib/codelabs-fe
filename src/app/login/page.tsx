"use client"
import LoginForm from '@/features/login/components/LoginForm'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.replace('/');
        return;
      }
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  return (
    <div>
      <LoginForm/>
    </div>
  )
}

export default Login
