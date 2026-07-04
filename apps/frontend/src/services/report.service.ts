import { apiGet } from '../lib/api';
import type { DailyReport, WeeklyReport, MonthlyReport } from '@fitness/shared';

export const reportApi = {
  getDaily: (date?: string) =>
    apiGet<DailyReport | DailyReport[]>(date ? `/reports/daily?date=${date}` : '/reports/daily'),

  getWeekly: () => apiGet<WeeklyReport[]>('/reports/weekly'),

  getMonthly: () => apiGet<MonthlyReport[]>('/reports/monthly'),
};
