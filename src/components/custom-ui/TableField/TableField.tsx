"use client";

import React from "react";
import { Menubar } from "../MenuBar";
import { operasional, report, attendance, scoring } from "./headerConfig";
import { useTableLogic } from "./useTableLogic";
import AttendanceTable from "./TableSection/AttendanceTable";
import ScoringTable from "./TableSection/ScoringTable";
import OperationalTable from "./TableSection/OperationalTable";
import ReportTable from "./TableSection/ReportTable";

interface Props {
  activePage: string;
  onPageChange: (menu: string) => void;
  month?: number;
  year?: number;
  data?: any[];
  customHeaderConfig?: Record<string, string[]>;
  showMenu?: boolean;
}

const TableField = ({
  activePage,
  onPageChange,
  customHeaderConfig,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  data = [],
  showMenu = true,
}: Props) => {
  const {
    isReport,
    isAttendance,
    isScoring,
    checkedState,
    researchData,
    handleToggleCheckbox,
  } = useTableLogic(activePage, month, year, data);

  // Tentukan konfigurasi header
  let headersConfig: Record<string, string[]> =
    isReport ? report :
    isAttendance ? attendance :
    isScoring ? scoring :
    customHeaderConfig ?? operasional;

  if (isReport)
    return (
      <ReportTable
        activePage={activePage}
        onPageChange={onPageChange}
        showMenu={showMenu}
        researchData={researchData}
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

  return (
    <OperationalTable
      activePage={activePage}
      onPageChange={onPageChange}
      showMenu={showMenu}
      month={month}
      year={year}
      headersConfig={headersConfig}
      data={data}
      checkedState={checkedState}
      onToggle={handleToggleCheckbox}
    />
  );
};

export default TableField;
