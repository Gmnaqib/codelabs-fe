import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Menubar } from "../MenuBar";
import { operasional, report, attendance, scoring } from "./headerConfig";
import { renderCellContent } from "./renderCellContent";
import { Button } from "@/components/ui/button";

interface TableFieldRow {
  _id?: string;
  NIM: string;
  Nama: string;
  records?: any[];
  [key: string]: any;
}

interface TableFieldProps {
  activePage: string;
  onPageChange: (menu: string) => void;
  month?: number;
  year?: number;
  data?: TableFieldRow[];
  customHeaderConfig?: Record<string, string[]>;
  showMenu?: boolean;
  reportData?: Record<string, string>[];
}

const TableField = ({
  activePage,
  onPageChange,
  customHeaderConfig,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  showMenu = true,
  data = [
    { NIM: "23001", Nama: "Ramdani", _id: "1", records: [] },
    { NIM: "23002", Nama: "Tes", _id: "2", records: [] },
  ],
  reportData = [
    {
      "Research Plan": "Implementasi sistem absensi AI",
      Week: "Week 1",
      Progress: "50%",
    },
    {
      "Research Plan": "Integrasi API Strapi",
      Week: "Week 2",
      Progress: "70%",
    },
  ],
}: TableFieldProps) => {
  const [isReport, setIsReport] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    const normalizedActive = (activePage ?? "").toString().trim().toLowerCase();

    const checkReport =
      normalizedActive === "report" ||
      (typeof window !== "undefined" &&
        window.location.pathname.toLowerCase().includes("/report"));

    const checkAttendance =
      normalizedActive === "attendance" ||
      (typeof window !== "undefined" &&
        window.location.pathname.toLowerCase().includes("/attendance"));

    const checkScoring =
      normalizedActive === "scoring" ||
      (typeof window !== "undefined" &&
        window.location.pathname.toLowerCase().includes("/scoring"));

    setIsReport(checkReport);
    setIsAttendance(checkAttendance);
    setIsScoring(checkScoring);
  }, [activePage]);

  let headersConfig: Record<string, string[]>;

  if (isReport) {
    headersConfig = report;
  } else if (isAttendance) {
    headersConfig = attendance;
  } else if (isScoring) {
    headersConfig = scoring;
  } else {
    headersConfig = customHeaderConfig ?? operasional;
  }

  const headers = headersConfig[activePage] || [];
  const daysInMonth = new Date(year, month, 0).getDate();
  const isPiket = activePage === "Piket";

  const daysArray = isPiket
    ? Array.from({ length: 5 }, (_, i) => `Week ${i + 1}`)
    : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // === MODE REPORT ===
  if (isReport) {
    const reportKey = Object.keys(report)[0];
    const reportHeaders = report[reportKey] ?? [];

    return (
      <div className="w-full rounded-lg overflow-hidden">
        {showMenu && (
          <Menubar
            menus={Object.keys(report)}
            activeMenu={activePage}
            onChange={onPageChange}
          />
        )}

        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              {reportHeaders.map((header, id) => (
                <TableHead key={id}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((row, i) => (
              <TableRow key={i}>
                {reportHeaders.map((header, j) => (
                  <TableCell
                    key={j}
                    className="border-b w-[25%] truncate text-center"
                  >
                    {header === "Action" ? (
                      <div className="flex gap-3 justify-center">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          Detail
                        </Button>
                      </div>
                    ) : (
                      row[header] ?? "-"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // === MODE ATTENDANCE ===
  if (isAttendance) {
    const attendanceKey = Object.keys(attendance)[0];
    const attendanceHeaders = attendance[attendanceKey] ?? [];

    return (
      <div className="w-full rounded-lg overflow-hidden">
        {showMenu && (
          <Menubar
            menus={Object.keys(attendance)}
            activeMenu={activePage}
            onChange={onPageChange}
          />
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {attendanceHeaders.map((header, id) => (
                <TableHead key={id}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {attendanceHeaders.map((header, j) => (
                  <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // === MODE SCORING ===
  if (isScoring) {
    const scoringHeaders = scoring[activePage] ?? [];

    return (
      <div className="w-full rounded-lg overflow-hidden">
        {showMenu && (
          <Menubar
            menus={Object.keys(scoring)}
            activeMenu={activePage}
            onChange={onPageChange}
          />
        )}

        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              {scoringHeaders.map((header, id) => (
                <TableHead key={id}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {scoringHeaders.map((header, j) => (
                  <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // === MODE OPERASIONAL ===
  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(headersConfig)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <div className="flex">
        {/* Kolom Nama + NIM */}
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header, j) => (
                    <TableCell key={j}>{(row as any)[header] ?? "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Kolom Hari */}
        <div className="overflow-x-auto max-w-[960px]">
          <Table>
            <TableHeader>
              <TableRow>
                {daysArray.map((day, index) => (
                  <TableHead key={index} className="text-center">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i}>
                  {daysArray.map((day, index) => (
                    <TableCell
                      key={index}
                      className={`text-center ${
                        activePage === "Piket"
                          ? ""
                          : "w-[115px] min-w-[115px]"
                      }`}
                    >
                      {renderCellContent(activePage, day, i, data)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Kolom Total */}
        <div className="flex-none">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">0</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TableField;
