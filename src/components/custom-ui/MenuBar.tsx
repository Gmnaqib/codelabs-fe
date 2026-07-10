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
import OperationalAttendance from "@/features/operational/components/OperationalAttendance"
import { Button } from "@/components/ui/button"
import { RiFileExcel2Line } from "react-icons/ri"

export function Menubar({ menus, onChange, activeMenu, sort = false, filter, operational = false, search = true, filterProps, searchQuery = "", onSearch, onExportExcel }: MenuBarProps & { filterProps?: React.ComponentProps<typeof CalendarMonthYearPicker>, searchQuery?: string, onSearch?: (query: string) => void }) {
  const [internalSearch, setInternalSearch] = useState(searchQuery ?? "");
  return (
    <div className="flex flex-col items-center gap-3 lg:items-baseline lg:justify-between lg:gap-0 mt-1 lg:w-full lg:flex-row">
      <MenubarRoot className="flex-wrap justify-center gap-x-1 gap-y-2 lg:flex-nowrap lg:justify-start lg:gap-0">
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

      <div className="flex flex-wrap items-center justify-center gap-3 lg:flex-nowrap lg:justify-end lg:gap-5">
        {filter && (
          <div className="flex flex-wrap items-center justify-center gap-3 z-25 lg:flex-nowrap lg:gap-5">
            {search && (
              <div className="w-40 shrink-0 sm:w-48">
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
              </div>
            )}
            <div className="z-40 shrink-0">
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
          <Button size="sm" onClick={onExportExcel} className="group flex items-center gap-2 bg-green-600 hover:border-green-600">
            <RiFileExcel2Line className="text-lg text-white group-hover:text-green-600" />
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
