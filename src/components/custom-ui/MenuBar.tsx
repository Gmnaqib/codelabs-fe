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

export function Menubar({ menus, onChange, activeMenu, sort = false, filter = false }: MenuBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), 
  });
  return (
    <div className="flex justify-between mt-1">
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
                  "py-2 px-5 font-medium text-sm mb-5",
                  isActive ? "text-primary border-b-2 border-primary" : "text-neutral hover:bg-secondary hover:text-black"
                )}
                >
                  {menu}
                </MenubarTrigger>
              </MenubarMenu>
          )
        })}
      </MenubarRoot>

      {filter && (
        <div className="flex gap-5">
          <InputField
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
          <CalendarMonthYearPicker
            onChange={(val) => {
              setSelectedDate(val);
            }}
            defaultYear={selectedDate.year}
            defaultMonth={selectedDate.month}
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
  )
}
