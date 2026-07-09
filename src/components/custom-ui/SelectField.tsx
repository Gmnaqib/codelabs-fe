import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectProps {
  value: string;
  title: string;
}

interface SelectFieldProps {
  options: SelectProps[];
  value: string;
  onChange: (value: string) => void;
  /** Overrides the text shown on the closed trigger without affecting the dropdown list. */
  displayValue?: string;
  /** Shown on the closed trigger when no option is selected yet. */
  placeholder?: string;
  /** Extra classes for the trigger button, e.g. "w-full" to fill its container. */
  className?: string;
}

const SelectField = ({ options, value, onChange, displayValue, placeholder = 'Other', className }: SelectFieldProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn('w-fit', className)}>
        <SelectValue placeholder={placeholder}>{displayValue}</SelectValue>
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