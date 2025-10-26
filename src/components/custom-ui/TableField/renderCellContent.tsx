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
  data?: any[]
) => {
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

  switch (page) {
    case "Tematik":
    case "Piket":
      return <Checkbox />;
    case "Data":
      if (day === "Status") return <StatusField />;
      if (day === "Permission") return <DropdownField />;
      if (day === "Detail") return <ActionField />;
      return "-";
    case "Kehadiran":
      if (day === "Action") return <ActionField />;
      return <Checkbox />;
    default:
      return "-";
  }
};
