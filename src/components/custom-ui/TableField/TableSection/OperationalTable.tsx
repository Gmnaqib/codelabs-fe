"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "../../MenuBar";
import { renderCellContent } from "../renderCellContent";
import { getAllUsers } from "@/services/users/userService";
import { getAttendance } from "@/services/attendance/attendanceService";

interface OperationalTableProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  showMenu?: boolean;
  month: number;
  year: number;
  headersConfig: Record<string, string[]>;
  checkedState: Record<string, boolean>;
  onToggle: (page: string, rowIndex: number, day: string | number) => void;
}

const OperationalTable = ({
  activePage,
  onPageChange,
  showMenu = true,
  month,
  year,
  headersConfig,
  checkedState,
  onToggle,
}: OperationalTableProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch users dan attendance
 // ...
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, attendanceRes] = await Promise.all([
          getAllUsers(),
          getAttendance(year, month), // ✅ pakai props
        ]);

        const userAttendanceMap = attendanceRes.reduce(
          (acc: Record<string, any[]>, att: any) => {
            if (!acc[att.userId]) acc[att.userId] = [];
            acc[att.userId].push(att);
            return acc;
          },
          {}
        );

        const combined = userRes.map((user: any) => ({
          ...user,
          records: userAttendanceMap[user._id] || [],
        }));

        setUsers(combined);
        setAttendance(attendanceRes);
      } catch (err) {
        console.error("❌ Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, month]); // 🔁 refetch setiap kali bulan/tahun berubah


  const headers = headersConfig[activePage] || [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const isPiket = activePage === "Piket";

  const daysArray = isPiket
    ? Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`)
    : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const headerKeyMap: Record<string, string> = {
    NIM: "nim",
    Nama: "name",
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
      {/* 🔹 Menubar */}
      {showMenu && (
        <Menubar
          menus={Object.keys(headersConfig)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <div className="flex">
        {/* 🔹 Kolom kiri (NIM, Nama) */}
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((row, i) => (
                <TableRow key={i} className="h-[48px]">
                  {headers.map((header, j) => {
                    const key = headerKeyMap[header] || header.toLowerCase();
                    let value = row[key] ?? "-";

                    // Ambil hanya nama depan
                    if (header === "Nama" && typeof value === "string") {
                      value = value.split(" ")[0];
                    }

                    return <TableCell key={j}>{value}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 🔹 Kolom tengah (Tanggal) */}
        <div className="overflow-x-auto max-w-[960px]">
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day, i) => (
                  <TableHead key={i} className="text-center w-[115px] min-w-[115px]">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((row, i) => (
                <TableRow key={i} className="h-[48px]">
                  {daysArray.map((day, j) => (
                    <TableCell key={j} className="text-center w-[115px] min-w-[115px]">
                      {renderCellContent(
                        activePage,
                        day,
                        i,
                        users,
                        checkedState,
                        onToggle
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 🔹 Kolom kanan (Total) */}
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, i) => {
                const totalPresent =
                  user.records?.filter((r: any) => r.status === "present").length ?? 0;
                return (
                  <TableRow key={i} className="h-[48px]">
                    <TableCell className="text-center">{totalPresent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default OperationalTable;
