import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Menubar } from "./MenuBar"
import { Checkbox } from "../ui/checkbox"

interface TableFieldProps {
  headers: string[]
  month?: number
  year?: number
  data?: Record<string, string>[]
  visibleDays?: number
  activePage: string
  onPageChange: (menu: string) => void
}

const TableField = ({
  headers,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  data = [
    { NIM: "23001", Nama: "Ramdani" },
    { NIM: "23002", Nama: "Tes" },
  ],
  visibleDays = 7,
  activePage,
  onPageChange,
}: TableFieldProps) => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const isPiket = activePage === "Piket"

  const daysArray = isPiket
    ? Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`)
    : Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const renderCellContent = (page: string, day: string | number, rowIndex: number) => {
    switch (page) {
      case "Absensi":
        return "-"
      case "Tematik":
      case "Piket":
        return <Checkbox />
      default:
        return "-"
    }
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Menubar
        menus={["Absensi", "Tematik", "Piket"]}
        activeMenu={activePage}
        onChange={onPageChange}
      />

      <div className="flex">
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header, j) => (
                    <TableCell key={j}>{row[header] ?? "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="overflow-x-auto max-w-[968px]">
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day, index) => (
                  <TableHead key={index} className={`text-center ${activePage === "Piket" ? "" : "w-[115px] min-w-[115px]"}`}>
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i}>
                  {daysArray.map((day, index) => (
                    <TableCell
                      key={index}
                      className={`text-center ${
                        activePage === "Piket" ? "" : "w-[115px] min-w-[115px]"
                      }`}
                    >
                      {renderCellContent(activePage, day, i)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">0</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default TableField
