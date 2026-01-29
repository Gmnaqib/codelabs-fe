"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover"
import { CalendarDaysIcon } from "@heroicons/react/24/solid"

interface CalendarMonthYearPickerProps {
  className?: string
  onChange?: (value: { year: number; month: number }) => void
  defaultYear?: number
  defaultMonth?: number
}

export function CalendarMonthYearPicker({
  className,
  onChange,
  defaultYear,
  defaultMonth,
}: CalendarMonthYearPickerProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const [view, setView] = React.useState<"year" | "month">("year")
  const [selectedYear, setSelectedYear] = React.useState(defaultYear || currentYear)
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(defaultMonth ?? currentMonth)
  const [yearRangeStart, setYearRangeStart] = React.useState(
    Math.floor((selectedYear - 1) / 12) * 12 + 1
  )
  const [open, setOpen] = React.useState(false)

  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const monthsFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i)

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setView("month")
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    onChange?.({ year: selectedYear, month: monthIndex })
    setOpen(false) 
  }

  const prevRange = () => setYearRangeStart(yearRangeStart - 12)
  const nextRange = () => setYearRangeStart(yearRangeStart + 12)

  const displayLabel =
    selectedMonth !== null
      ? `${monthsFull[selectedMonth]} ${selectedYear}`
      : `${selectedYear}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-fit items-center gap-5 justify-between border border-muted-foreground rounded-full px-6 py-2 bg-white">
        <span>{displayLabel}</span>
        <CalendarDaysIcon className="size-5" />
      </PopoverTrigger>

      <PopoverContent>
        <div
          className={cn(
            "w-[260px] rounded-lg border bg-popover p-3 shadow-sm mt-2",
            className
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (view === "month") setView("year")
                else prevRange()
              }}
              className="size-8"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <div className="text-sm font-medium select-none">
              {view === "year"
                ? `${years[0]} - ${years[years.length - 1]}`
                : selectedYear}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (view === "year") nextRange()
              }}
              className={cn("size-8", view === "month" && "invisible")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {view === "year" ? (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={year === selectedYear ? "default" : "ghost"}
                  className={cn(
                    "w-full py-2 text-sm",
                    year === selectedYear && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {monthsShort.map((month, i) => (
                <Button
                  key={month}
                  variant={i === selectedMonth ? "default" : "ghost"}
                  className={cn(
                    "w-full py-2 text-sm",
                    i === selectedMonth && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMonthSelect(i)}
                >
                  {month}
                </Button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
