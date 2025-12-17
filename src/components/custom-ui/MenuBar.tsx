"use client"
import {
  Menubar as MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { MenuBarProps } from "@/types/MenubarProps"
import { DropdownField } from "./DropdownField"

export function Menubar({ menus, onChange, activeMenu, sort = false }: MenuBarProps) {
  return (
    <div className="flex justify-between">
      <MenubarRoot className="gap-0">
        {menus.map((menu, index, arr) => {
          const isActive = activeMenu === menu
          return (
              <MenubarMenu key={menu}>
                <MenubarTrigger
                  onClick={() => onChange?.(menu)}
                  index={index}
                  totalMenus={arr.length}
                  className={cn(
                  "p-3 font-medium mb-5",
                  isActive ? "text-primary border-b-2 border-primary" : "text-neutral hover:bg-secondary hover:text-black"
                )}
                >
                  {menu}
                </MenubarTrigger>
              </MenubarMenu>
          )
        })}
      </MenubarRoot>
      {sort && (
        <div className="flex items-center gap-3 mb-5">
          <p>Sort By:</p>
          <DropdownField
            title="Highest"
            menu={["Highest", "Lowest", ""]}
            blue
          />
        </div>
      )}
    </div>
  )
}
