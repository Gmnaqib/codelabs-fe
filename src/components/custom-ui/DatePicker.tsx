
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  minDate?: string;
  disabled?: boolean;
  disabledDaysOfWeek?: number[]; // 0=Sunday, 6=Saturday
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
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, minDate, disabled, disabledDaysOfWeek }) => {
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
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between px-4 py-2 border rounded-md text-left font-normal bg-white"
          disabled={!!(typeof disabled !== 'undefined' && disabled)}
        >
          <span>{selected ? formatDisplay(selected) : 'Pilih tanggal'}</span>
          <CalendarIcon className="w-5 h-5 text-muted-foreground ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-auto bg-white">
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
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
