"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { attendance } from "../headerConfig";

interface AttendanceTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: any[];
}

const AttendanceTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: AttendanceTableProps) => {
  const attendanceHeaders = attendance[activePage] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar menus={Object.keys(attendance)} activeMenu={activePage} onChange={onPageChange} />
      )}

      <div className="flex items-center w-full px-3 gap-3 bg-white pt-5">
        <p className="font-bold text-xl">Today</p>
        <p className="text-primary font-bold text-sm cursor-pointer">Hide</p>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {attendanceHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {attendanceHeaders.map((header, j) => (
                <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
