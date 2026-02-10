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
import { updateUser } from "@/services/users/userService";

interface MembersItem {
  _id: string;
  nim?: string;
  name?: string;
  email?: string;
  subriset?: string;
  role?: string;
  status?: string;
  change_device_id?: string;
}

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: MembersItem[];
}

const MembersTable = ({
  activePage,
  data = [],
}: Props) => {
  const headers = members[activePage] || [];

  const handleUpdate = async (id: string, key: string, value: string) => {
    try {
      const member = data.find((m) => m._id === id);
      if (!member) throw new Error("Member not found");

      const safePayload = {
        name: member.name ?? "",
        email: member.email ?? "",
        ...member,
        [key]: value.toLowerCase(),
      };

      await updateUser(id, safePayload);
    } catch (err) {
      console.error(`❌ Gagal update ${key}:`, err);
    }
  };

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
                data.map((item, i) => {
                  console.log(item);
                  return (
                  <TableRow key={i}>
                    <TableCell className="w-[120px] break-words">
                      {item.nim}
                    </TableCell>

                    <TableCell className="w-[180px] break-words">
                      {item.name?.split(" ")[0]}
                    </TableCell>

                    <TableCell className="w-[260px] whitespace-normal break-words">
                      {item.email}
                    </TableCell>

                    <TableCell className="w-[150px]">
                      <DropdownField
                        title={item.subriset}
                        menu={["Website", "Mobile", "Game", "UI/UX", "Data", "Other"]}
                        onSelect={(val: string) =>
                          handleUpdate(item._id, "research", val)
                        }
                      />
                    </TableCell>

                    <TableCell className="w-[150px]">
                      <DropdownField
                        title="Agrimate"
                        menu={["Agrimate", "Splace Classroom", "Snaily", "Other"]}
                      />
                    </TableCell>

                    <TableCell className="w-[200px]">
                      <DropdownField
                        title={
                            item.role && item.role.length > 15
                            ? item.role.slice(0, 14) + "..."
                            : item.role
                        }
                        menu={[
                          "Admin",
                          "Lecturer",
                          "President",
                          "Vice President",
                          "Minister of Research",
                          "Minister of Competition",
                          "Minister of Branding",
                          "Minister of Operation",
                          "User",
                        ]}
                        onSelect={(val: string) =>
                          handleUpdate(item._id, "role", val)
                        }
                      />
                    </TableCell>

                    <TableCell className="w-[150px]">
                      <DropdownField
                        title={
                          String(item.change_device_id) === "true"
                            ? "Enabled"
                            : String(item.change_device_id) === "false"
                            ? "Disabled"
                            : "Not Set"
                        }
                        menu={["Disabled", "Enabled"]}
                        onSelect={(val: string) =>
                          handleUpdate(
                            item._id,
                            "change_device_id",
                            val === "Enabled" ? "true" : "false"
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <DropdownField
                        title={item.status }
                        menu={["Active", "Inactive", "Graduated"]}
                        onSelect={(val: string) =>
                          handleUpdate(item._id, "status", val)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
                })
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
