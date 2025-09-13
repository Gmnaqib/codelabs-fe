"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // daftar halaman yang tidak butuh sidebar & navbar
  const noLayoutPages = ["/login"];
  const isNoLayout = noLayoutPages.includes(pathname);

  if (isNoLayout) {
    return <>{children}</>; // langsung render tanpa sidebar/navbar
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* <Navbar /> */}
        {/* <main className="p-6">{children}</main> */}
      </div>
    </div>
  );
}
