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

interface MultiSelectDropdownFieldProps {
  label?: string;
  menu?: string[];
  title?: string;
  value?: string[];
  disabled?: boolean;
  onChange?: (value: string[]) => void;
}

export function MultiSelectDropdownField({
  title = "Select...",
  menu = [],
  label,
  onChange,
  value = [],
  disabled,
}: MultiSelectDropdownFieldProps) {
  const [selected, setSelected] = React.useState<string[]>(value);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (item: string) => {
    let newSelected: string[];
    if (selected.includes(item)) {
      newSelected = selected.filter((v) => v !== item);
    } else {
      newSelected = [...selected, item];
    }
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="group flex items-center justify-between text-base font-light py-5 gap-3"
            disabled={disabled}
          >
            <span>
              {selected.length > 0 ? selected.join(", ") : title}
            </span>
            <IoIosArrowDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {menu.map((item) => (
            <DropdownMenuItem
              key={item}
              onSelect={() => handleSelect(item)}
              className={selected.includes(item) ? "bg-primary text-white mt-1" : " mt-1"}
            >
              <input
                type="checkbox"
                checked={selected.includes(item)}
                readOnly
                className="mr-2 mt-2"
              />
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
