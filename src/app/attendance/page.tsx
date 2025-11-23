"use client";

import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";
import CardField from "@/components/custom-ui/CardField";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { BsFillPeopleFill } from "react-icons/bs";
import { getAttendanceSummary } from "@/services/attendance/attendanceService"; // ✅ import API

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("Permissions");
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-based
  });
  const [search, setSearch] = useState("");
  const [summary, setSummary] = useState<any>(null); // ✅ state untuk summary
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await getAttendanceSummary();
        setSummary(res);
      } catch (err) {
        console.error("❌ Error fetching attendance summary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const totalPresent =
    summary?.reduce((acc: number, u: any) => acc + (u.counts?.present ?? 0), 0) ?? 0;
  const totalPermit =
    summary?.reduce((acc: number, u: any) => acc + (u.counts?.leave ?? 0), 0) ?? 0;
  const totalSick =
    summary?.reduce((acc: number, u: any) => acc + (u.counts?.sick ?? 0), 0) ?? 0;
  const totalLate =
    summary?.reduce((acc: number, u: any) => acc + (u.counts?.late ?? 0), 0) ?? 0;
  const totalAbsent =
    summary?.reduce((acc: number, u: any) => acc + (u.counts?.absent ?? 0), 0) ?? 0;
  const totalOverall =
    totalPresent + totalPermit + totalSick + totalLate + totalAbsent;

  return (
    <ProtectedRoute>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="font-bold text-2xl">
            {new Date(selectedDate.year, selectedDate.month).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="text-ring text-sm">
            Please fill out each <span className="font-bold">member's permission</span>
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-5">
          <CardField title="Total Report" icon={<BsFillPeopleFill size={22} />} noGap>
            <p className="text-[#00D0FF] font-bold text-3xl">
              {loading ? "..." : totalOverall}
            </p>
          </CardField>
          <CardField title="Permit" noGap>
            <p className="font-bold text-3xl">{loading ? "..." : totalPermit}</p>
          </CardField>
          <CardField title="Sick" noGap>
            <p className="font-bold text-3xl">{loading ? "..." : totalSick}</p>
          </CardField>
          <CardField title="Late Arrivals" noGap>
            <p className="font-bold text-3xl">{loading ? "..." : totalLate}</p>
          </CardField>
          <CardField title="No Report" noGap>
            <p className="font-bold text-3xl">{loading ? "..." : totalAbsent}</p>
          </CardField>
        </div>

        {/* Filter & Search */}
        <div className="flex justify-between items-center">
          <InputField
            type="string"
            placeholder="Search by Name"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <CalendarMonthYearPicker
            onChange={(val) => setSelectedDate(val)}
            defaultYear={selectedDate.year}
            defaultMonth={selectedDate.month}
          />
        </div>

        {/* Table */}
        <TableField
          activePage={activePage}
          onPageChange={setActivePage}
          showMenu={true}
          month={selectedDate.month + 1}
          year={selectedDate.year}
          searchQuery={search}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Attendance;
