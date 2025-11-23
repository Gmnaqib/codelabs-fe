"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { branding } from "../headerConfig";
import DialogField from "../../DialogField";
import { Pagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

interface BrandingTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}

const BrandingTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  researchData = [],
}: BrandingTableProps) => {
  const brandingKey = Object.keys(branding)[0];
  const brandingHeaders = branding[brandingKey] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(branding)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
            <TableHeader>
            <TableRow>
                {brandingHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
                ))}
            </TableRow>
            </TableHeader>

            <TableBody>
            {researchData.length > 0 ? (
                researchData.map((item, i) => (
                <TableRow key={i}>
                    <TableCell className="text-center">hal11o123</TableCell>
                    <TableCell className="text-center">halo2</TableCell>
                    <TableCell className="text-center">
                        <DialogField
                        name="Review"
                        title="Detail Plan"
                        >
                            <p>sad</p>
                        </DialogField>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell
                    colSpan={brandingHeaders.length}
                    className="text-center py-6"
                >
                    Tidak ada data research
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BrandingTable;
