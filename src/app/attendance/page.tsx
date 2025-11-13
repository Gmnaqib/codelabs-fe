"use client";

import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";
import InputField from "@/components/custom-ui/InputField";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import React, { useState } from "react";

const Attendance = () => {
  const [activePage, setActivePage] = useState<string>("Permissions");
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-based
  });
  const [search, setSearch] = useState("");

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
