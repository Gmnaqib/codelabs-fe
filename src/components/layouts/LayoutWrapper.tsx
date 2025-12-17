"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayoutPages = ["/login"];
  const isNoLayout = noLayoutPages.includes(pathname);
  const [isActive, setIsActive] = useState(true);
  const isXl = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    setIsActive(isXl);
  }, [isXl]);
  
  if (isNoLayout) {
    return <>{children}</>; 
  }

  return (
    <div className="flex h-screen overflow-y-scroll scrollbar-hide overscroll-none">
      <Sidebar isActive={isActive} setIsActive={setIsActive} />
      <div className="flex-1">
        <Navbar isActive={isActive} setIsActive={setIsActive} />
        <div className={`p-5 mt-20 transition-all duration-300 ease-in-out ${isActive ? 'ml-[270px]' : 'ml-[60px]'}`}>{children}</div>
      </div>
    </div>
  );
}
