import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDate } from '../../contexts/DateContext';
import { todayStr, strToDate } from '../../lib/utils';
import { nutritionApi } from '../../services/nutrition.service';

interface CalorieCalendarProps {
  open: boolean;
  onClose: () => void;
}

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatMonthYear(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

export function CalorieCalendar({ open, onClose }: CalorieCalendarProps) {
  const { selectedDate, setSelectedDate } = useDate();
  const today = todayStr();

  const initDate = strToDate(selectedDate);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());

  useEffect(() => {
    if (open) {
      const d = strToDate(selectedDate);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const monthPadded = String(viewMonth + 1).padStart(2, '0');
  const lastDay = getMonthDays(viewYear, viewMonth);
  const monthStart = `${viewYear}-${monthPadded}-01`;
  const monthEnd = `${viewYear}-${monthPadded}-${String(lastDay).padStart(2, '0')}`;

  const { data: calorieMap = {}, isLoading } = useQuery({
    queryKey: ['calories-range', monthStart, monthEnd],
    queryFn: async () => {
      const data = await nutritionApi.getCaloriesRange(monthStart, monthEnd);
      const map: Record<string, number> = {};
      data.forEach((d) => {
        map[d.date] = d.calories;
      });
      return map;
    },
    enabled: open,
  });

  const goPrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }, [viewMonth]);

  const goNextMonth = useCallback(() => {
    const td = strToDate(today);
    const atLimit = viewYear >= td.getFullYear() && viewMonth >= td.getMonth();
    if (atLimit) return;
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }, [viewYear, viewMonth, today]);

  const handleSelectDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
      onClose();
    },
    [setSelectedDate, onClose],
  );

  const td = strToDate(today);
  const isAtCurrentMonth = viewYear === td.getFullYear() && viewMonth === td.getMonth();

  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const totalCells = firstDow + lastDay;
  const rows = Math.ceil(totalCells / 7) || 6;

  const cells: Array<{
    date: string;
    day: number;
    isPadding: boolean;
    isFuture: boolean;
  }> = [];

  for (let i = 0; i < firstDow; i++) {
    cells.push({ date: '', day: 0, isPadding: true, isFuture: false });
  }

  for (let day = 1; day <= lastDay; day++) {
    const dateStr = `${viewYear}-${monthPadded}-${String(day).padStart(2, '0')}`;
    cells.push({
      date: dateStr,
      day,
      isPadding: false,
      isFuture: dateStr > today,
    });
  }

  while (cells.length < rows * 7) {
    cells.push({ date: '', day: 0, isPadding: true, isFuture: false });
  }

  const modal = open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goPrevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-600" />
          </button>

          <h3 className="text-base font-semibold text-zinc-800 capitalize tracking-tight">
            {formatMonthYear(viewYear, viewMonth)}
          </h3>

          <button
            onClick={goNextMonth}
            disabled={isAtCurrentMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className="text-center text-[11px] font-medium text-zinc-400 uppercase tracking-wide py-1.5"
            >
              {name}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 gap-x-0">
          {cells.map((cell, idx) => {
            const key = cell.date || `pad-${idx}`;
            const cal = !cell.isPadding ? calorieMap[cell.date] : undefined;
            const isSelected = cell.date === selectedDate;
            const isToday = cell.date === today;
            const hasCalories = cal !== undefined && cal > 0;

            if (cell.isPadding) {
              return <div key={key} className="aspect-square" />;
            }

            return (
              <button
                key={key}
                disabled={cell.isFuture}
                onClick={() => cell.date && handleSelectDate(cell.date)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-full text-xs
                  transition-all duration-150 relative
                  ${cell.isFuture ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer hover:bg-zinc-100'}
                  ${isSelected ? 'bg-black text-white hover:bg-black/90' : ''}
                  ${!isSelected && isToday ? 'ring-2 ring-black/20' : ''}
                `}
              >
                <span
                  className={`text-[13px] font-semibold leading-none ${
                    isSelected ? 'text-white' : isToday ? 'text-black' : 'text-zinc-700'
                  }`}
                >
                  {cell.day}
                </span>
                {cal !== undefined && (
                  <span
                    className={`text-[10px] leading-tight mt-0.5 ${
                      isSelected ? 'text-white/70' : hasCalories ? 'text-emerald-600 font-semibold' : 'text-zinc-300'
                    }`}
                  >
                    {hasCalories ? cal.toLocaleString('id-ID') : '\u2014'}
                  </span>
                )}
                {cal === undefined && !isLoading && (
                  <span className="text-[10px] leading-tight mt-0.5 text-zinc-200">{'\u2014'}</span>
                )}
                {hasCalories && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  ) : null;

  return createPortal(modal, document.body);
}
