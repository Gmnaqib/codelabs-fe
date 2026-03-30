import React, { useState } from 'react';

interface DateRangePickerProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (start: string | null, end: string | null) => void;
  minDate?: string;
  onRequestClose?: () => void; // dipanggil jika klik di luar
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1);

  const handleDayClick = (day: number) => {
    const clicked = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const clickedStr = formatDate(clicked);
    if (minDate && clickedStr < minDate) return; // tidak bisa pilih sebelum minDate
    if (!startDate && !endDate) {
      onChange(clickedStr, null);
    } else if (startDate && !endDate) {
      if (clickedStr < startDate) {
        onChange(clickedStr, null);
      } else if (clickedStr === startDate) {
        onChange(clickedStr, null); 
      } else {
        onChange(startDate, clickedStr);
      }
    } else if (startDate && endDate) {
      if (clickedStr === startDate && clickedStr === endDate) {
        onChange(null, null);
      } else if (clickedStr === startDate || clickedStr === endDate) {
        onChange(clickedStr, null);
      } else {
        onChange(clickedStr, null);
      }
    } else {
      onChange(clickedStr, null);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isInRange = (day: number) => {
    if (!startDate) return false;
    const d = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    if (startDate && endDate) {
      return d >= startDate && d <= endDate;
    }
    return d === startDate;
  };

  return (
    <div className="flex flex-col items-center" tabIndex={-1}>
      <div className="flex justify-between w-full mb-2">
        <button type="button" onClick={prevMonth}>&lt;</button>
        <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        <button type="button" onClick={nextMonth}>&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-xs font-bold text-center">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i]}
          </div>
        ))}
        {Array(currentMonth.getDay()).fill(null).map((_, i) => (
          <div key={i}></div>
        ))}
        {days.map(day => {
          const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dStr = formatDate(d);
          const selected = isInRange(day);
          const isDisabled = !!minDate && dStr < minDate;
          return (
            <button
              key={day}
              type="button"
              className={`w-8 h-8 rounded-full text-xs ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100'} ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangePicker;
