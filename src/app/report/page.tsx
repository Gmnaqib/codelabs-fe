"use client";
import { DropdownField } from "@/components/custom-ui/DropdownField";
import { TableField } from "@/components/custom-ui/TableField";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { CalendarMonthYearPicker } from "@/components/custom-ui/CalendarMonthYearPicker";
import MotionWrapper from "@/components/custom-ui/MotionWrapper";
import { useTableStore } from "@/shared/state";
import ReportForm from "@/features/report/components/ReportForm";

const WeeklyReport = () => {
  const setGlobalDateRange = useTableStore((s) => s.setDateRange);
  const [activePage, setActivePage] = useState<string>("report");
  const [filterWeek, setFilterWeek] = useState("All");
  const [filterProgress, setFilterProgress] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fetchTrigger, setFetchTrigger] = useState(0);

  return (
    <ProtectedRoute
      roles={[
        'admin',
        'minister of research',
        'minister of competition',
        'minister of branding',
        'minister of operation',
        'president',
        'vice president',
        'user',
      ]}
    >
      <MotionWrapper>
        <div className="flex flex-col w-full justify-between mb-10 md:flex-row gap-5">
          <div className="flex flex-col gap-3 md:gap-5 md:flex-row">
            <CalendarMonthYearPicker
              onChange={({ month, year }) => {
                setSelectedMonth(month + 1);
                setSelectedYear(year);
                setGlobalDateRange(month + 1, year);
              }}
            />

            <DropdownField
              key="week-filter"
              title="Week"
              menu={["All", "Week 1", "Week 2", "Week 3", "Week 4"]}
              onChange={(value) => setFilterWeek(value)}
            />

            <DropdownField
              key="progress-filter"
              title="Progress"
              menu={["All", "Finished", "Unfinished"]}
              onChange={(value) => setFilterProgress(value)}
            />
          </div>

          <div>
            <ReportForm onSuccess={() => setFetchTrigger(Date.now())} />
          </div>
        </div>
        <Card>
          <div className="p-5">
            <TableField
              activePage={activePage}
              onPageChange={setActivePage}
              showMenu={false}
              filterWeek={filterWeek}
              filterProgress={filterProgress}
              month={selectedMonth}
              year={selectedYear}
              fetchTrigger={fetchTrigger}
            />
          </div>
        </Card>
      </MotionWrapper>
    </ProtectedRoute>
  );
};

export default WeeklyReport;
