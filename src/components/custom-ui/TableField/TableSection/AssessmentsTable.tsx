"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "@/components/custom-ui/MenuBar";
import DialogField from "../../DialogField";
import { DropdownField } from "../../DropdownField";
import { members } from "../headerConfig";

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: any[];
}

const AssessmentsTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: Props) => {
  const headers = members[activePage] || [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(members)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <Card>
        <div className="px-5">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length > 0 ? (
                data.map((item: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="text-center">{item.rank ?? "-"}</TableCell>
                    <TableCell className="text-center">
                      {item.name?.split(" ")[0] ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">{item.monthly ?? "-"}</TableCell>

                    <TableCell className="text-center">
                      <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700">
                        {item.status ?? "None"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DialogField
                        name="Detail"
                        title="Assessment Detail"
                        variant="outline"
                        noPadding
                      >
                        <p>{item.detail ?? "No detail available"}</p>
                      </DialogField>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="text-center py-5">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentsTable;
