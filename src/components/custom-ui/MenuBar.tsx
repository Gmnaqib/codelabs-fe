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
import OperationalAttendance from "@/features/operational/components/OperationalAttendance "
import { Button } from "@/components/ui/button"
import { RiFileExcel2Line } from "react-icons/ri"

export function Menubar({ menus, onChange, activeMenu, sort = false, filter, operational = false, search = true, filterProps, searchQuery = "", onSearch, onExportExcel }: MenuBarProps & { filterProps?: React.ComponentProps<typeof CalendarMonthYearPicker>, searchQuery?: string, onSearch?: (query: string) => void }) {
  const [internalSearch, setInternalSearch] = useState(searchQuery ?? "");
  return (
    <div className="flex flex-col items-center lg:items-baseline lg:justify-between mt-1 lg:w-full lg:flex-row">
      <MenubarRoot className="grid grid-cols-2 sm:grid-cols-4 lg:gap-0">
        {menus.map((menu) => {
          const isActive = activeMenu === menu;
          return (
            <MenubarMenu key={menu} >
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

      <div className="flex gap-5 items-center">
        {filter && (
          <div className="flex gap-5 z-25">
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
            <div className="z-40 mt-5 lg:mt-0">
              <CalendarMonthYearPicker
                {...filterProps}
              />
            </div>
          </div>
        )}

        {operational && (
          <OperationalAttendance />
        )}
        {onExportExcel && (
          <Button size="sm" onClick={onExportExcel} className="flex items-center gap-2 bg-green-600 hover:border-green-600">
            <RiFileExcel2Line className="text-white text-lg hover:text-green-600" />
          </Button>
        )}
      </div>

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
