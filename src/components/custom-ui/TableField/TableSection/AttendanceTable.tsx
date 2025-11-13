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
import {
  getAllLeaveRequests,
  getTodayLeaveRequests,
} from "@/services/attendance/attendanceService";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DialogField from "../../DialogField";

function getReviewerByDate(dateString?: string | Date): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = d.getDay(); // 0 = Minggu, 1 = Senin, ...
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
    case "APPROVED":
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
  month?: number;
  year?: number;
  search?: string;
  searchQuery?: string;
  data?: any[]; 
}

const AttendanceTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  month,
  year,
  searchQuery = "",
}: AttendanceTableProps) => {
  const attendanceHeaders = attendance[activePage] ?? [];
  const [todayData, setTodayData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToday, setShowToday] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data dari API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || new Date().getMonth() + 1;

        const [today, all] = await Promise.all([
          getTodayLeaveRequests(),
          getAllLeaveRequests(targetYear, targetMonth), 
        ]);

        setTodayData(today);
        setAllData(all);
      } catch (err) {
        console.error("❌ Error fetching attendance data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [month, year]);

  // Filter nama (case-insensitive)
  const filteredData = allData.filter((item) =>
    item.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Render tiap baris tabel
  const renderPermissionRow = (item: any, index: number) => (
  <TableRow key={index}>
    <TableCell className="text-center text-base">
      {item.userName?.split(" ")[0] ?? "-"}
    </TableCell>
    <TableCell className="text-center uppercase text-base">{item.type}</TableCell>
    <TableCell className="text-center text-base">
      {new Date(item.startDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}
    </TableCell>
    <TableCell className="text-center text-base">{getReviewerByDate(item.startDate)}</TableCell>
    <TableCell className="text-center">
      <span
        className={`px-7 py-1 rounded-full text-base uppercase ${getStatusColor(
          item.approvalStatus
        )}`}
      >
        {item.approvalStatus}
      </span>
    </TableCell>
    <TableCell className="text-center">
       <DialogField name="Review" title="Reason" variant="outline" noPadding >
          <p>
            asd
          </p>
       </DialogField>
    </TableCell>
  </TableRow>
);


  if (loading) {
    return <Card className="p-6 text-center text-gray-500">Loading data...</Card>;
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
          {showToday ? "Hide" : "Show Today"}
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
                paginatedData.length > 0 ? (
                  paginatedData.map(renderPermissionRow)
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

        {/* PAGINATION */}
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 3 && <PaginationEllipsis />}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Card>
    </div>
  );
};

export default AttendanceTable;
