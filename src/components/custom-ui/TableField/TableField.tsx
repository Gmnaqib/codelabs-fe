"use client";

import React from "react";
import {
  operasional,
  report,
  attendance,
  scoring,
  organization,
  members,
} from "./headerConfig";
import { useTableLogic } from "./useTableLogic";

import ReportTable from "./TableSection/ReportTable";
import AttendanceTable from "./TableSection/AttendanceTable";
import ScoringTable from "./TableSection/ScoringTable";
import OperationalTable from "./TableSection/OperationalTable";
import OrganizationSummaryTable from "./TableSection/OrganizationSummary";
import AssessmentsTable from "./TableSection/AssessmentsTable"; // ⬅️ pastikan sudah dibuat
import MembersTable from "./TableSection/MembersTable";

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
  search?: string;
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
    isAssessments,
    isMembers,
    checkedState,
    researchData,
    handleToggleCheckbox,
  } = useTableLogic(activePage, month, year, data, onPageChange);

  // Tentukan header tabel
  let headersConfig: Record<string, string[]> =
    isReport
      ? report
      : isAttendance
      ? attendance
      : isScoring
      ? scoring
      : isOrganization
      ? organization
      : isAssessments
      ? members
      : customHeaderConfig ?? operasional;

  // Filter data (khusus report)
  const filteredData = researchData.filter((item: any) => {
    const date = new Date(item.createdAt);

    const matchMonth = date.getMonth() + 1 === month;
    const matchYear = date.getFullYear() === year;

    const matchWeek =
      filterWeek === "All" || `Week ${item.week}` === filterWeek;

    const matchProgress =
      filterProgress === "All" ||
      item.progress.toLowerCase() === filterProgress.toLowerCase();

    return matchMonth && matchYear && matchWeek && matchProgress;
  });


  // == RENDER ==

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
      searchQuery={searchQuery}
      month={month}     
      year={year}      
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

  if (isAssessments)
    return (
      <AssessmentsTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data}
      />
    );

  if (isMembers)
    return (
      <MembersTable
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
