"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { renderCellContent } from "../renderCellContent";

interface OperationalTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  month: number;
  year: number;
  headersConfig: Record<string, string[]>;
  data: any[];
  checkedState: Record<string, boolean>;
  onToggle: (page: string, rowIndex: number, day: string | number) => void;
}

const OperationalTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  month,
  year,
  headersConfig,
  data,
  checkedState,
  onToggle,
}: OperationalTableProps) => {
  const headers = headersConfig[activePage] || [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const isPiket = activePage === "Piket";

  const daysArray = isPiket
    ? Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`)
    : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar menus={Object.keys(headersConfig)} activeMenu={activePage} onChange={onPageChange} />
      )}

      <div className="flex">
        {/* Bagian kiri (NIM, Nama) */}
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header, j) => (
                    <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bagian tengah (Tanggal/Week) */}
        <div className="overflow-x-auto max-w-[960px]">
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day, i) => (
                  <TableHead key={i} className="text-center">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {daysArray.map((day, j) => (
                    <TableCell
                      key={j}
                      className={`text-center ${activePage === "Piket" ? "" : "w-[115px] min-w-[115px]"}`}
                    >
                      {renderCellContent(activePage, day, i, data, checkedState, onToggle)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Bagian kanan (Total) */}
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
  );
};

export default OperationalTable;
