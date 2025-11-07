"use client";

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
import {
  createOperationalRecord,
  deleteOperationalRecord,
  getOperationalRecords,
} from "@/services/operational/operationalService";
import { getAllResearchRecords } from "@/services/research/researchService";

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
  data = [{ NIM: "", Nama: "", _id: "", records: [] }],
}: TableFieldProps) => {
  const [isReport, setIsReport] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
   const [researchData, setResearchData] = useState<any[]>([]);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllResearchRecords();
        setResearchData(data);
      } catch (error) {
        console.error("Gagal mengambil data research:", error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
  const fetchRecords = async () => {
    if (activePage !== "Tematik") return;

    try {
      const allRecords = await getOperationalRecords("thematic");

      const newChecked: Record<string, boolean> = {};
      const newRecordIds: Record<string, string> = {};

      allRecords.forEach((record: any) => {
        const date = new Date(record.date);
        const day = date.getDate();
        const key = `Tematik-${record.userId}-${day}`;

        newChecked[key] = true;
        newRecordIds[key] = record._id; 
      });

      setCheckedState(newChecked);
      setRecordIds(newRecordIds);
    } catch (error) {
      console.error("❌ Error fetching operational records:", error);
    }
  };

  fetchRecords();
}, [activePage]);


  const handleToggleCheckbox = async (
  page: string,
  rowIndex: number,
  day: string | number
) => {
  const user = data[rowIndex];
  const key = `${page}-${user._id}-${day}`;
  const currentlyChecked = checkedState[key] ?? false;

  setCheckedState((prev) => ({
    ...prev,
    [key]: !currentlyChecked,
  }));

  if (page === "Tematik" && !currentlyChecked) {
    const targetDate = new Date(year, month - 1, Number(day));
    const isoDate = targetDate.toISOString();

    try {
      const response = await createOperationalRecord(user._id!, "thematic", isoDate);
      console.log("✅ Record dibuat:", response);

      setRecordIds((prev) => ({
        ...prev,
        [key]: response.data._id,
      }));
    } catch (error) {
      console.error("❌ Error membuat record thematic:", error);
    }
  }

  if (page === "Tematik" && currentlyChecked) {
    const recordId = recordIds[key];
    if (!recordId) {
      console.error("Record ID tidak ditemukan untuk", key);
      return;
    }

    try {
      await deleteOperationalRecord(recordId);
      console.log("🗑️ Record dihapus:", recordId);

      setRecordIds((prev) => {
        const newMap = { ...prev };
        delete newMap[key];
        return newMap;
      });
    } catch (error) {
      console.error("❌ Gagal menghapus record:", error);
    }
  }
};

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
            {researchData.length > 0 ? (
              researchData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">{item.title}</TableCell>
                  <TableCell className="text-center">{`Week ${item.week}`}</TableCell>
                  <TableCell className="text-center">{item.progress}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex gap-3 justify-center">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Detail
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={reportHeaders.length}
                  className="text-center py-6"
                >
                  Tidak ada data research
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (isAttendance) {
  const attendanceHeaders = attendance[activePage] ?? [];

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {showMenu && (
        <Menubar
          menus={Object.keys(attendance)}
          activeMenu={activePage}
          onChange={onPageChange}
        />
      )}

      <div className="flex items-center w-full px-3 gap-3 bg-white pt-5">
        <p className="font-bold text-xl">Today</p>
        <p className="text-primary font-bold text-sm cursor-pointer">Hide</p>
      </div>

      <Table className="w-full">
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
              {data.map((row, i) => (
                <TableRow key={i}>
                  {daysArray.map((day, index) => {
                    const key = `${activePage}-${row._id}-${day}`;
                    return (
                      <TableCell
                        key={index}
                        className={`text-center ${
                          activePage === "Piket"
                            ? ""
                            : "w-[115px] min-w-[115px]"
                        }`}
                      >
                        {renderCellContent(
                          activePage,
                          day,
                          i,
                          data,
                          checkedState,
                          handleToggleCheckbox
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
