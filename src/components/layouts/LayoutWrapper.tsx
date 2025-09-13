"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // daftar halaman yang tidak butuh sidebar & navbar
  const noLayoutPages = ["/login"];
  const isNoLayout = noLayoutPages.includes(pathname);

  // state untuk sidebar (expand / collapse)
  const [isActive, setIsActive] = useState(true);

  if (isNoLayout) {
    return <>{children}</>; // langsung render tanpa sidebar/navbar
  }

  return (
    <div className="flex">
      <Sidebar isActive={isActive} setIsActive={setIsActive} />
      <div className="flex-1 flex flex-col">
        <Navbar isActive={isActive} setIsActive={setIsActive} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
