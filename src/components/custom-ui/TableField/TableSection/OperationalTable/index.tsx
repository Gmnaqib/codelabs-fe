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
