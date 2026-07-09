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
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  // Reset searchTerm when dropdown closed
  React.useEffect(() => {
    if (!open) setSearchTerm("");
  }, [open]);

  // Focus the search input once the dropdown finishes opening. Radix moves
  // focus onto the first menu item on mount, so this runs a frame later to
  // win that race.
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(id);
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
        <DropdownMenuContent
          align="start"
          className="w-auto max-h-72 overflow-y-auto"
        >
          <div className="sticky top-0 z-10 bg-popover pb-2">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") e.stopPropagation();
              }}
              placeholder="Search member..."
              className="w-full rounded-md border px-3 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
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
