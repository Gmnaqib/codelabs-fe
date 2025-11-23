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
import { competition } from "../headerConfig";
import DialogField from "../../DialogField";
import { Pagination } from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";

interface CompetitionTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  researchData?: Record<string, any>[];
}

const CompetitionTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  researchData = [],
}: CompetitionTableProps) => {
  const competitionKey = Object.keys(competition)[0];
  const competitionHeaders = competition[competitionKey] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(competition)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <Table className="w-full table-fixed">
            <TableHeader>
            <TableRow>
                {competitionHeaders.map((header, i) => (
                <TableHead key={i}>{header}</TableHead>
                ))}
            </TableRow>
            </TableHeader>

            <TableBody>
            {researchData.length > 0 ? (
                researchData.map((item, i) => (
                <TableRow key={i}>
                    <TableCell className="text-center">halo123</TableCell>
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
                    colSpan={competitionHeaders.length}
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

export default CompetitionTable;
