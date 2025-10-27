import React from "react";
import { Checkbox } from "../../ui/checkbox";
import StatusField from "./StatusField";
import ActionField from "./ActionField";
import { DropdownField } from "../DropdownField";
import {
  CheckCircle2,
  Clock,
  FileMinus,
  MinusCircle,
  Thermometer,
} from "lucide-react";

export const renderCellContent = (
  page: string,
  day: string | number,
  rowIndex: number,
  data?: any[],
  checkedState?: Record<string, boolean>,
  onToggle?: (page: string, rowIndex: number, day: string | number) => void
) => {
  // === ABSENSI: tetap pakai logic lama (records per user) ===
  if (page === "Absensi" && data) {
    const user = data[rowIndex];
    const record = user?.records?.find((r: any) => {
      const recordDate = new Date(r.date).getDate();
      return recordDate === Number(day);
    });

    if (!record)
      return <MinusCircle size={18} className="text-gray-400 mx-auto" />;
    if (record?.status === "izin")
      return <FileMinus size={18} className="text-blue-500 mx-auto" />;
    if (record?.status === "sakit")
      return <Thermometer size={18} className="text-red-500 mx-auto" />;
    if (record?.checkIn && !record?.checkOut)
      return <Clock size={18} className="text-yellow-500 mx-auto" />;
    if (record?.checkIn && record?.checkOut)
      return <CheckCircle2 size={18} className="text-green-500 mx-auto" />;
    return <MinusCircle size={18} className="text-gray-400 mx-auto" />;
  }

  // === TEMATIK / PIKET: gunakan user._id bila tersedia agar konsisten dengan key dari GET ===
  switch (page) {
    case "Tematik":
    case "Piket": {
      // ambil id user dari data jika ada, fallback ke rowIndex untuk safety
      const row = data?.[rowIndex];
      const id = row?._id ?? rowIndex;
      const key = `${page}-${id}-${day}`; // sama pola dengan yang kita set waktu GET

      const checked = checkedState?.[key] ?? false;
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={() => onToggle?.(page, rowIndex, day)}
        />
      );
    }

    case "Data":
      if (day === "Status") return <StatusField />;
      if (day === "Permission") return <DropdownField title="tes" menu={["tes"]}/>;
      if (day === "Detail") return <ActionField />;
      return "-";
    case "Kehadiran":
      if (day === "Action") return <ActionField />;
      return <Checkbox />;
    default:
      return "-";
  }
};
