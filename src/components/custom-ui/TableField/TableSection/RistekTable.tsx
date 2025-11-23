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
import { ristek } from "../headerConfig";
import DialogField from "../../DialogField";
import { Pagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

interface RistekTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}

const RistekTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  researchData = [],
}: RistekTableProps) => {
  const ristekKey = Object.keys(ristek)[0];
  const ristekHeaders = ristek[ristekKey] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(ristek)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
            <TableHeader>
            <TableRow>
                {ristekHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
                ))}
            </TableRow>
            </TableHeader>

            <TableBody>
            {researchData.length > 0 ? (
                researchData.map((item, i) => (
                <TableRow key={i}>
                    <TableCell className="text-center">halo</TableCell>
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
                    colSpan={ristekHeaders.length}
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

export default RistekTable;
