"use client";

import React, { useState, useEffect } from "react";
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
import { attendance } from "../headerConfig";
import { getAllLeaveRequests, getTodayLeaveRequests } from "@/services/attendance/attendanceService";

// Fungsi reviewer berdasarkan hari
function getReviewerByDay(): string {
  const day = new Date().getDay(); // 0 = Minggu, 1 = Senin, ...
  const reviewers: Record<number, string> = {
    1: "Favian",
    2: "Rava",
    3: "Favian",
    4: "Erwin",
    5: "Rava",
    6: "Erwin",
  };
  return reviewers[day] ?? "-";
}

// Fungsi warna status
function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return "bg-green-100 text-green-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

interface AttendanceTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
}

const AttendanceTable = ({
  activePage,
  onPageChange,
  showMenu = true,
}: AttendanceTableProps) => {
  const attendanceHeaders = attendance[activePage] ?? [];
  const [todayData, setTodayData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(true);

  // Fetch data from APIs
  useEffect(() => {
    async function fetchData() {
      try {
        const [today, all] = await Promise.all([
          getTodayLeaveRequests(),
          getAllLeaveRequests(),
        ]);
        setTodayData(today);
        setAllData(all);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const renderPermissionRow = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell className="text-center">{item.userName}</TableCell>
      <TableCell className="text-center capitalize">{item.type}</TableCell>
      <TableCell className="text-center">
        {new Date(item.startDate).toLocaleDateString("id-ID")}
      </TableCell>
      <TableCell className="text-center">{getReviewerByDay()}</TableCell>
      <TableCell className="text-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            item.approvalStatus
          )}`}
        >
          {item.approvalStatus}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <button className="text-primary underline text-sm">Detail</button>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <Card className="p-6 text-center text-gray-500">Loading data...</Card>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {/* Menu Bar */}
      {showMenu && (
        <Menubar
          menus={Object.keys(attendance)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      {/* TODAY SECTION */}
      <div className="flex items-center w-full px-5 gap-2 bg-white pt-5">
        <p className="font-bold text-xl">Today</p>
        <p
          onClick={() => setShowToday(!showToday)}
          className="text-primary font-bold text-sm cursor-pointer select-none"
        >
          {showToday ? "Hide" : "Show All"}
        </p>
      </div>

      {showToday && (
        <Card>
          <div className="px-5">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  {attendanceHeaders.map((header, i) => (
                    <TableHead key={i}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {activePage === "Permissions" ? (
                  todayData.length > 0 ? (
                    todayData.map(renderPermissionRow)
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={attendanceHeaders.length}
                        className="text-center py-5"
                      >
                        Tidak ada data hari ini
                      </TableCell>
                    </TableRow>
                  )
                ) : null}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* ALL REPORT SECTION */}
      <div className="flex items-center w-full px-5 gap-3 bg-white pt-5">
        <p className="font-bold text-xl">All Report</p>
      </div>

      <Card>
        <div className="px-5">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {attendanceHeaders.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {activePage === "Permissions" ? (
                allData.length > 0 ? (
                  allData.map(renderPermissionRow)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={attendanceHeaders.length}
                      className="text-center py-5"
                    >
                      Tidak ada data laporan
                    </TableCell>
                  </TableRow>
                )
              ) : null}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceTable;
