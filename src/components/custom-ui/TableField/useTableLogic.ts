"use client";

import { useEffect, useState } from "react";
import {
  getOperationalRecords,
  createOperationalRecord,
  deleteOperationalRecord,
} from "@/services/operational/operationalService";
import { getAllResearchRecords } from "@/services/research/researchService";

export const useTableLogic = (
  activePage: string,
  month: number,
  year: number,
  data: any[],
  onPageChange: (page: string) => void
) => {
  const [isReport, setIsReport] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [researchData, setResearchData] = useState<any[]>([]);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await getAllResearchRecords();
        setResearchData(res);
      } catch (e) {
        console.error("❌ Gagal ambil data research:", e);
      }
    };
    fetchResearch();
  }, []);

  useEffect(() => {
    const fetchOperational = async () => {
      if (activePage !== "Tematik") return;
      try {
        const allRecords = await getOperationalRecords("thematic");
        const checked: Record<string, boolean> = {};
        const ids: Record<string, string> = {};

        allRecords.forEach((r: any) => {
          const d = new Date(r.date);
          const day = d.getDate();
          const key = `Tematik-${r.userId}-${day}`;
          checked[key] = true;
          ids[key] = r._id;
        });

        setCheckedState(checked);
        setRecordIds(ids);
      } catch (e) {
        console.error("❌ Error fetching operational records:", e);
      }
    };
    fetchOperational();
  }, [activePage]);

  const handleToggleCheckbox = async (
    page: string,
    rowIndex: number,
    day: string | number
  ) => {
    const user = data[rowIndex];
    const key = `${page}-${user._id}-${day}`;
    const current = checkedState[key] ?? false;

    setCheckedState((p) => ({ ...p, [key]: !current }));

    if (page === "Tematik") {
      const targetDate = new Date(year, month - 1, Number(day));
      const isoDate = targetDate.toISOString();

      if (!current) {
        try {
          const res = await createOperationalRecord(user._id!, "thematic", isoDate);
          setRecordIds((p) => ({ ...p, [key]: res.data._id }));
        } catch (e) {
          console.error("❌ Error membuat record thematic:", e);
        }
      } else {
        const id = recordIds[key];
        if (!id) return console.error("Record ID tidak ditemukan:", key);
        try {
          await deleteOperationalRecord(id);
          setRecordIds((p) => {
            const newMap = { ...p };
            delete newMap[key];
            return newMap;
          });
        } catch (e) {
          console.error("❌ Gagal menghapus record:", e);
        }
      }
    }
  };

useEffect(() => {
  const norm = (activePage ?? "").trim().toLowerCase();
  const currentPath = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

  const categoryMap: Record<string, string> = {
    report: "report",

    attendance: "organization",
    researchpoints: "organization",

    organization: "organization",

    permissions: "attendance",
    totalattendance: "attendance",

    scoring: "scoring",
    research: "scoring",
    competition: "scoring",
    operational: "scoring",
    branding: "scoring",

    absensi: "operasional",
    tematik: "operasional",
    piket: "operasional",
  };

  const category =
    categoryMap[norm] ||
    (currentPath.includes("/report") ? "report" :
    currentPath.includes("/attendance") ? "attendance" :
    currentPath.includes("/scoring") ? "scoring" :
    currentPath.includes("/organization") ? "organization" :
    "operasional");

  setIsReport(category === "report");
  setIsAttendance(category === "attendance");
  setIsScoring(category === "scoring");
  setIsOrganization(category === "organization");
  if (category === "organization" && activePage.toLowerCase() === "organization") {
    onPageChange("Attendance"); 
  }

  if (category === "attendance" && activePage.toLowerCase() === "attendance") {
    onPageChange("Permissions"); 
  }
}, [activePage]);


  return {
    isReport,
    isAttendance,
    isScoring,
    isOrganization,
    checkedState,
    recordIds,
    researchData,
    handleToggleCheckbox,
  };
};
