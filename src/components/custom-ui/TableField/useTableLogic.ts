"use client";

import { useEffect, useState } from "react";
import {
  getOperationalRecords,
  createOperationalRecord,
  deleteOperationalRecord,
} from "@/services/operational/operationalService";
import { getMeResearchRecords } from "@/services/research/researchService";
import { getAllUsers } from "@/services/users/userService";

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
  const [isMembers, setIsMembers] = useState(false);
  const [isRistek, setIsRistek] = useState(false);

  // ✅ Tambahan untuk Assessments
  const [isAssessments, setIsAssessments] = useState(false);

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [researchData, setResearchData] = useState<any[]>([]);

  // === 🔹 FETCH RESEARCH DATA ===
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

  // === 🔹 FETCH OPERATIONAL (Tematik) ===
  useEffect(() => {
    const fetchOperational = async () => {
      if (activePage.toLowerCase() !== "tematik") return;

      try {
        const users = await getAllUsers();
        const records = await getOperationalRecords("thematic");

        const checked: Record<string, boolean> = {};
        const ids: Record<string, string> = {};

        records.forEach((r: any) => {
          const day = new Date(r.date).getDate();
          const key = `Tematik-${r.userId}-${day}`;
          checked[key] = true;
          ids[key] = r._id;
        });

        setCheckedState(checked);
        setRecordIds(ids);
        setResearchData(users);
      } catch (e) {
        console.error("❌ Error fetching Tematik data:", e);
      }
    };

    fetchOperational();
  }, [activePage]);

  // === 🔹 HANDLE CHECKBOX TOGGLE ===
  const handleToggleCheckbox = async (
    page: string,
    rowIndex: number,
    day: string | number
  ) => {
    const user = researchData[rowIndex];
    if (!user) return;

    const key = `${page}-${user._id}-${day}`;
    const current = checkedState[key] ?? false;
    setCheckedState((prev) => ({ ...prev, [key]: !current }));

    if (page === "Tematik") {
      const targetDate = new Date(year, month - 1, Number(day));
      const isoDate = targetDate.toISOString();

      if (!current) {
        try {
          const res = await createOperationalRecord(
            user._id,
            "thematic",
            isoDate
          );
          setRecordIds((prev) => ({ ...prev, [key]: res.data._id }));
        } catch (e) {
          console.error("❌ Error membuat record thematic:", e);
        }
      } else {
        const id = recordIds[key];
        if (!id) return;

        try {
          await deleteOperationalRecord(id);
          setRecordIds((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
          });
        } catch (e) {
          console.error("❌ Gagal menghapus record:", e);
        }
      }
    }
  };

  // === 🔹 KLASIFIKASI HALAMAN ===
  useEffect(() => {
    const norm = (activePage ?? "").trim().toLowerCase();
    const path =
      typeof window !== "undefined"
        ? window.location.pathname.toLowerCase()
        : "";

    const map: Record<string, string> = {
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
      assessments: "assessments",
      members: "members",
    };

    const category =
      map[norm] ||
      (path.includes("/assessments")
        ? "assessments"
        : path.includes("/report")
        ? "report"
        : path.includes("/attendance")
        ? "attendance"
        : path.includes("/scoring")
        ? "scoring"
        : path.includes("/organization")
        ? "organization"
        : path.includes("/ristek")
        ? "ristek"
        : "operasional");

    setIsReport(category === "report");
    setIsAttendance(category === "attendance");
    setIsScoring(category === "scoring");
    setIsOrganization(category === "organization");
    setIsAssessments(category === "assessments");
    setIsMembers(category === "members");
    setIsRistek(category === "ristek");

    if (category === "organization" && norm === "organization") {
      onPageChange("Attendance");
    }

    if (category === "attendance" && norm === "attendance") {
      onPageChange("Permissions");
    }
  }, [activePage]);

  return {
    isReport,
    isAttendance,
    isScoring,
    isOrganization,
    isMembers,
    isRistek,
    isAssessments,
    checkedState,
    recordIds,
    researchData,
    handleToggleCheckbox,
  };
};
