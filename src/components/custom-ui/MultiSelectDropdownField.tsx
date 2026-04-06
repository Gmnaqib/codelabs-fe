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
  displayValue?: string[]; // untuk membatasi tampilan input
  disabled?: boolean;
  onChange?: (value: string[]) => void;
}

export function MultiSelectDropdownField({
  title = "Select...",
  menu = [],
  label,
  onChange,
  value = [],
  displayValue,
  disabled,
}: MultiSelectDropdownFieldProps) {
  const [selected, setSelected] = React.useState<string[]>(value);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchTimeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  // Reset searchTerm when dropdown closed
  React.useEffect(() => {
    if (!open) setSearchTerm("");
  }, [open]);

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

  // Handle keydown for search
  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setSearchTerm(prev => prev + e.key);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => setSearchTerm("") , 1000);
    }
    if (e.key === "Backspace") {
      setSearchTerm(prev => prev.slice(0, -1));
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => setSearchTerm("") , 1000);
    }
  };

  const filteredMenu = searchTerm
    ? menu.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
    : menu;

  return (
    <div className="flex flex-col gap-2">
      {label && <Label>{label}</Label>}
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="group flex items-center justify-between text-base font-light py-5 gap-3"
            disabled={disabled}
            tabIndex={0}
            onKeyDown={handleTriggerKeyDown}
          >
            <span>
              {displayValue && displayValue.length > 0
                ? displayValue.join(", ")
                : selected.length > 0
                  ? selected.join(", ")
                  : title}
            </span>
            <IoIosArrowDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto max-h-60 overflow-y-scroll">
          {filteredMenu.length === 0 && (
            <div className="px-4 py-2 text-muted-foreground">No results</div>
          )}
          {filteredMenu.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {filteredMenu.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={e => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
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
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
