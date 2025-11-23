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
import { FaRegCalendar } from "react-icons/fa6"

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

  // Nama singkat untuk tampilan pilihan bulan
  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  // Nama lengkap untuk label tampilan utama
  const monthsFull = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i)

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setView("month")
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    onChange?.({ year: selectedYear, month: monthIndex })
    setOpen(false) // auto close setelah pilih bulan
  }

  const prevRange = () => setYearRangeStart(yearRangeStart - 12)
  const nextRange = () => setYearRangeStart(yearRangeStart + 12)

  // Label tampilan utama
  const displayLabel =
    selectedMonth !== null
      ? `${monthsFull[selectedMonth]} ${selectedYear}`
      : `${selectedYear}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex items-center justify-between border border-muted-foreground rounded-full px-6 py-3 bg-white">
        <span>{displayLabel}</span>
        <FaRegCalendar size={20} />
      </PopoverTrigger>

      <PopoverContent>
        <div
          className={cn(
            "w-[260px] rounded-lg border bg-popover p-3 shadow-sm",
            className
          )}
        >
          {/* Header */}
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

          {/* Grid */}
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
