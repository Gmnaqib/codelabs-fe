import React from "react"
import { Checkbox } from "../../ui/checkbox"
import StatusField from "./StatusField"
import ActionField from "./ActionField"
import { DropdownField } from "../DropdownField"

export const renderCellContent = (
  page: string,
  day: string | number,
  rowIndex: number
) => {
  switch (page) {
    case "Absensi":
      return "-"
    case "Tematik":
    case "Piket":
      return <Checkbox />
    case "Data":
      if (day === "Status") return <StatusField />
      if (day === "Permission") return <DropdownField />
      if (day === "Detail") return <ActionField />
      return "-"
    case "Kehadiran":
      if (day === "Action") return <ActionField />
      return <Checkbox />
    default:
      return "-"
  }
}
