"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import { DropdownField } from "@/components/custom-ui/DropdownField";
import { members } from "@/components/custom-ui/TableField/headerConfig";
import DialogField from "@/components/custom-ui/DialogField";

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: any[];
}

const MembersTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  data = [],
}: Props) => {
  const headers = members[activePage] || [];

  return (
    <div className="w-full">
      <Card className="w-full rounded-lg shadow-sm">
        <div className="w-full px-5">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                {headers.map((h, i) => (
                  <TableHead key={i}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length > 0 ? (
                data.map((item: any, i) => (
                  <TableRow key={i}>

                    {/* NIM */}
                    <TableCell className="w-[120px] whitespace-normal break-words">
                      {item.nim}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="w-[180px] whitespace-normal break-words">
                      {item.name}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="w-[260px] whitespace-normal break-words">
                      {item.email}
                    </TableCell>

                    {/* SUB RISET */}
                    <TableCell className="w-[150px]">
                        <DropdownField
                            title={item.subriset || "Other"}
                            menu={["UI/UX", "Mobile", "IOT", "Web", "Game", "Data", "Other"]}
                        />
                    </TableCell>

                    {/* ROLE */}
                    <TableCell className="w-[200px]">
                        <DropdownField
                        title={
                            item.role && item.role.length > 15
                            ? item.role.slice(0, 12) + "..."
                            : item.role || "User"
                        }
                        menu={[
                            "Lecturer",
                            "Admin",
                            "User",
                            "Minister of Operational",
                            "Minister of Research",
                            "Minister of Research and Operational",
                            "Minister of and Branding",
                            "Minister of Competition",
                            "Minister of Branding",
                            "President",
                            "Vice President",
                            "Other",
                        ]}
                        />
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="w-[150px]">
                      <DropdownField
                        title={item.status || "Active"}
                        menu={["Active", "Inactive", "Graduated"]}
                      />
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length}
                    className="text-center py-5"
                  >
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

export default MembersTable;
