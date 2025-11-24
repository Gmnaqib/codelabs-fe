"use client";

import { useEffect, useState } from "react";
import {
  getOperationalRecords,
  createOperationalRecord,
  deleteOperationalRecord,
} from "@/services/operational/operationalService";
import { getMeResearchRecords } from "@/services/research/researchService";
import { getAllUsers } from "@/services/users/userService";

// Mapping Week → Date (KHUSUS PIKET)
const WEEK_TO_DATE: Record<number, number> = {
  1: 1,
  2: 8,
  3: 15,
  4: 22,
  5: 29,
};

// Helper: tanggal berdasarkan halaman
const getDateNumber = (page: string, day: number) => {
  return page.toLowerCase() === "piket"
    ? WEEK_TO_DATE[day] // pakai mapping
    : day;              // tematik → normal
};

export const useTableLogic = (
  activePage: string,
  month: number,
  year: number,
  data: any[],
  onPageChange: (page: string) => void
) => {
  // ===== STATE KATEGORI =====
  const [isReport, setIsReport] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [isOrganization, setIsOrganization] = useState(false);
  const [isMembers, setIsMembers] = useState(false);
  const [isRistek, setIsRistek] = useState(false);
  const [isCompetition, setIsCompetition] = useState(false);
  const [isBranding, setIsBranding] = useState(false);
  const [isAssessments, setIsAssessments] = useState(false);

  // ===== STATE DATA =====
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [researchData, setResearchData] = useState<any[]>([]);

  // ===== GET DATA RESEARCH =====
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await getMeResearchRecords();
        const result = Array.isArray(res) ? res : res.data ?? [];
        setResearchData(result);
      } catch (e) {
        console.error("❌ Gagal ambil data research:", e);
      }
    };

    fetchResearch();
  }, []);

  // ===== GET DATA TEMATIK & PIKET =====
  useEffect(() => {
    const fetchOperational = async () => {
      const page = activePage.toLowerCase();
      if (page !== "tematik" && page !== "piket") return;

      try {
        const users = await getAllUsers();
        const type = page === "tematik" ? "thematic" : "picket";

        const records = await getOperationalRecords(type);

        const filtered = records.filter((r: any) => {
          const d = new Date(r.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        const checked: Record<string, boolean> = {};
        const ids: Record<string, string> = {};

        filtered.forEach((r: any) => {
          const date = new Date(r.date).getDate();
          let key = "";

          // PIKET menggunakan mapping week → date
          if (page === "piket") {
            const week = Object.entries(WEEK_TO_DATE).find(
              ([, d]) => d === date
            )?.[0];
            if (!week) return;

            key = `${activePage}-${r.userId}-${week}`;
          }

          // TEMATIK menggunakan tanggal normal (1–31)
          else if (page === "tematik") {
            key = `${activePage}-${r.userId}-${date}`;
          }

          checked[key] = true;
          ids[key] = r._id;
        });

        setCheckedState(checked);
        setRecordIds(ids);
        setResearchData(users);
      } catch (e) {
        console.error(`❌ Error fetching ${activePage} data:`, e);
      }
    };

    fetchOperational();
  }, [activePage, month, year]);

  // ===== TOGGLE CHECKBOX =====
  const handleToggleCheckbox = async (
    page: string,
    rowIndex: number,
    day: number | string
  ) => {
    const user = researchData[rowIndex];
    if (!user) return;

    const key = `${page}-${user._id}-${day}`;
    const current = checkedState[key] ?? false;

    // Update UI state
    setCheckedState(prev => ({ ...prev, [key]: !current }));

    const type =
      page.toLowerCase() === "tematik"
        ? "thematic"
        : page.toLowerCase() === "piket"
        ? "picket"
        : null;

    if (!type) return;

    // HASH: dapatkan tanggal sesuai page
    const dateNumber = getDateNumber(page, Number(day));

    const targetDate = new Date(year, month - 1, dateNumber);
    targetDate.setHours(0, 0, 0, 0);

    // CREATE RECORD
    if (!current) {
      const res = await createOperationalRecord(
        user._id,
        type,
        targetDate.toISOString()
      );

      setRecordIds(prev => ({ ...prev, [key]: res.data._id }));
    }

    // DELETE RECORD
    else {
      const id = recordIds[key];
      if (!id) return;

      await deleteOperationalRecord(id);

      setRecordIds(prev => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  // ===== KATEGORI DETECTION =====
  useEffect(() => {
    const norm = activePage.toLowerCase();

    setIsReport(norm === "report");
    setIsAttendance(norm === "attendance");
    setIsScoring(norm === "scoring");
    setIsOrganization(norm === "organization");
    setIsAssessments(norm === "assessments");
    setIsMembers(norm === "members");
    setIsRistek(norm === "ristek");
    setIsCompetition(norm === "competition");
    setIsBranding(norm === "branding");
  }, [activePage]);

  return {
    isReport,
    isAttendance,
    isScoring,
    isOrganization,
    isMembers,
    isRistek,
    isCompetition,
    isBranding,
    isAssessments,
    checkedState,
    recordIds,
    researchData,
    handleToggleCheckbox,
  };
};
