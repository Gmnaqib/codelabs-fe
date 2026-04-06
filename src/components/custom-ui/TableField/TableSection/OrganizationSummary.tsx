"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { organization } from "../headerConfig";
import { getAllUsers } from "@/services/users/userService";
import { getKPIAllOperational, getKPIAllResearch } from "@/services/kpi/kpiService";


interface OrganizationUser {
  _id: string;
  userName?: string;

  }

  interface OperationalDetail {
    attendance: {
      count: number;
      code: string;
      point: number;
      total: number;
    };
    picket: {
      count: number;
      code: string;
      point: number;
      total: number;
    };
    thematic: {
      count: number;
      code: string;
      point: number;
      total: number;
    };
  }


  interface KPIAttendance {
    userId: string;
    userName: string;
    totalPoints: number;
    operationalDetail: OperationalDetail;
    year?: number;
    month?: number;
  }

  interface KPIResearch {
    userId: string;
    userName: string;
    totalPoints: number;
    byCategory: {
      personal: { count: number; total: number };
      product: { count: number; total: number };
      workshop: { count: number; total: number };
    };
    year?: number;
    month?: number;
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
  const [kpiData, setKpiData] = useState<(KPIAttendance | KPIResearch)[]>([]);
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [search, setSearch] = useState(searchQuery ?? "");

  const filteredKpiData = Array.isArray(kpiData)
    ? kpiData
        .filter((item: KPIAttendance | KPIResearch) =>
          item.userName && item.userName.toLowerCase().includes(search.trim().toLowerCase())
        )
        .sort((a: KPIAttendance | KPIResearch, b: KPIAttendance | KPIResearch) => b.totalPoints - a.totalPoints)
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
    } else if (activePage === "Research Points") {
      const fetchKPIResearch = async () => {
        try {
          const res = await getKPIAllResearch(
            selectedDate.year,
            selectedDate.month + 1
          );
          if (res && Array.isArray(res)) {
            setKpiData(res);
          } else if (res && Array.isArray(res.byUser)) {
            setKpiData(res.byUser);
          } else if (res && res.data && Array.isArray(res.data.byUser)) {
            setKpiData(res.data.byUser);
          } else {
            setKpiData([]);
          }
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
            ? filteredKpiData
                .filter((item): item is KPIAttendance => (item as KPIAttendance).operationalDetail !== undefined)
                .map((item, i: number) => (
                  <TableRow key={item.userName + i}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="text-center">{item.userName}</TableCell>
                    <TableCell className="text-center">{item.operationalDetail.attendance.count}</TableCell>
                    <TableCell className="text-center">{item.operationalDetail.thematic.count}</TableCell>
                    <TableCell className="text-center">{item.operationalDetail.picket.count}</TableCell>
                    <TableCell className="text-center">{item.totalPoints}</TableCell>
                  </TableRow>
                ))
            : activePage === "Research Points"
            ? filteredKpiData
                .filter((item): item is KPIResearch => (item as KPIResearch).byCategory !== undefined)
                .map((item, i: number) => (
                  <TableRow key={item.userName + i}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="text-center">{item.userName}</TableCell>
                    <TableCell className="text-center">{item.byCategory?.personal?.count ?? 0}</TableCell>
                    <TableCell className="text-center">{item.byCategory?.product?.count ?? 0}</TableCell>
                    <TableCell className="text-center">{item.byCategory?.workshop?.count ?? 0}</TableCell>
                    <TableCell className="text-center">{item.totalPoints}</TableCell>
                  </TableRow>
                ))
            : users
                .filter((user: OrganizationUser) =>
                  user.userName?.toLowerCase().includes(search.trim().toLowerCase())
                )
                .map((user: OrganizationUser, i: number) => (
                  <TableRow key={user._id}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="text-center">{user.userName}</TableCell>
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
