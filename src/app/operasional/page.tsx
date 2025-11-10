"use client";

import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import TableField from "@/components/custom-ui/TableField/TableField";
import InputField from "@/components/custom-ui/InputField";
import FilterMonth from "@/components/custom-ui/FilterMonth";
import { getAttendance, getUsers } from "@/services/attendance/attendanceService";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";

const Operasional = () => {
  const [activePage, setActivePage] = useState("Absensi");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attendanceData, userData] = await Promise.all([
          getAttendance(2025, 10),
          getUsers(),
        ]);
        setAttendance(attendanceData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const userAttendanceMap = attendance.reduce(
    (acc: Record<string, any[]>, att) => {
      if (!acc[att.userId]) acc[att.userId] = [];
      acc[att.userId].push(att);
      return acc;
    },
    {}
  );

  const combinedData = Object.keys(userAttendanceMap)
    .map((userId) => {
      const user = users.find((u) => u._id === userId);
      const userRecords = userAttendanceMap[userId] || [];

      return {
        _id: userId,
        NIM: user?.nim ?? "-",
        Nama: user?.name ?? "-",
        records: userRecords, 
      };
    })
    .sort((a, b) => {
      if (a.Nama < b.Nama) return -1;
      if (a.Nama > b.Nama) return 1;
      return 0;
    });

  return (
    <ProtectedRoute>
      <div>
      <Card>
        <div className="flex gap-7">
          <InputField type="string" placeholder="Search by NIM or Name" />
          <FilterMonth />
        </div>
        <div className="mt-4">
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            data={combinedData}
          />
        </div>
      </Card>
    </div>
    </ProtectedRoute>
  );
};

export default Operasional;
