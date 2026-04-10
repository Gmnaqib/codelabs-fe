"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getMe } from "@/services/users/userService";
import BottomNavbar from "./BottomNavbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutPages = ["/login"];
  const isNoLayout = noLayoutPages.includes(pathname);
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isXl = useMediaQuery("(min-width: 1280px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    const fetchMe = async () => {
      setLoading(true);
      try {
        const me = await getMe();
        setRole(me.role);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [pathname]);

  useEffect(() => {
    setIsActive(isXl);
  }, [isXl]);

  useEffect(() => {
    setIsActive(isLg);
  }, [isLg]);
  
  if (isNoLayout) {
    return <>{children}</>; 
  }
  return (
    <div className="flex h-screen overflow-y-scroll scrollbar-hide overscroll-none z-50">
      {(role !== 'user' || (role === 'user' && isLg)) && <Sidebar isActive={isActive} setIsActive={setIsActive} />}
      {(role === 'user' && !isLg) && <BottomNavbar />}
      <div className="flex-1">
        <Navbar isActive={isActive} setIsActive={setIsActive} />
        <div className={`p-5 mt-20 transition-all duration-300 ease-in-out ${isActive ? 'ml-[60px] lg:ml-[270px]' : (role === 'user' ? '' : 'ml-[60px]')}`}>{children}</div>
      </div>
    </div>
  );
}
