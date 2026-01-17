"use client";
import React, { useEffect, useState } from "react";
import { Menubar } from "@/components/custom-ui/MenuBar";
import { getAllUsers } from "@/services/users/userService";
import { getAttendance } from "@/services/attendance/attendanceService";
import { getOperationalRecords } from "@/services/operational/operationalService";
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
  month,
  year,
  headersConfig,
  searchQuery = "",
}: OperationalTableProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  // State untuk filter bulan/tahun dan search
  // Pastikan default bulan/tahun dari props
  const [selectedDate, setSelectedDate] = useState({ year, month });
  const [search, setSearch] = useState(searchQuery ?? "");

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

        const [userRes, attendanceRes, operationalRes] = await Promise.all([
          getAllUsers(),
          getAttendance(selectedDate.year, selectedDate.month),
          type ? getOperationalRecords(type, undefined, selectedDate.year, selectedDate.month) : Promise.resolve([]),
        ]);

        const attendanceMap = attendanceRes.reduce(
          (acc: Record<string, any[]>, att: any) => {
            if (!acc[att.userId]) acc[att.userId] = [];
            acc[att.userId].push(att);
            return acc;
          },
          {}
        );

        const operationalMap = (operationalRes || []).reduce(
          (acc: Record<string, any[]>, op: any) => {
            if (!acc[op.userId]) acc[op.userId] = [];
            acc[op.userId].push(op);
            return acc;
          },
          {}
        );

        const combined = userRes.map((user: any) => ({
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
  const daysInMonth = new Date(year, month, 0).getDate();
  const isPiket = activePage === "Picket";

  const getWorkingWeeks = (year: number, month: number) => {
  const weeks: number[][] = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  let currentWeek: number[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat

    // skip weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    currentWeek.push(day);

    // Jumat (5) → tutup minggu
    if (dayOfWeek === 5) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // sisa hari (kalau bulan habis tapi belum Jumat)
  if (currentWeek.length) {
    weeks.push(currentWeek);
  }

  return weeks;
};
const workingWeeks = getWorkingWeeks(year, month);
const activeWeekIndex = 0;

  const daysArray = isPiket
    ? workingWeeks[activeWeekIndex] || []
    : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isThematic = activePage === "Thematic";

    const renderCell = (day: string | number, rowIndex: number, data: any[], context?: any) => {
      const user = data[rowIndex];
      if (isPiket) return renderPicketCell(day, rowIndex, data);
      if (isThematic) return renderThematicCell(day, rowIndex, data);
      return renderAbsenceCell(Number(day), user._id, user.records);
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
          search={true}
          filterProps={{
            onChange: (val: { year: number; month: number }) => setSelectedDate(val),
            defaultYear: year,
            defaultMonth: month,
          }}
          searchQuery={search}
          onSearch={setSearch}
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
          renderLeftCell={(row, h) => {
            const key = headerKeyMap[h] || h.toLowerCase();
            let value = row[key] ?? "-";
            if (h === "Nama" && typeof value === "string") value = value.split(" ")[0];
            return value;
          }}
          renderTotal={(row) => {
            const totalPresent = row.records?.filter((r: any) => r.status === "present").length ?? 0;
            return totalPresent;
          }}
        />

        
    </div>
  );
};

export default OperationalTable;
