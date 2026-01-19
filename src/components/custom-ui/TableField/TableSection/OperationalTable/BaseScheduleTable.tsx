"use client";
import React from "react";
import { isIndonesianHoliday } from "@/utils/indonesianHolidays";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BaseScheduleTableProps = {
  leftHeaders: string[];
  headerKeyMap?: Record<string, string>;
  daysArray: Array<number | string>;
  data: any[];
  isPiket?: boolean;
  renderLeftCell?: (row: any, header: string, rowIndex: number) => React.ReactNode;
  renderCell: (day: number | string, rowIndex: number, data: any[], context?: any) => React.ReactNode;
  renderTotal?: (row: any, rowIndex: number) => React.ReactNode;
};

const BaseScheduleTable = ({
  leftHeaders,
  headerKeyMap = {},
  daysArray,
  data,
  isPiket = false,
  renderLeftCell,
  renderCell,
  renderTotal,
}: BaseScheduleTableProps) => {
  return (
    <div className="relative max-h-[600px] overflow-y-auto">
      <div className="flex">
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                {leftHeaders.map((h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} className="h-[48px]">
                  {leftHeaders.map((h, j) => {
                    if (renderLeftCell) return (
                      <TableCell key={j}>{renderLeftCell(row, h, i)}</TableCell>
                    );
                    const key = headerKeyMap[h] || h.toLowerCase();
                    let value = row[key] ?? "-";
                    if (h === "Nama" && typeof value === "string") {
                      value = value.split(" ")[0];
                    }
                    return <TableCell key={j}>{value}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className={isPiket ? "overflow-x-auto flex-1" : "overflow-x-auto max-w-[900px]"}>
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day) => {
                  let month = undefined;
                  let year = undefined;
                  if (data && data.length > 0 && data[0].records && data[0].records.length > 0) {
                    const d = data[0].records[0].start_date ? new Date(data[0].records[0].start_date) : (data[0].records[0].checkIn ? new Date(data[0].records[0].checkIn) : (data[0].records[0].createdAt ? new Date(data[0].records[0].createdAt) : new Date()));
                    month = d.getMonth();
                    year = d.getFullYear();
                  } else {
                    const now = new Date();
                    month = now.getMonth();
                    year = now.getFullYear();
                  }
                  const currentDate = new Date(year, month, Number(day));
                  let isRed = false;
                  if (!isPiket) {
                    const isSunday = currentDate.getDay() === 0;
                    const isHoliday = isIndonesianHoliday(currentDate);
                    isRed = isSunday || isHoliday;
                  }
                  return (
                    <TableHead
                      key={day}
                      className={`text-center w-[115px] min-w-[115px]${isRed ? ' bg-red-500 text-white' : ''}`}
                    >
                      {day}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i} className="h-[48px]">
                  {daysArray.map((day) => {
                    let month = undefined;
                    let year = undefined;
                    if (data && data.length > 0 && data[0].records && data[0].records.length > 0) {
                      const d = data[0].records[0].start_date ? new Date(data[0].records[0].start_date) : (data[0].records[0].checkIn ? new Date(data[0].records[0].checkIn) : (data[0].records[0].createdAt ? new Date(data[0].records[0].createdAt) : new Date()));
                      month = d.getMonth();
                      year = d.getFullYear();
                    } else {
                      const now = new Date();
                      month = now.getMonth();
                      year = now.getFullYear();
                    }
                    const currentDate = new Date(year, month, Number(day));
                    let skipCell = false;
                    if (!isPiket) {
                      const isSunday = currentDate.getDay() === 0;
                      const isHoliday = isIndonesianHoliday(currentDate);
                      skipCell = isSunday || isHoliday;
                    }
                    return (
                      <TableCell key={String(day)} className="text-center w-[115px] min-w-[115px]">
                        <div className="flex items-center justify-center h-full">
                          {skipCell ? null : renderCell(day, i, data, { daysArray })}
                        </div>
                      </TableCell>
                    );
                  })}
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
              {data.map((row, i) => (
                <TableRow key={i} className="h-[48px]">
                  <TableCell className="text-center">
                    {renderTotal ? renderTotal(row, i) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BaseScheduleTable;
