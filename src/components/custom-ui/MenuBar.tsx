"use client"
import {
  Menubar as MenubarRoot,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { cn } from "@/lib/utils"
import { MenuBarProps } from "@/types/MenubarProps"
import { DropdownField } from "./DropdownField"
import InputField from "./InputField"
import { CalendarMonthYearPicker } from "./CalendarMonthYearPicker"
import { useState } from "react"

export function Menubar({ menus, onChange, activeMenu, sort = false, filter = false, search = true, filterProps, searchQuery = "", onSearch }: MenuBarProps & { filterProps?: React.ComponentProps<typeof CalendarMonthYearPicker>, searchQuery?: string, onSearch?: (query: string) => void }) {
  const [internalSearch, setInternalSearch] = useState(searchQuery ?? "");
  return (
    <div className="flex justify-between mt-1 w-full">
      <MenubarRoot className="gap-0">
        {menus.map((menu) => {
          const isActive = activeMenu === menu;
          return (
            <MenubarMenu key={menu}>
              <MenubarTrigger
                onClick={() => onChange?.(menu)}
                className={cn(
                  "py-2 px-5 font-medium text-sm mb-5",
                  isActive ? "text-primary border-b-2 border-primary" : "text-neutral hover:bg-secondary hover:text-black"
                )}
              >
                {menu}
              </MenubarTrigger>
            </MenubarMenu>
          );
        })}
      </MenubarRoot>

      {filter && (
        <div className="flex gap-5 z-15">
          {search && (
            <InputField
              type="text"
              placeholder="Search"
              value={internalSearch}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                onSearch?.(e.target.value);
              }}
              size="sm"
            />
          )}
          <CalendarMonthYearPicker
            {...filterProps}
          />
        </div>
      )}

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
  );
}
