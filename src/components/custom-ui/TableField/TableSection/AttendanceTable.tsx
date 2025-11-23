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
  getAttendanceSummary,
  getLeaveRequestById,
  reviewLeaveRequest,
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
import { DropdownField } from "../../DropdownField";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";

function getReviewerByDate(dateString?: string | Date): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = d.getDay();
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

function getStatusColor(status: string): string {
  if (!status) return "bg-gray-100 text-gray-700";
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
  searchQuery?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeave, setSelectedLeave] = useState<any | null>(null);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activePage === "Permissions") {
        const targetYear = year || new Date().getFullYear();
        const targetMonth = month || new Date().getMonth() + 1;

        const [today, all] = await Promise.all([
          getTodayLeaveRequests(),
          getAllLeaveRequests(targetYear, targetMonth),
        ]);
        setTodayData(today);
        setAllData(all);
      } else if (activePage === "TotalAttendance") {
        const summary = await getAttendanceSummary();
        setAllData(summary);
        setTodayData([]);
      }
    } catch (err) {
      console.error("❌ Error fetching attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year, activePage]);

  const filteredTodayData = todayData.filter((item) =>
    item.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredData = allData.filter((item) =>
    item.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleOpenDialog(id: string) {
    setSelectedLeave(null);
    const detail = await getLeaveRequestById(id);
    setSelectedLeave(detail);
  }

const handleReview = async (status: string) => {
  if (!selectedLeave?._id) {
    alert("No selected leave to review.");
    return;
  }

  try {
    const payloadStatus = status.toLowerCase();
    await reviewLeaveRequest(selectedLeave._id, payloadStatus);
    toast.success("Update Data berhasis!");
    setSelectedLeave((prev: any) =>
      prev ? { ...prev, approvalStatus: payloadStatus } : prev
    );

    await fetchData();
  } catch (err) {
    showErrorToast("Gagal memperbarui data.", { duration: 5000 });
  }
};


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
      <TableCell className="text-center text-base">
        {getReviewerByDate(item.startDate)}
      </TableCell>
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
        <DialogField
          name="Review"
          title="Reason"
          variant="outline"
          noPadding
          onTriggerClick={() => handleOpenDialog(item._id)}
        >
          {!selectedLeave ? (
            <p>Loading ...</p>
          ) : (
            <div className="flex flex-col gap-7">
              <div className="">
                <p className="font-semibold">Name</p>
                <p>{selectedLeave.userName}</p>
              </div>

              <div className="flex gap-12 items-center">
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{selectedLeave.type.toUpperCase()}</p>
                </div>

                <div>
                  <p className="font-semibold">Date</p>
                  <p>
                    {new Date(selectedLeave.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-semibold">Permission</p>
                  <DropdownField
                    key={selectedLeave._id}
                    title={(selectedLeave.approvalStatus)} // optional tampilkan capitalized
                    menu={["Approved", "Rejected"]}
                    disabled={selectedLeave.approvalStatus?.toLowerCase() !== "pending"}
                    onSelect={(value) => handleReview(value)}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold">Problem</p>
                <p>{selectedLeave.reason}</p>
              </div>
            </div>
          )}
        </DialogField>
      </TableCell>
    </TableRow>
  );

  const renderSummaryRow = (item: any, index: number) => (
    <TableRow key={index}>
      <TableCell className="text-center text-base">{item.userName}</TableCell>
      <TableCell className="text-center">{item.counts?.present ?? 0}</TableCell>
      <TableCell className="text-center">{item.counts?.late ?? 0}</TableCell>
      <TableCell className="text-center">{item.counts?.sick ?? 0}</TableCell>
      <TableCell className="text-center">{item.counts?.leave ?? 0}</TableCell>
      <TableCell className="text-center">{item.counts?.absent ?? 0}</TableCell>
      <TableCell className="text-center">
        <DropdownField title="Disable" menu={["Disable", "Ennable"]} />
      </TableCell>
      <TableCell className="text-center">
        <DialogField name="Detail" title="Attendance Detail" variant="outline" noPadding>
          <p>Detail attendance data for {item.userName}</p>
        </DialogField>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return <Card className="p-6 text-center text-gray-500">Loading data...</Card>;
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(attendance)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      {activePage === "Permissions" && (
        <>
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
                    {filteredTodayData.length > 0 ? (
                        filteredTodayData.map(renderPermissionRow)
                      ) : (
                        <TableRow>
                          <TableCell colSpan={attendanceHeaders.length} className="text-center py-5">
                            Tidak ada data hari ini
                          </TableCell>
                        </TableRow>
                      )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </>
      )}

      <div className="flex items-center w-full px-5 gap-3 bg-white pt-5">
        <p className="font-bold text-xl">
          {activePage === "Permissions" ? "All Report" : "Total Attendance Summary"}
        </p>
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
              {activePage === "Permissions"
                ? paginatedData.length > 0
                  ? paginatedData.map(renderPermissionRow)
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={attendanceHeaders.length}
                        className="text-center py-5"
                      >
                        Tidak ada data laporan
                      </TableCell>
                    </TableRow>
                  )
                : allData.length > 0
                  ? allData.map(renderSummaryRow)
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={attendanceHeaders.length}
                        className="text-center py-5"
                      >
                        Tidak ada data kehadiran
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </div>

        {activePage === "Permissions" && (
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
        )}
      </Card>
    </div>
  );
};

export default AttendanceTable;
