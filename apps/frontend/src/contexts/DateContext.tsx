import { createContext, useContext, useState, useCallback } from 'react';
import { todayStr, addDays } from '../lib/utils';

interface DateContextValue {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToPrevDay: () => void;
  goToNextDay: () => void;
}

const DateContext = createContext<DateContextValue | null>(null);

export function DateProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => todayStr());

  const goToToday = useCallback(() => setSelectedDate(todayStr()), []);

  const goToPrevDay = useCallback(() => {
    setSelectedDate((prev) => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((prev) => {
      const next = addDays(prev, 1);
      const today = todayStr();
      return next > today ? prev : next;
    });
  }, []);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate, goToToday, goToPrevDay, goToNextDay }}>
      {children}
    </DateContext.Provider>
  );
}

export function useDate() {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error('useDate must be used within DateProvider');
  return ctx;
}
