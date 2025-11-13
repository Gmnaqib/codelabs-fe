"use client";

import FilterMonth from "@/components/custom-ui/FilterMonth";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { getTodayLeaveRequests } from "@/services/attendance/attendanceService";
import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("Permissions");
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaveData() {
      try {
        const result = await getTodayLeaveRequests();
        setLeaveData(result);
      } catch (error) {
        console.error("❌ Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaveData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="font-bold text-2xl">October 2025</p>
          <p className="text-ring text-sm">
            Please fill out each <span className="font-bold">member's permission</span>
          </p>
        </div>

        {/* Filter & Search */}
        <div className="flex justify-between items-center">
          <InputField type="string" placeholder="Search by Name" />
          <FilterMonth />
        </div>

        {/* Tabel */}
        {loading ? (
          <Card className="p-6 text-center">Loading data...</Card>
        ) : (
          <TableField
            activePage={activePage}
            onPageChange={setActivePage}
            showMenu={true}
            data={activePage === "Permissions" ? leaveData : []}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Attendance;
