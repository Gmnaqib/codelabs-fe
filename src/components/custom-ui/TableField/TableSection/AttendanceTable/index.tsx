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
import { attendance } from "../../headerConfig";
import {
  getAllLeaveRequests,
  getTodayLeaveRequests,
  getAttendanceSummary,
  getLeaveRequestById,
  reviewLeaveRequest,
} from "@/services/attendance/attendanceService";
import { getStatusColor } from "@/utils/statusColor";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import DialogField from "../../../DialogField";
import { DropdownField } from "../../../DropdownField";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/toastHelper";
import { getAllUsers } from "@/services/users/userService";
import CardField from "../../../CardField";
import { ClockIcon, DocumentTextIcon, ExclamationTriangleIcon, HandRaisedIcon, HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { AttendanceTableProps } from "@/types/AttendanceTableProps";

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


const AttendanceTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  searchQuery = "",
}: AttendanceTableProps) => {
  const attendanceHeaders = attendance[activePage] ?? [];
  interface LeaveRequest {
    _id: string;
    userId: string;
    userName: string;
    startDate: string | Date;
    endDate: string | Date;
    approvalStatus: string;
    type: string;
    reason?: string;
    attachment_url?: string;
  }

  interface AttendanceSummaryCounts {
    present: number;
    permit: number;
    sick: number;
    late: number;
    absent: number;
  }

  interface AttendanceSummaryItem {
    userId: string;
    userName: string;
    changeDevice: string;
    userDetail: Record<string, unknown>;
    counts: AttendanceSummaryCounts;
    _summaryId?: string;
  }

  interface StatusRecord {
    date: string;
    reason?: string;
    approvalStatus?: string;
  }

  interface StatusSummary {
    status: string;
    records: StatusRecord[];
  }

  interface AttendanceDetailData {
    statusSummary: StatusSummary[];
  }

  const [todayData, setTodayData] = useState<LeaveRequest[]>([]);
  const [allData, setAllData] = useState<LeaveRequest[] | AttendanceSummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToday, setShowToday] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const itemsPerPage = 10;

  const [summary, setSummary] = useState<AttendanceSummaryItem[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const [detailDialogUserId, setDetailDialogUserId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<AttendanceDetailData | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

      useEffect(() => {
        const fetchSummary = async () => {
          try {
            setLoading(true);
            const res = await getAttendanceSummary(
              selectedDate.year,
              selectedDate.month + 1
            );
            setSummary(res);
          } catch (err) {
            console.error("❌ Error fetching attendance summary:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchSummary();
      }, [selectedDate]);


  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);

      if (activePage === "Permissions") {
        const targetYear = selectedDate.year;
        const targetMonth = selectedDate.month + 1;

        const [todayRaw, allRaw, users] = await Promise.all([
          getTodayLeaveRequests(),
          getAllLeaveRequests(targetYear, targetMonth),
          getAllUsers(),
        ]);

        type User = { _id: string; name: string };
        const userMap: Record<string, string> = Object.fromEntries((users as User[]).map((u) => [u._id, u.name]));

        type RawLeaveItem = {
          _id: string;
          userId: string;
          start_date?: string | Date;
          startDate?: string | Date;
          end_date?: string | Date;
          endDate?: string | Date;
          approval_status?: string;
          approvalStatus?: string;
          status?: string;
          type?: string;
          reason?: string;
          attachment_url?: string;
        };
        const mapLeave = (item: RawLeaveItem): LeaveRequest => ({
          _id: item._id,
          userId: item.userId,
          userName: userMap[item.userId] || '-',
          startDate: item.start_date || item.startDate || '',
          endDate: item.end_date || item.endDate || '',
          approvalStatus: item.approval_status || item.approvalStatus || '',
          type: item.status || item.type || '',
          reason: item.reason,
          attachment_url: item.attachment_url,
        });

        const all = (allRaw as RawLeaveItem[]).map(mapLeave);
        const todayMapped = (todayRaw as RawLeaveItem[]).map(mapLeave);
        setTodayData(todayMapped);
        setAllData(all);
      } else if (activePage === "TotalAttendance") {
        const [summary, users] = await Promise.all([
          getAttendanceSummary(selectedDate.year, selectedDate.month + 1),
          getAllUsers(),
        ]);

        const summaryByUserId: Record<string, AttendanceSummaryItem> = {};
        summary.forEach((s: AttendanceSummaryItem) => {
          summaryByUserId[s.userId] = s;
        });

        type User = { _id: string; name: string; change_device_id?: string };
        const merged = (users as User[]).map((u) => {
          const s = summaryByUserId[u._id];
          return {
            userId: u._id,
            userName: u.name || "-",
            changeDevice: u.change_device_id ? "True" : "False",
            userDetail: u,
            counts: s?.counts ?? {
              present: 0,
              permit: 0,
              sick: 0,
              late: 0,
              absent: 0,
            },
            ...(s ? s : {}),
          };
        });

        setAllData(merged);
        setTodayData([]);
      }
    } catch {
      console.error("❌ Error fetching attendance data");
    } finally {
      setLoading(false);
    }
  }, [activePage, selectedDate]);

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
  }, [selectedDate, activePage, fetchData]);


  const filteredTodayData = todayData.filter((item) =>
    item.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredData = allData.filter((item) =>
    (item as { userName?: string }).userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dataToPaginate = filteredData;

  const totalPages = Math.ceil(dataToPaginate.length / itemsPerPage);

  const paginatedData = dataToPaginate.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  async function handleOpenDialog(id: string) {
    setSelectedLeave(null);
    const detail = await getLeaveRequestById(id);
    let userName = "-";
    try {
      const users = await getAllUsers();
      const userMap: Record<string, string> = Object.fromEntries(users.map((u: { _id: string; name: string }) => [u._id, u.name]));
      userName = userMap[detail.userId] || "-";
    } catch {
      userName = "-";
    }
    setSelectedLeave({
      _id: detail._id,
      userId: detail.userId,
      userName,
      startDate: detail.start_date || detail.startDate,
      endDate: detail.end_date || detail.endDate,
      approvalStatus: detail.approval_status || detail.approvalStatus,
      type: detail.status || detail.type,
      reason: detail.reason,
      attachment_url: detail.attachment_url,
    });
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
      setSelectedLeave((prev) =>
        prev ? { ...prev, approvalStatus: payloadStatus } : prev
      );

      await fetchData();
    } catch {
      showErrorToast("Gagal memperbarui data.", { duration: 5000 });
    }
  };

  const renderPermissionRow = (item: LeaveRequest, index: number) => (
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
              <div>
                <p className="font-semibold">Name</p>
                <p>{selectedLeave.userName}</p>
              </div>

              <div className="flex gap-12 items-center">
                <div>
                  <p className="font-semibold">Status</p>
                  <p>{selectedLeave?.type?.toUpperCase() || '-'}</p>
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
                    title={selectedLeave.approvalStatus}
                    menu={["Approved", "Rejected"]}
                    onSelect={(value) => handleReview(value)}
                  />
                </div>
              </div>

              <div>
                <p className="font-semibold">Reason</p>
                <p>{selectedLeave.reason}</p>
              </div>
              <div>
                <p className="font-semibold">Avidance</p>
                <a href={selectedLeave.attachment_url} target="_blank" rel="noopener noreferrer">{selectedLeave.attachment_url}</a>
              </div>
            </div>
          )}
        </DialogField>
      </TableCell>
    </TableRow>
  );

  const renderSummaryRow = (item: AttendanceSummaryItem, index: number) => {
    const handleOpenDetail = async () => {
      setDetailDialogUserId(item.userId);
      setDetailLoading(true);
      try {
        const { getAttendanceSummaryByUserId } = await import("@/services/attendance/attendanceService");
        const res = await getAttendanceSummaryByUserId(
          item.userId,
          selectedDate.year,
          selectedDate.month + 1
        );
        setDetailData(res as AttendanceDetailData);
      } catch {
        setDetailData(null);
      } finally {
        setDetailLoading(false);
      }
    };

    return (
      <TableRow key={index}>
        <TableCell className="text-center text-base w-96">{item.userName}</TableCell>
        <TableCell className="text-center w-96">{item.counts?.present ?? 0}</TableCell>
        <TableCell className="text-center w-96">{item.counts?.permit ?? 0}</TableCell>
        <TableCell className="text-center w-96">{item.counts?.sick ?? 0}</TableCell>
        <TableCell className="text-center w-96">{item.counts?.late ?? 0}</TableCell>
        <TableCell className="text-center w-96">{item.counts?.absent ?? 0}</TableCell>
        <TableCell className="text-center w-96">
          {(() => {
            const absent = item.counts?.absent ?? 0;
            if (absent >= 12) return 3;
            if (absent >= 8) return 2;
            if (absent >= 4) return 1;
            return 0;
          })()}
        </TableCell>
        <TableCell className="text-center w-96">
          <DialogField
            name="Detail"
            title="Attendance Detail"
            variant="outline"
            noPadding
            onTriggerClick={handleOpenDetail}
          >
            {detailDialogUserId === item.userId && detailLoading ? (
              <p>Loading...</p>
            ) : detailDialogUserId === item.userId && detailData && detailData.statusSummary ? (
              <div className="flex gap-5 max-h-96 overflow-y-auto">
                <div className="w-1/2">
                  <p className="font-semibold text-white bg-primary py-1 rounded-sm text-center mb-2">Permit</p>
                  {detailData.statusSummary
                    .filter((s: StatusSummary) => s.status === "permit")
                    .flatMap((s: StatusSummary) => s.records)
                    .map((rec: StatusRecord, idx: number) => (
                      <React.Fragment key={idx}>
                        <p className="font-semibold text-sm">{new Date(rec.date).toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                        <p className="font-semibold text-xs mb-1">{new Date(rec.date).toLocaleTimeString("en-US")}</p>
                        <p className="text-sm font-extralight mb-1">{rec.reason}</p>
                        <p className={`text-sm ${getStatusColor(rec.approvalStatus ?? "")}`}>
                          {rec.approvalStatus?.toUpperCase()}
                        </p>
                        <hr className="my-2" />
                      </React.Fragment>
                    ))}
                </div>

                <div className="w-1/2">
                  <div className="flex flex-col gap-4">
                    <div className="">
                      <p className="font-semibold text-center text-white bg-warning py-1 rounded-sm mb-2">Sick</p>
                      {detailData.statusSummary
                        .filter((s: StatusSummary) => s.status === "sick")
                        .flatMap((s: StatusSummary) => s.records)
                        .map((rec: StatusRecord, idx: number) => (
                          <React.Fragment key={idx}>
                            <p className="font-semibold text-sm">{new Date(rec.date).toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                            <p className="font-semibold text-xs mb-1">{new Date(rec.date).toLocaleTimeString("en-US")}</p>
                            <p className="text-sm font-extralight mb-1">{rec.reason}</p>
                            <p className={`text-sm ${getStatusColor(rec.approvalStatus ?? "")}`}>
                              {rec.approvalStatus?.toUpperCase()}
                            </p>
                            <hr className="my-2" />
                          </React.Fragment>
                        ))}
                    </div>
                    <div className="">
                      <p className="font-semibold bg-destructive text-center rounded-sm py-1 text-white mb-2">Absent</p>
                      {detailData.statusSummary
                        .filter((s: StatusSummary) => s.status === "absent")
                        .flatMap((s: StatusSummary) => s.records)
                        .filter((rec: StatusRecord) => rec.reason === "No data")
                        .map((rec: StatusRecord, idx: number) => (
                          <React.Fragment key={idx}>
                            <p className="text-sm font-bold">
                              {new Date(rec.date).toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            <hr className="my-2" />
                          </React.Fragment>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>No detail data available.</p>
            )}
          </DialogField>
        </TableCell>
      </TableRow>
    );
  };

  if (loading) {
    return <Card className="p-6 text-center text-gray-500">Loading data...</Card>;
  }


  const totalPresent =
    summary?.reduce((acc: number, u) => acc + (u.counts?.present ?? 0), 0) ?? 0;
  const totalPermit =
    summary?.reduce((acc: number, u) => acc + (u.counts?.permit ?? 0), 0) ?? 0;
  const totalSick =
    summary?.reduce((acc: number, u) => acc + (u.counts?.sick ?? 0), 0) ?? 0;
  const totalLate =
    summary?.reduce((acc: number, u) => acc + (u.counts?.late ?? 0), 0) ?? 0;
  const totalAbsent =
    summary?.reduce((acc: number, u) => acc + (u.counts?.absent ?? 0), 0) ?? 0;
  const totalOverall =
    totalPresent + totalPermit + totalSick + totalLate + totalAbsent;

  return (
    <div className="w-full rounded-lg overflow-hidden">

      {showMenu && (
        <Menubar
          menus={Object.keys(attendance)}
          activeMenu={activePage}
          onChange={onPageChange}
          filter
          search={false}
          filterProps={{
            onChange: (val: { year: number; month: number }) => setSelectedDate(val),
            defaultYear: selectedDate.year,
            defaultMonth: selectedDate.month,
          }}
        />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mt-3">
          <CardField title="Total Report" icon={<DocumentTextIcon />} noGap>
            <p className="text-primary font-medium text-center text-2xl mt-4">
              {loading ? "..." : totalOverall}
            </p>
          </CardField>
          <CardField title="Permit" icon={<HandRaisedIcon />} noGap>
            <p className="font-medium text-center text-2xl mt-4">{loading ? "..." : totalPermit}</p>
          </CardField>
          <CardField title="Sick" icon={<HeartIcon />} noGap>
            <p className="font-medium text-center text-2xl mt-4">{loading ? "..." : totalSick}</p>
          </CardField>
          <CardField title="Late Arrivals" icon={<ClockIcon />} noGap>
            <p className="font-medium text-center text-2xl mt-4">{loading ? "..." : totalLate}</p>
          </CardField>
          <CardField title="No Report" icon={<ExclamationTriangleIcon />} noGap>
            <p className="font-medium text-center text-2xl mt-4">{loading ? "..." : totalAbsent}</p>
          </CardField>
      </div>

      <div className="w-full h-0.5 bg-bg-neutral mt-8 mb-5"></div>

      {activePage === "Permissions" && (
        <>
          <div className="flex justify-between items-center w-full px-5 bg-white">
            <p className="font-medium text-xl">Today</p>
            <p
              onClick={() => setShowToday(!showToday)}
              className="text-primary font-normal text-sm cursor-pointer select-none"
            >
              {showToday ? "Hide" : "Show Today"}
            </p>
          </div>

          {showToday && (
            filteredTodayData.length > 0 ? (
              <Card className="mt-4">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      {attendanceHeaders.map((header, i) => (
                        <TableHead key={i}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredTodayData.map(renderPermissionRow)}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <Card className="py-12">
                <div className="text-center">
                  <Image
                    src="/icon/no-data.png"
                    alt="No Data"
                    width={200}
                    height={200}
                    className="mx-auto mb-4"
                  />
                  <p className="font-medium text-lg">All Clear</p>
                  <p className="text-base text-neutral">
                    No one submitted sick leave, permission, or absence today.
                  </p>
                </div>
              </Card>
            )
          )}
        </>
      )}

      <Card>
          {activePage === "Permissions" && (
            <p className="font-medium text-xl px-5">All Report</p>
          )}
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {attendanceHeaders.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
                activePage === "Permissions"
                  ? (paginatedData as LeaveRequest[]).map((item, index) => renderPermissionRow(item, index))
                  : (paginatedData as AttendanceSummaryItem[]).map((item, index) => renderSummaryRow(item, index))
              ) : (
                <TableRow>
                  <TableCell colSpan={attendanceHeaders.length} className="text-center py-5">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        {totalPages > 1 && (
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

              {totalPages > 5 && <PaginationEllipsis />}

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
