"use client";
import React, { useEffect, useState } from "react";
import { Menubar } from "@/components/custom-ui/MenuBar";
import { getAllUsers } from "@/services/users/userService";
import { getAttendance } from "@/services/attendance/attendanceService";
import { getOperationalRecords, getSchedulesPicket } from "@/services/operational/operationalService";
import { OperationalTableProps } from "@/types/OperationalTableProps";
import Image from "next/image";
import {
  CheckCircleIcon,
  MinusCircleIcon,
  ExclamationCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import renderPicketCell from "./renderPicketCell";
import renderThematicCell from "./renderThematicCell";
import renderAbsenceCell from "./renderAbsenceCell";
import BaseScheduleTable from "./BaseScheduleTable";

const headerKeyMap: Record<string, string> = {
  NIM: "nim",
  Nama: "name",
};

const OperationalTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  headersConfig,
  searchQuery = "",
}: OperationalTableProps) => {
  type AttendanceRecord = {
    userId: string;
    status: string;
    checkIn?: string | Date;
    checkOut?: string | Date;
    start_date?: string | Date;
    end_date?: string | Date;
    createdAt?: string | Date;
    approval_status?: string;
  };

  type OperationalRecord = {
    userId: string;
    date: string | Date;
    type?: string;
    scheduleId?: string;
    _id?: string;
  };

  type User = {
    _id: string;
    name: string;
    nim?: string | number;
    records: AttendanceRecord[];
    operationalRecords: OperationalRecord[];
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
   const [selectedDate, setSelectedDate] = useState<{ year: number; month: number }>({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    });
  const [search, setSearch] = useState(searchQuery ?? "");
  type AssignedUser = {
    nim?: string | number;
    _id?: string;
    name?: string;
  };
  type PicketSchedule = {
    _id: string;
    date: string;
    description?: string;
    assignedUsers?: AssignedUser[];
  };
  const [picketSchedules, setPicketSchedules] = useState<PicketSchedule[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const type =
          activePage === "Thematic"
            ? "thematic"
            : activePage === "Picket"
            ? "picket"
            : undefined;

        const [userRes, attendanceRes, operationalRes, picketRes] = await Promise.all([
          getAllUsers(),
          getAttendance(selectedDate.year, selectedDate.month + 1),
          type ? getOperationalRecords(type, undefined, selectedDate.year, selectedDate.month + 1) : Promise.resolve([]),
          getSchedulesPicket(),
        ]);

        setPicketSchedules(picketRes.data || picketRes || []);

        const attendanceMap = attendanceRes.reduce(
          (acc: Record<string, AttendanceRecord[]>, att: AttendanceRecord) => {
            if (!acc[att.userId]) acc[att.userId] = [];
            acc[att.userId].push(att);
            return acc;
          },
          {}
        );

        const operationalMap = (operationalRes || []).reduce(
          (acc: Record<string, OperationalRecord[]>, op: OperationalRecord) => {
            if (!acc[op.userId]) acc[op.userId] = [];
            acc[op.userId].push(op);
            return acc;
          },
          {}
        );

        const combined = userRes.map((user: User) => ({
          ...user,
          records: attendanceMap[user._id] || [],
          operationalRecords: operationalMap[user._id] || [],
        }));

        setUsers(combined);
      } catch (err) {
        console.error("❌ Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, activePage]);

  const query = search.trim().toLowerCase();
  const displayUsers = query
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(query) ||
          u.nim?.toString().includes(query)
      )
    : users;

  const headers = headersConfig[activePage] || [];
  const daysInMonth = new Date(selectedDate.year, selectedDate.month + 1, 0).getDate();
  const isPiket = activePage === "Picket";


  const daysArray = isPiket
    ? Array.from({ length: daysInMonth }, (_, i) => i + 1)
    : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isThematic = activePage === "Thematic";

    const renderCell = (day: string | number, rowIndex: number, data: User[]) => {
      const user = data[rowIndex];
      if (isPiket) return renderPicketCell(day, rowIndex, data, picketSchedules);
      if (isThematic) return renderThematicCell(day, rowIndex, data);
      return renderAbsenceCell(Number(day), user._id, user.records);
    };

  const handleExportExcel = async () => {
    const year = selectedDate.year;
    const month = selectedDate.month + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const [userRes, attendanceRes, thematicRes, picketRes, picketSchRes] = await Promise.all([
      getAllUsers(),
      getAttendance(year, month),
      getOperationalRecords("thematic", undefined, year, month),
      getOperationalRecords("picket", undefined, year, month),
      getSchedulesPicket(),
    ]);

    const schedules: PicketSchedule[] = picketSchRes?.data || picketSchRes || [];

    type ExportAttRecord = { userId: string; status?: string; approval_status?: string; checkIn?: string | Date; checkOut?: string | Date; start_date?: string | Date; end_date?: string | Date; createdAt?: string | Date };
    type ExportOpRecord = { userId: string; date: string | Date };

    const attByUser: Record<string, ExportAttRecord[]> = {};
    (attendanceRes as ExportAttRecord[]).forEach((r) => {
      if (!attByUser[r.userId]) attByUser[r.userId] = [];
      attByUser[r.userId].push(r);
    });

    const thematicByUser: Record<string, ExportOpRecord[]> = {};
    (thematicRes as ExportOpRecord[] || []).forEach((r) => {
      if (!thematicByUser[r.userId]) thematicByUser[r.userId] = [];
      thematicByUser[r.userId].push(r);
    });

    const picketByUser: Record<string, ExportOpRecord[]> = {};
    (picketRes as ExportOpRecord[] || []).forEach((r) => {
      if (!picketByUser[r.userId]) picketByUser[r.userId] = [];
      picketByUser[r.userId].push(r);
    });

    const getAbsenceStatus = (day: number, user: User): string => {
      const currentDate = new Date(year, month - 1, day);
      if (currentDate.getDay() === 0) return "-";
      const records = attByUser[user._id] || [];
      const record = records.find((r) => {
        const start = r.start_date ? new Date(r.start_date) : r.checkIn ? new Date(r.checkIn) : r.createdAt ? new Date(r.createdAt) : null;
        const end = r.end_date ? new Date(r.end_date) : start;
        if (!start || !end) return false;
        if ((r.status === "sick" || r.status === "permit") && r.start_date && r.end_date) {
          const check = new Date(year, month - 1, day);
          return check >= start && check <= end;
        }
        return start.getDate() === day && start.getMonth() === month - 1 && start.getFullYear() === year;
      });
      if (!record) return "Absence";
      if (record.checkIn && record.checkOut) return "Present";
      if (record.status === "sick" && record.approval_status === "approved") return "Sick";
      if (record.status === "permit" && record.approval_status === "approved") return "Permit";
      return "Absence";
    };

    const getThematicStatus = (day: number, user: User): string => {
      const cellDate = new Date(year, month - 1, day);
      const now = new Date();
      const endTime = new Date(cellDate); endTime.setHours(17, 30, 0, 0);
      if (cellDate > now || (cellDate.toDateString() === now.toDateString() && now < endTime)) return "Not Yet";
      const ops = thematicByUser[user._id] || [];
      const found = ops.find((r) => { const d = new Date(r.date); return d.getUTCDate() === day && d.getUTCMonth() === month - 1 && d.getUTCFullYear() === year; });
      return found ? "Thematic" : "No Thematic";
    };

    const getPicketStatus = (day: number, user: User): string => {
      const cellDate = new Date(Date.UTC(year, month - 1, day));
      const now = new Date();
      const today = new Date(); today.setUTCHours(0, 0, 0, 0);
      const cellOnly = new Date(cellDate); cellOnly.setUTCHours(0, 0, 0, 0);
      const cellDateStr = cellDate.toISOString().slice(0, 10);
      const isScheduled = schedules.some((s) => {
        const sStr = (typeof s.date === "string" ? s.date : new Date(s.date).toISOString()).slice(0, 10);
        if (sStr !== cellDateStr) return false;
        return (s.assignedUsers || []).some((u) => (u.nim && user.nim && String(u.nim) === String(user.nim)) || (u._id && user._id && String(u._id) === String(user._id)));
      });
      const ops = picketByUser[user._id] || [];
      const found = ops.find((r) => { const d = new Date(r.date); return d.getUTCFullYear() === cellDate.getUTCFullYear() && d.getUTCMonth() === cellDate.getUTCMonth() && d.getUTCDate() === cellDate.getUTCDate(); });
      if (cellOnly > today) return "Not Yet";
      if (cellOnly.getTime() === today.getTime() && now.getHours() < 17) return "Not Yet";
      if (!isScheduled) return "-";
      return found ? "Picket" : "No Picket";
    };

    const absenceColor: Record<string, { bg: string; fg: string } | null> = {
      "Absence":  { bg: "FFFF0000", fg: "FFFFFFFF" },
      "Sick":     { bg: "FF00B050", fg: "FFFFFFFF" },
      "Present":  { bg: "FF4472C4", fg: "FFFFFFFF" },
      "Permit":   { bg: "FFFFC000", fg: "FFFFFFFF" },
    };
    const thematicColor: Record<string, { bg: string; fg: string } | null> = {
      "Thematic":    { bg: "FF00B050", fg: "FFFFFFFF" },
      "No Thematic": { bg: "FFFF0000", fg: "FFFFFFFF" },
    };
    const picketColor: Record<string, { bg: string; fg: string } | null> = {
      "Picket":    { bg: "FF00B050", fg: "FFFFFFFF" },
      "No Picket": { bg: "FFFF0000", fg: "FFFFFFFF" },
    };

    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const totalCols = 2 + days.length;

    const buildSheet = (
      sheetName: string,
      title: string,
      getStatus: (day: number, user: User) => string,
      colorMap: Record<string, { bg: string; fg: string } | null>
    ) => {
      const ws = wb.addWorksheet(sheetName);

      // Row 1: title merged & centered
      ws.mergeCells(1, 1, 1, totalCols);
      const titleCell = ws.getCell(1, 1);
      titleCell.value = title;
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      titleCell.font = { name: "Times New Roman", bold: true, size: 14 };
      ws.getRow(1).height = 30;

      // Row 2: empty
      ws.getRow(2).height = 8;

      // Row 3: headers
      const headerRow = ws.getRow(3);
      headerRow.values = ["", "NIM", "Nama", ...days.map(String)];
      headerRow.eachCell((cell, col) => {
        cell.font = { name: "Times New Roman", bold: true };
        if (col >= 4) cell.alignment = { horizontal: "center", vertical: "middle" };
      });
      headerRow.height = 20;

      // Data rows
      (userRes as User[]).forEach((user, i) => {
        const row = ws.getRow(4 + i);
        row.values = ["", user.nim ?? "-", user.name ?? "-", ...days.map((d) => getStatus(d, user))];
        row.eachCell((cell, col) => {
          cell.font = { name: "Times New Roman" };
          if (col >= 4) {
            cell.alignment = { horizontal: "center", vertical: "middle" };
            const style = colorMap[cell.value as string];
            if (style) {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: style.bg } };
              cell.font = { name: "Times New Roman", color: { argb: style.fg } };
            }
          }
        });
      });
    };

    buildSheet("Absensi",  "Laporan Absensi",  getAbsenceStatus,  absenceColor);
    buildSheet("Thematic", "Laporan Thematic", getThematicStatus, thematicColor);
    buildSheet("Picket",   "Laporan Picket",   getPicketStatus,   picketColor);

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_Operasional_${year}_${String(month).padStart(2, "0")}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading data...
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(headersConfig)}
          activeMenu={activePage}
          onChange={onChange => onPageChange(onChange)}
          filter
          operational
          
          search={true}
          filterProps={{
            onChange: (val: { year: number; month: number }) => setSelectedDate(val),
            defaultYear: selectedDate.year,
            defaultMonth: selectedDate.month,
          }}
          searchQuery={search}
          onSearch={setSearch}
          onExportExcel={handleExportExcel}
        />
      )}

      {
        activePage !== "Picket" && activePage !== "Thematic" && (
          <div className="flex flex-col gap-1 mb-4 p-3 relative rounded-xl overflow-hidden">
            <Image src="/icon/bg-absensi-top.png" alt="outline-top" width={800} height={800} className="absolute left-0 top-0 rounded-l-xl"/>
            <Image src="/icon/bg-absensi-bottom.png" alt="outline-bottom" width={700} height={700} className="absolute right-0 top-0 rounded-l-xl"/>

            <div className="flex justify-between mb-1 z-10">
              <p className="font-medium">Attendance Status Indicators :</p>
              <p className="text-primary cursor-pointer" onClick={() => setShowInfo((prev) => !prev)} >{showInfo ? "Hide" : "Show Information"}</p>
            </div>

            {showInfo && (
              <>
              <Image src="/icon/vector-1.png" alt="vector-1" width={200} height={200} className="absolute right-0 bottom-0 rounded-r-xl"/>

              <div className="flex gap-2 items-center">
                <CheckCircleIcon className="size-6 text-primary"/>
                <p className="text-muted">:</p>
                <p className="text-muted">The member checked in and checked out on this day.</p>
              </div>

              <div className="flex gap-2 items-center">
                <MinusCircleIcon className="size-6 text-neutral"/>
                <p className="text-muted">:</p>
                <p className="text-muted">Absent without any explanation.</p>
              </div>

              <div className="flex gap-2 items-center">
                <PlusCircleIcon className="size-6 text-success"/>
                <p className="text-muted">:</p>
                <p className="text-muted">Absent due to illness.</p>
              </div>

              <div className="flex gap-2 items-center">
                <ExclamationCircleIcon className="size-6 text-warning"/>
                <p className="text-muted">:</p>
                <p className="text-muted">Absent with permission.</p>
              </div>
              </>
            )}
          </div>
        )
      }
        
        <BaseScheduleTable
          leftHeaders={headers}
          headerKeyMap={headerKeyMap}
          daysArray={daysArray}
          data={displayUsers}
          isPiket={isPiket}
          renderCell={renderCell}
          renderLeftCell={(row: User, h: string) => {
            const key = headerKeyMap[h] || h.toLowerCase();
            let value: string | number | undefined = undefined;
            if (key === "nim") value = row.nim;
            else if (key === "name") value = row.name;
            else if (key === "_id") value = row._id;
            if (value === undefined || value === null) value = "-";
            if (h === "Nama" && typeof value === "string") value = value.split(" ")[0];
            return value;
          }}
          renderTotal={(row: User) => {
            if (activePage === "Picket") {
              return row.operationalRecords?.length ?? 0;
            } else if (activePage === "Thematic") {
              return row.operationalRecords?.filter((r: OperationalRecord) => r.type === "thematic").length ?? 0;
            } else {
              return row.records?.filter((r: AttendanceRecord) => r.status === "present").length ?? 0;
            }
          }}
        />

        
    </div>
  );
};

export default OperationalTable;
