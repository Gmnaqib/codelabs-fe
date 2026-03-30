"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/config/menu";
import { useEffect, useState } from "react";
import { getMe } from "@/services/users/userService";
import type { UserType } from "@/types/user";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

interface SidebarProps {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isActive, setIsActive }: SidebarProps) => {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((res) => {
      setUser(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (!user) return null;

  const filteredMenu = menuItems.filter(item => !item.roles || item.roles.includes(user.role));

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-primary transition-all duration-300 ease-in-out z-50 
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
          {filteredMenu.map(({ title,  iconSolid: IconSolid, iconOutline: IconOutline, route }, index) => {
            const isMenuActive = pathname === route;
            const Icon = isMenuActive ? IconSolid : IconOutline;

            return (
              <Link href={route} key={index}>
                <div
                  className={`flex text-white items-center gap-2 transition-opacity duration-300 
                    ${isActive ? "w-56 px-2.5 py-3" : "w-fit p-2"} 
                    ${isMenuActive ? "opacity-100 bg-[#559DE1] rounded-sm" : "opacity-50"}`}
                >
                  <Icon className={isActive ? 'size-6' : 'size-5'} />
                  {isActive && <p className="font-normal text-lg">{title}</p>}
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

        <Button
          variant="default"
          className="absolute bottom-5 -right-5"
          onClick={() => setIsActive(!isActive)}
        >
          <ChevronRightIcon
            className={`transition-transform duration-300 size-5 ${isActive ? "rotate-180" : ""}`}
          />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
