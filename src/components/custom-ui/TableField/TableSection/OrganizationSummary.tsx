"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { organization } from "../headerConfig";
import { getAllUsers } from "@/services/users/userService";
import { getKPIAllOperational, getKPIAllResearch } from "@/services/kpi/kpiService";


interface OrganizationUser {
  _id: string;
  name?: string;

  }

  interface KPIUser {
    name: string;
    // For Attendance
    totalAttendance?: number;
    totalTematik?: number;
    totalPicket?: number;
    // For ResearchPoints
    totalUnfinished?: number;
    totalFinished?: number;
    totalApproved?: number;
    totalPoint: number;
    year: number;
    month: number;
  }


interface OrganizationTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  data?: OrganizationUser[];
  month?: string;
  year?: string;
  searchQuery?: string;
}

const OrganizationSummaryTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  searchQuery = "",
}: OrganizationTableProps) => {
  const organizationHeaders = organization[activePage] ?? [];
  const [users, setUsers] = useState<OrganizationUser[]>([]);
  const [kpiData, setKpiData] = useState<KPIUser[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [search, setSearch] = useState(searchQuery ?? "");

  const filteredKpiData = Array.isArray(kpiData)
    ? kpiData
        .filter((item: KPIUser) =>
          item.name.toLowerCase().includes(search.trim().toLowerCase())
        )
        .sort((a: KPIUser, b: KPIUser) => b.totalPoint - a.totalPoint)
    : [];
  useEffect(() => {
    if (activePage === "Attendance") {
      const fetchKPI = async () => {
        try {
          const res = await getKPIAllOperational(
            selectedDate.year,
            selectedDate.month + 1
          );
          setKpiData(Array.isArray(res) ? res : []);
        } catch (error) {
          console.error("Error fetching KPI data:", error);
          setKpiData([]);
        }
      };
      fetchKPI();
    } else if (activePage === "ResearchPoints") {
      const fetchKPIResearch = async () => {
        try {
          const res = await getKPIAllResearch(
            selectedDate.year,
            selectedDate.month + 1
          );
          setKpiData(Array.isArray(res) ? res : []);
        } catch (error) {
          console.error("Error fetching KPI research data:", error);
          setKpiData([]);
        }
      };
      fetchKPIResearch();
    } else {
      const fetchUsers = async () => {
        try {
          const result = await getAllUsers();
          setUsers(Array.isArray(result) ? result : []);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUsers([]);
        }
      };
      fetchUsers();
    }
  }, [activePage, selectedDate]);

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(organization)}
          activeMenu={activePage}
          onChange={onPageChange}
          filter
          filterProps={{
            onChange: (val: { year: number; month: number }) => setSelectedDate(val),
            defaultYear: selectedDate.year,
            defaultMonth: selectedDate.month,
          }}
          searchQuery={search}
          onSearch={setSearch}
        />
      )}

      <div className="w-full overflow-x-auto max-h-[500px]">
        <Table className="w-full">
        <TableHeader>
          <TableRow>
            {organizationHeaders.map((header: string, i: number) => (
              <TableHead key={i} className="text-center sticky top-0 bg-white z-10"
                  style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="overflow-y-auto">
          {activePage === "Attendance"
            ? filteredKpiData.map((item: KPIUser, i: number) => (
                <TableRow key={item.name + i}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.totalAttendance}</TableCell>
                  <TableCell className="text-center">{item.totalTematik}</TableCell>
                  <TableCell className="text-center">{item.totalPicket}</TableCell>
                  <TableCell className="text-center">{item.totalPoint}</TableCell>
                </TableRow>
              ))
            : activePage === "ResearchPoints"
            ? filteredKpiData.map((item: KPIUser, i: number) => (
                <TableRow key={item.name + i}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.totalUnfinished}</TableCell>
                  <TableCell className="text-center">{item.totalFinished}</TableCell>
                  <TableCell className="text-center">{item.totalApproved}</TableCell>
                  <TableCell className="text-center">{item.totalPoint}</TableCell>
                </TableRow>
              ))
            : users
                .filter((user: OrganizationUser) =>
                  user.name?.toLowerCase().includes(search.trim().toLowerCase())
                )
                .map((user: OrganizationUser, i: number) => (
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
    </div>
  );
};

export default OrganizationSummaryTable;
