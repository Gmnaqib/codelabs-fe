import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { MinusCircle, FileMinus, Thermometer, Clock, CheckCircle2 } from "lucide-react";
import StatusField from "./StatusField";
import ActionField from "./ActionField";
import { DropdownField } from "../DropdownField";

export const renderCellContent = (
  page: string,
  day: string | number,
  rowIndex: number,
  data: any[],
  checkedState: Record<string, boolean>,
  onToggle: (page: string, rowIndex: number, day: string | number) => void
) => {
  if (page === "Absensi") {
    const user = data[rowIndex];
    const record = user?.records?.find((r: any) => new Date(r.date).getDate() === Number(day));

    if (!record) return <MinusCircle size={18} className="text-gray-400 mx-auto" />;
    if (record.status === "izin") return <FileMinus size={18} className="text-blue-500 mx-auto" />;
    if (record.status === "sakit") return <Thermometer size={18} className="text-red-500 mx-auto" />;
    if (record.checkIn && !record.checkOut) return <Clock size={18} className="text-yellow-500 mx-auto" />;
    if (record.checkIn && record.checkOut) return <CheckCircle2 size={18} className="text-green-500 mx-auto" />;
    return <MinusCircle size={18} className="text-gray-400 mx-auto" />;
  }

  const row = data[rowIndex];
  const id = row?._id ?? rowIndex;
  const key = `${page}-${id}-${day}`;
  const checked = checkedState?.[key] ?? false;

  switch (page) {
    case "Tematik":
    case "Piket":
      return <Checkbox checked={checked} onCheckedChange={() => onToggle(page, rowIndex, day)} />;
    case "Data":
      if (day === "Status") return <StatusField />;
      if (day === "Permission") return <DropdownField title="tes" menu={["tes"]} />;
      if (day === "Detail") return <ActionField />;
      return "-";
    case "Kehadiran":
      return day === "Action" ? <ActionField /> : <Checkbox />;
    default:
      return "-";
  }
};
