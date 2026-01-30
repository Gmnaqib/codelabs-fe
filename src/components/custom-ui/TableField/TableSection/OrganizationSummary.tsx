"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { organization } from "../headerConfig";
import { getAllUsers } from "@/services/users/userService";

interface OrganizationUser {
  _id: string;
  name?: string;
}

interface OrganizationTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: OrganizationUser[];
}

const OrganizationSummaryTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: OrganizationTableProps) => {
  const organizationHeaders = organization[activePage] ?? [];
  type OrganizationUser = {
    _id: string;
    name?: string;
  };
  const [users, setUsers] = useState<OrganizationUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(organization)}
          activeMenu={activePage}
          onChange={onPageChange}
          sort
        />
      )}

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {organizationHeaders.map((header, i) => (
              <TableHead key={i} className="text-center">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, i) => (
            <TableRow key={user._id}>
              <TableCell className="text-center">{i + 1}</TableCell>
              <TableCell className="text-center">{user.name}</TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-center">-</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrganizationSummaryTable;
