"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noLayoutPages = ["/login"];
  const isNoLayout = noLayoutPages.includes(pathname);

  const [isActive, setIsActive] = useState(true);

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
