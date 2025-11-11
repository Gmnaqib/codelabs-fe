"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Menubar } from "../../MenuBar";
import { report } from "../headerConfig";

interface ReportTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}

const ReportTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  researchData = [],
}: ReportTableProps) => {
  const reportKey = Object.keys(report)[0];
  const reportHeaders = report[reportKey] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar menus={Object.keys(report)} activeMenu={activePage} onChange={onPageChange} />
      )}

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {reportHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {researchData.length > 0 ? (
            researchData.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="text-center">{item.title}</TableCell>
                <TableCell className="text-center">{`Week ${item.week}`}</TableCell>
                <TableCell className="text-center">{item.progress}</TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-3 justify-center">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      Detail
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={reportHeaders.length} className="text-center py-6">
                Tidak ada data research
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReportTable;
