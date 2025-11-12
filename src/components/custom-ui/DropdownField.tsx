"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { Label } from "../ui/label";

interface DropdownFieldProps {
  label?: string;
  menu?: string[];
  title?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function DropdownField({
  title = "Select...",
  menu = [],
  label,
  onChange,
  value,
}: DropdownFieldProps) {
  const [selected, setSelected] = React.useState(value || title);

  React.useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  const handleSelect = (item: string) => {
    setSelected(item);
    onChange?.(item);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-between text-base font-light"
          >
            {selected || title}
            <IoIosArrowDown className="ml-2 text-ring" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          {menu.map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => handleSelect(item)}>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
