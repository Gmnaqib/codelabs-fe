"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { organization } from "../headerConfig";

interface OrganizationTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: any[];
}

const OrganizationSummaryTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: OrganizationTableProps) => {
  const organizationHeaders = organization[activePage] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar menus={Object.keys(organization)} activeMenu={activePage} onChange={onPageChange} />
      )}

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {organizationHeaders.map((header, i) => (
              <TableHead key={i}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {organizationHeaders.map((header, j) => (
                <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizationSummaryTable;
