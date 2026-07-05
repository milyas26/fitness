import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useDate } from '../../contexts/DateContext';
import { todayStr, addDays } from '../../lib/utils';
import { CalorieCalendar } from './CalorieCalendar';

export function DateNavigator() {
  const { selectedDate, goToPrevDay, goToNextDay } = useDate();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const today = todayStr();
  const isToday = selectedDate === today;

  const formatLabel = (date: string) => {
    if (date === today) return 'Today';
    if (date === addDays(today, -1)) return 'Yesterday';
    return new Date(date + 'T12:00:00').toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const label = formatLabel(selectedDate);

  return (
    <div className="flex items-center gap-2 mb-5">
      <button
        onClick={goToPrevDay}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/40 hover:bg-secondary hover:border-border/60 transition-all duration-200 active:scale-95 shadow-sm"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => setIsPickerOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-card border border-border/40 hover:border-primary/30 transition-all duration-200 shadow-sm"
      >
        <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
        <span className="text-sm font-bold truncate">{label}</span>
        {isToday && (
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse shrink-0" />
        )}
      </button>

      <button
        onClick={goToNextDay}
        disabled={isToday}
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border/40 hover:bg-secondary hover:border-border/60 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 shadow-sm"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <CalorieCalendar open={isPickerOpen} onClose={() => setIsPickerOpen(false)} />
    </div>
  );
}
