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
  products,
  points,
  pointsdetail,
} from "./headerConfig";
import { useTableLogic } from "./useTableLogic";

import OrganizationSummaryTable from "./TableSection/OrganizationSummary";
import AssessmentsTable from "./TableSection/AssessmentsTable"; 
import MembersTable from "./TableSection/MembersTable";
import RistekTable from "./TableSection/RistekTable";
import CompetitionTable from "./TableSection/CompetitionTable";
import BrandingTable from "./TableSection/BrandingTable";
import { TabelFieldProps, TableFieldDataItem } from "@/types/TableFieldProps";
import OperationalTable from "./TableSection/OperationalTable";
import AttendanceTable from "./TableSection/AttendanceTable";
import PicketScheduleTable from "./TableSection/PicketScheduleTable/page";
import ReportTable from "./TableSection/ReportTable/page";
import { ResearchItem } from "@/types/ReportTableProps";
import ProductsTable from "./TableSection/ProductsTable/page";
import PointsTable from "./TableSection/PointsTable/page";
import PointsDetailTable from "./TableSection/PointsDetailTable/page";
import ScoringTable from "./TableSection/ScoringTable";

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
  filterContentType = "All",
  searchQuery = "",
  filterRole = "All Role",
  filterSubriset = "All SubRiset",
  filterStatus = "All Status",
  fetchTrigger,
  onEditItem,
}: TabelFieldProps<T> & { filterContentType?: string, filterRole?: string, filterSubriset?: string, filterStatus?: string, fetchTrigger?: number }) => {
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
    isProducts,
    isPoints,
    isPointsDetail,
    checkedState,
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
      ? products
      : isProducts
      ? points
      : isPoints
      ? members
      : customHeaderConfig ?? operasional;

  if (isReport)
    return (
      <ReportTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        month={month}
        year={year}
        filterWeek={filterWeek}
        filterProgress={filterProgress}
        fetchTrigger={fetchTrigger}
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
        searchQuery={searchQuery}
        month={month}
        year={year}
      />
    );

  if (isMembers)
    return (
      <MembersTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        data={data as MembersItem[]}
        filterRole={filterRole}
        filterSubriset={filterSubriset}
        filterStatus={filterStatus}
      />
    );

  if (isRistek)
    return (
      <RistekTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        searchQuery={searchQuery}
        filterContentType={filterContentType}
        filterWeek={filterWeek}
        month={month}
        year={year}
      />
    );

  if (isCompetition)
    return (
      <CompetitionTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        month={month}
        year={year}
        searchQuery={searchQuery}
      />
    );

  if (isBranding)
    return (
      <BrandingTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        filterWeek={filterWeek}
        filterContentType={filterContentType}
        searchQuery={searchQuery}
        month={month}
        year={year}
      />
    );

  if (isPicketSchedule)
    return (
      <PicketScheduleTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={false}
        fetchTrigger={fetchTrigger}
      />
    );

  if (isProducts)
    return (
      <ProductsTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={false}
        searchQuery={searchQuery}
        fetchTrigger={fetchTrigger}
      />
    );

  if (isPoints)
    return (
      <PointsTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={false}
        searchQuery={searchQuery}
        fetchTrigger={fetchTrigger}
        onEdit={onEditItem}
      />
    );

  if (isPointsDetail)
    return (
      <PointsDetailTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={false}
        searchQuery={searchQuery}
        fetchTrigger={fetchTrigger}
        onEdit={onEditItem}
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
