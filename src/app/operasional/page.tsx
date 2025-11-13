"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import TableField from "@/components/custom-ui/TableField/TableField";
import InputField from "@/components/custom-ui/InputField";
import ProtectedRoute from "@/features/login/components/ProtectedRoute";
import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";

const Operasional = () => {
  const [activePage, setActivePage] = useState("Absensi");

  // ⏰ State untuk menyimpan bulan dan tahun terpilih
  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(), // 0-based (0 = Jan)
  });

  return (
    <ProtectedRoute>
      <div>
        <Card>
          <div className="flex gap-7">
            <InputField type="string" placeholder="Search by NIM or Name" />
            <CalendarMonthYearPicker
              onChange={(val) => {
                console.log("📅 Selected:", val);
                setSelectedDate(val);
              }}
              defaultYear={selectedDate.year}
              defaultMonth={selectedDate.month}
            />
          </div>

          <div className="mt-4 px-5">
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              // ⏩ kirim ke TableField
              month={selectedDate.month + 1} // ubah ke 1-based untuk backend
              year={selectedDate.year}
            />
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default Operasional;
