"use client";

import { useEffect, useState } from "react";
import {
  getOperationalRecords,
  createOperationalRecord,
  deleteOperationalRecord,
} from "@/services/operational/operationalService";
import { getAllResearchRecords } from "@/services/research/researchService";
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

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [recordIds, setRecordIds] = useState<Record<string, string>>({});
  const [researchData, setResearchData] = useState<any[]>([]);

  // === 🔹 FETCH RESEARCH DATA (selalu dijalankan sekali) ===
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const res = await getAllResearchRecords();
        // cek apakah hasil punya field data
        const result = Array.isArray(res) ? res : res.data ?? [];
        setResearchData(result);
        console.log("✅ Fetch research success:", result.length, "records");
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
        setResearchData(users); // tampilkan user untuk tematik
        console.log("✅ Fetch tematik success. Total users:", users.length);
      } catch (e) {
        console.error("❌ Error fetching Tematik data:", e);
      }
    };

    fetchOperational();
  }, [activePage]);

  // === 🔹 HANDLE CHECKBOX TOGGLE (Tematik) ===
  const handleToggleCheckbox = async (
    page: string,
    rowIndex: number,
    day: string | number
  ) => {
    const user = researchData[rowIndex];
    if (!user) return console.warn("User tidak ditemukan untuk index:", rowIndex);

    const key = `${page}-${user._id}-${day}`;
    const current = checkedState[key] ?? false;
    setCheckedState((prev) => ({ ...prev, [key]: !current }));

    if (page === "Tematik") {
      const targetDate = new Date(year, month - 1, Number(day));
      const isoDate = targetDate.toISOString();

      if (!current) {
        try {
          const res = await createOperationalRecord(user._id, "thematic", isoDate);
          setRecordIds((prev) => ({ ...prev, [key]: res.data._id }));
          console.log("✅ Record created for", user.name, "on", isoDate);
        } catch (e) {
          console.error("❌ Error membuat record thematic:", e);
        }
      } else {
        const id = recordIds[key];
        if (!id) return console.error("Record ID tidak ditemukan:", key);
        try {
          await deleteOperationalRecord(id);
          setRecordIds((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
          });
          console.log("🗑️ Record deleted:", id);
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
      typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

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
    };

    const category =
      map[norm] ||
      (path.includes("/report")
        ? "report"
        : path.includes("/attendance")
        ? "attendance"
        : path.includes("/scoring")
        ? "scoring"
        : path.includes("/organization")
        ? "organization"
        : "operasional");

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
