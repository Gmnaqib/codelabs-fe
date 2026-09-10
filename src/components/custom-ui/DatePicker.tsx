
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  minDate?: string;
  disabled?: boolean;
  disabledDaysOfWeek?: number[]; // 0=Sunday, 6=Saturday
  disabledDates?: string[]; // yyyy-MM-dd, e.g. dates already picked elsewhere in the same form
}

function parseDate(str: string | null): Date | undefined {
  if (!str) return undefined;
  const [year, month, day] = str.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplay(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, disabled, disabledDaysOfWeek, disabledDates }) => {
  const [open, setOpen] = useState(false);
  const selected = parseDate(value);
  // minDate default: hari ini
  let min = parseDate(minDate || null);
  if (!min) {
    const today = new Date();
    min = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={!!(typeof disabled !== 'undefined' && disabled)}
        className="flex h-fit w-full items-center justify-between gap-5 rounded-full border border-muted-foreground bg-white px-6 py-2 text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <span>{selected ? formatDisplay(selected) : 'Select date'}</span>
        <CalendarDaysIcon className="size-5" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto rounded-lg bg-popover p-0 shadow-sm">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={date => {
            onChange(date ? formatDate(date) : null);
            setOpen(false);
          }}
          disabled={date => {
            if (min && date < min) return true;
            if (Array.isArray(disabledDaysOfWeek) && disabledDaysOfWeek.includes(date.getDay())) return true;
            if (Array.isArray(disabledDates) && disabledDates.includes(formatDate(date))) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
