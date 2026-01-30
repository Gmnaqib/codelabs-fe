"use client";

import React from "react";
import {
  operasional,
  report,
  attendance,
  scoring,
  organization,
  members,
  ristek,
} from "./headerConfig";
import { useTableLogic } from "./useTableLogic";

import ScoringTable from "./TableSection/ScoringTable";
import OrganizationSummaryTable from "./TableSection/OrganizationSummary";
import AssessmentsTable from "./TableSection/AssessmentsTable"; 
import MembersTable from "./TableSection/MembersTable";
import RistekTable from "./TableSection/RistekTable";
import CompetitionTable from "./TableSection/CompetitionTable";
import BrandingTable from "./TableSection/BrandingTable";
import { TabelFieldProps, TableFieldDataItem } from "@/types/TableFieldProps";

// Inline AssessmentItem type (from AssessmentsTable)
type AssessmentItem = {
  rank?: number | string;
  name?: string;
  monthly?: number | string;
  status?: string;
  detail?: string;
};
type MembersItem = {
  _id: string;
  nim?: string;
  name?: string;
  email?: string;
  subriset?: string;
  role?: string;
  status?: string;
};
type OrganizationUser = {
  _id: string;
  [key: string]: unknown;
};
import OperationalTable from "./TableSection/OperationalTable";
import AttendanceTable from "./TableSection/AttendanceTable";
import PicketScheduleTable from "./TableSection/PicketScheduleTable/page";
import ReportTable from "./TableSection/ReportTable/page";
import { ResearchItem } from "@/types/ReportTableProps";

type KnownTableTypes = ResearchItem | MembersItem | OrganizationUser | AssessmentItem | TableFieldDataItem;
const TableField = <T extends KnownTableTypes = TableFieldDataItem>({
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
}: TabelFieldProps<T>) => {
  const {
    isReport,
    isAttendance,
    isScoring,
    isOrganization,
    isAssessments,
    isMembers,
    isRistek,
    isCompetition,
    isBranding,
    isPicketSchedule,
    checkedState,
    researchData,
    handleToggleCheckbox,
  } = useTableLogic(activePage, month, year, data, onPageChange);

  const headersConfig: Record<string, string[]> =
      isReport
      ? report
      : isAttendance
      ? attendance
      : isScoring
      ? scoring
      : isOrganization
      ? organization
      : isAssessments
      ? ristek
      : isRistek
      ? members
      : customHeaderConfig ?? operasional;

  
  const filteredData = (researchData as ResearchItem[]).filter((item) => {
    const date = new Date(item.createdAt);
    const matchMonth = date.getMonth() + 1 === month;
    const matchYear = date.getFullYear() === year;
    const matchWeek = filterWeek === "All" || `Week ${item.week}` === filterWeek;
    const matchProgress = filterProgress === "All" || item.progress.toLowerCase() === filterProgress.toLowerCase();

    return matchMonth && matchYear && matchWeek && matchProgress;
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
        data={data as OrganizationUser[]}
        month={String(month).padStart(2, '0')}
        year={String(year)}
        searchQuery={searchQuery}
      />
    );

  if (isAssessments)
    return (
      <AssessmentsTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data as AssessmentItem[]}
      />
    );

  if (isMembers)
    return (
      <MembersTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data as MembersItem[]}
      />
    );

  if (isRistek)
    return (
      <RistekTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
      />
    );

  if (isCompetition)
    return (
      <CompetitionTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
      />
    );

  if (isBranding)
    return (
      <BrandingTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
      />
    );

  if (isPicketSchedule)
    return (
      <PicketScheduleTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={false}
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
