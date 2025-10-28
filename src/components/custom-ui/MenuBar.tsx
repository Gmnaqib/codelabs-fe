"use client"
import {
  Menubar as MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { MenuBarProps } from "@/types/MenubarProps"

export function Menubar({ menus, onChange, activeMenu }: MenuBarProps) {
  return (
    <div>
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
                "p-3 font-semibold border transition-colors",
                isActive ? "bg-primary text-white border-primary" : "text-muted-foreground border-muted-foreground"
              )}
              >
                {menu}
              </MenubarTrigger>
            </MenubarMenu>
          )
        })}
      </MenubarRoot>
    </div>
  )
}
