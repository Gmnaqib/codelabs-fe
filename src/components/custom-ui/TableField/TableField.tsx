"use client";

import React from "react";
import { operasional, report, attendance, scoring, organization } from "./headerConfig";
import { useTableLogic } from "./useTableLogic";
import ReportTable from "./TableSection/ReportTable";
import AttendanceTable from "./TableSection/AttendanceTable";
import ScoringTable from "./TableSection/ScoringTable";
import OperationalTable from "./TableSection/OperationalTable";
import OrganizationSummaryTable from "./TableSection/OrganizationSummary";

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  month?: number;
  year?: number;
  data?: any[];
  customHeaderConfig?: Record<string, string[]>;
  showMenu?: boolean;
  filterWeek?: string;
  filterProgress?: string;
  searchQuery?: string;
}

const TableField = ({
  activePage,
  onPageChange,
  customHeaderConfig,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  data = [],
  showMenu = true,
  filterWeek = "All",
  filterProgress = "All",
  searchQuery = "",
}: Props) => {
  const {
    isReport,
    isAttendance,
    isScoring,
    isOrganization,
    checkedState,
    researchData,
    handleToggleCheckbox,
  } = useTableLogic(activePage, month, year, data, onPageChange);

  let headersConfig: Record<string, string[]> =
    isReport
      ? report
      : isAttendance
      ? attendance
      : isScoring
      ? scoring
      : isOrganization
      ? organization
      : customHeaderConfig ?? operasional;

  const filteredData = researchData.filter((item: any) => {
    const matchWeek = filterWeek === "All" || `Week ${item.week}` === filterWeek;
    const matchProgress =
      filterProgress === "All" ||
      item.progress.toLowerCase() === filterProgress.toLowerCase();
    return matchWeek && matchProgress;
  });

  if (isReport)
    return (
      <ReportTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        researchData={filteredData}
      />
    );

  if (isAttendance)
    return (
      <AttendanceTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data}
      />
    );

  if (isScoring)
    return (
      <ScoringTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data}
      />
    );

  if (isOrganization)
    return (
      <OrganizationSummaryTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data}
      />
    );

  return (
    <OperationalTable
      activePage={activePage}
      onPageChange={onPageChange}
      showMenu={showMenu}
      month={month}
      year={year}
      headersConfig={headersConfig}
      checkedState={checkedState}
      onToggle={handleToggleCheckbox}
      searchQuery={searchQuery}
    />
  );
};

export default TableField;
