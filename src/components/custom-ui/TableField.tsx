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

interface TableFieldProps {
  headers: string[]
  month?: number
  year?: number
  data?: Record<string, string>[]
  visibleDays?: number
  activePage: string                // dari parent
  onPageChange: (menu: string) => void // callback ke parent
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
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

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

        <div className="overflow-x-auto max-w-[1030px]">
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day) => (
                  <TableHead key={day} className="w-[115px] min-w-[115px]">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i}>
                  {daysArray.map((day) => (
                    <TableCell
                      key={day}
                      className="w-[115px] min-w-[115px] text-center"
                    >
                      -
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
