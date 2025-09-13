"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/config/menu";

interface SidebarProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isActive, setIsActive }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-[#2080D9] transition-all duration-300 ease-in-out z-50 
        ${isActive ? "w-[270px] py-10" : "w-[60px] py-5"}`}
    >
      <div className="flex flex-col relative h-full">
        <div className="flex flex-col gap-5 mb-10">
          <Image
            src={isActive ? "/logo/logo.png" : "/logo/logoCL.png"}
            alt="logo"
            width={isActive ? 180 : 30}
            height={0}
            className="self-center"
          />
          <hr className="opacity-50 border" />
        </div>

        <div className="flex flex-col gap-2 items-center h-full overflow-y-auto scrollbar-none">
          {menuItems.map(({ title, icon: Icon, route }, index) => {
            const isMenuActive = pathname === route;
            return (
              <Link href={route} key={index}>
                <div
                  className={`flex text-white items-center gap-2 transition-opacity duration-300 
                    ${isActive ? "w-56 px-2.5 py-3" : "w-fit p-2"} 
                    ${isMenuActive ? "opacity-100 bg-[#559DE1] rounded-md" : "opacity-50"}`}
                >
                  <Icon size={isActive ? 23 : 20} />
                  {isActive && <p className="font-semibold text-lg">{title}</p>}
                </div>
              </Link>
            );
          })}
        </div>

        {isActive && (
          <div className="text-center text-white mt-4 ">
            <p>Divisi UNIKOM</p>
            <p>CodeLabs @ 2025</p>
          </div>
        )}
      </div>

      <Button
        variant="default"
        className="absolute bottom-5 -right-5"
        onClick={() => setIsActive(!isActive)}
      >
        <MdArrowBackIos
          size={20}
          className={`transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
        />
      </Button>
    </div>
  );
};

export default Sidebar;
