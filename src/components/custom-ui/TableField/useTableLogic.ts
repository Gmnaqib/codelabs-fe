"use client";

import { useEffect, useState } from "react";
import { 
  getOperationalRecords, 
  createOperationalRecord, 
  deleteOperationalRecord 
} from "@/services/operational/operationalService";
import { getAllResearchRecords } from "@/services/research/researchService";

export const useTableLogic = (activePage: string, month: number, year: number, data: any[]) => {
  const [isReport, setIsReport] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [researchData, setResearchData] = useState<any[]>([]);

  // === GET Research ===
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await getAllResearchRecords();
        setResearchData(res);
      } catch (e) {
        console.error("Gagal ambil data research:", e);
      }
    };
    fetchResearch();
  }, []);

  // === GET Operational ===
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

  // === Toggle Checkbox ===
  const handleToggleCheckbox = async (page: string, rowIndex: number, day: string | number) => {
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

  // === Halaman aktif ===
  useEffect(() => {
    const norm = (activePage ?? "").trim().toLowerCase();
    setIsReport(norm === "report" || window?.location.pathname.includes("/report"));
    setIsAttendance(norm === "attendance" || window?.location.pathname.includes("/attendance"));
    setIsScoring(norm === "scoring" || window?.location.pathname.includes("/scoring"));
  }, [activePage]);

  return {
    isReport,
    isAttendance,
    isScoring,
    checkedState,
    recordIds,
    researchData,
    handleToggleCheckbox,
  };
};
