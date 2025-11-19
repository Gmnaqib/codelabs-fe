"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import TableField from "@/components/custom-ui/TableField/TableField";
import InputField from "@/components/custom-ui/InputField";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";

const Operasional = () => {
  const [activePage, setActivePage] = useState("Absensi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-indexed
  });

  return (
    <ProtectedRoute>
      <div>
        <Card>
          {/* 🔍 Filter Section */}
          <div className="flex gap-7 px-5 py-4 items-center">
            <InputField
              type="text"
              placeholder="Search by NIM or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <CalendarMonthYearPicker
              onChange={(val) => {
                setSelectedDate(val);
              }}
              defaultYear={selectedDate.year}
              defaultMonth={selectedDate.month}
            />
          </div>
          {/* 📊 Table Section */}
          <div className="px-5">
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              month={selectedDate.month + 1}
              year={selectedDate.year}
              searchQuery={searchQuery}
            />
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Operasional;
