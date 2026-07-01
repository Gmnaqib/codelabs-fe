"use client";

import React from "react";
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
import { getMe, updateUser } from "@/services/users/userService";

interface MembersItem {
  _id: string;
  nim?: string;
  name?: string;
  email?: string;
  subriset?: string;
  role?: string;
  status?: string;
  change_mac_address?: boolean;
  product_id?: string;
}

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: MembersItem[];
  filterRole?: string;
  filterSubriset?: string;
  filterStatus?: string;
}

import { useEffect, useState } from "react";
import { getProducts } from "@/services/product/productsService";
import { toast } from "sonner";

const MembersTable = ({
  activePage,
  data = [],
  filterRole = "All Role",
  filterSubriset = "All SubRiset",
  filterStatus = "All Status",
}: Props) => {
  const headers = members[activePage] || [];
  const [products, setProducts] = useState<{ _id: string; name: string }[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getProducts().then((res) => {
      setProducts(Array.isArray(res) ? res : []);
    });
  }, []);

  useEffect(() => {
      const fetchMe = async () => {
        try {
          const me = await getMe();
          setRole(me.role);
        } catch {
          setRole(null);
        }
      };
      fetchMe();
    }, []);

  const handleUpdate = async (id: string, key: string, value: string) => {
    try {
      const member = data.find((m) => m._id === id);
      if (!member) throw new Error("Member not found");

      const parsedValue: string | boolean = key === "change_mac_address"
        ? value === "true"
        : value.toLowerCase();

      const safePayload = {
        name: member.name ?? "",
        email: member.email ?? "",
        ...member,
        [key]: parsedValue,
      };

      await updateUser(id, safePayload);
      toast.success(`Successfully updated ${key}`);
    } catch {
      toast.error(`Failed to update ${key}`);
    }
  };

  const filteredData = data
    .filter((u) => {
      if (!role) return false;
      const userRole = (u.role || "").toLowerCase();
      if (role.toLowerCase() !== "admin" && ["admin", "lecturer"].includes(userRole)) {
        return false;
      }
      return filterRole === "All Role" ? true : u.role === filterRole;
    })
    .filter((u) =>
      filterSubriset === "All SubRiset" ? true : u.subriset === filterSubriset
    )
    .filter((u) =>
      filterStatus === "All Status" ? true : u.status === filterStatus
    );


  return (
    <div className="w-full">
        <div className="w-full">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                {headers.map((h, i) => (
                  <TableHead key={i} className="w-40 lg:w-full">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
                {filteredData.length > 0 ? (
                filteredData.map((item, i) => {
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
                        key={`subriset-${item._id}`}
                        title={item.subriset}
                        menu={["Website", "Mobile", "Game", "UI/UX", "Data", "Other"]}
                        onSelect={(val: string) =>
                          handleUpdate(item._id, "research", val)
                        }
                      />
                    </TableCell>

                    <TableCell className="w-[150px]">
                      {(() => {
                        let dropdownTitle = "Other";
                        if (item.product_id && products.length > 0) {
                          const pid = String(item.product_id).toLowerCase();
                          const found = products.find((p) => String(p._id).toLowerCase() === pid);
                          dropdownTitle = found ? found.name.split(' ')[0] : "Other";
                        }
                        return (
                          <DropdownField
                            key={`product-${item._id}`}
                            title={dropdownTitle}
                            menu={products.map((p) => p.name).concat(["Other"])}
                            onSelect={(val: string) => {
                              const selectedProduct = products.find((p) => p.name === val);
                              handleUpdate(item._id, "product_id", selectedProduct ? selectedProduct._id : "");
                            }}
                          />
                        );
                      })()}
                    </TableCell>

                    <TableCell className="w-[200px]">
                      <DropdownField
                        key={`role-${item._id}`}
                        title={(() => {
                          const roleMap: Record<string, string> = {
                            // "vice president": "vice",
                            "minister of research": "research",
                            "minister of competition": "competition",
                            "minister of branding": "branding",
                            "minister of operation": "operation"
                          };
                          if (!item.role) return "";
                          return roleMap[item.role] || item.role.toLowerCase();
                        })()}
                        menu={[
                          ...(role === "admin" ? ["Admin"] : []),
                          "Lecturer",
                          "President",
                          // "Vice President",
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
                        key={`deviceid-${item._id}`}
                        title={item.change_mac_address ? "Enabled" : "Disabled"}
                        menu={["Disabled", "Enabled"]}
                        onSelect={(val: string) =>
                          handleUpdate(
                            item._id,
                            "change_mac_address",
                            val === "Enabled" ? "true" : "false"
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="w-[150px]">
                      <DropdownField
                        key={`status-${item._id}`}
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
    </div>
  );
};

export default MembersTable;
