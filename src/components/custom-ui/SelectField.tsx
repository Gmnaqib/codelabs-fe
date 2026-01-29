import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SelectProps {
  value: string;
  title: string;
}

interface SelectFieldProps {
  options: SelectProps[];
  value: string;
  onChange: (value: string) => void;
}

const SelectField = ({ options, value, onChange }: SelectFieldProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Higest" />
      </SelectTrigger>
      <SelectContent>
        {options.map((item, index) => (
          <SelectItem key={index} value={item.value}>{item.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SelectField