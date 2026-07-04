import { apiGet } from '../lib/api';

interface DashboardData {
  date: string;
  nutrition: {
    date: string;
    total_calories: number;
    total_protein_g: number;
    total_carbs_g: number;
    total_fat_g: number;
    total_fiber_g: number;
    entry_count: number;
  };
  workout: {
    date: string;
    session_count: number;
    total_exercises: number;
    total_sets: number;
    total_volume_kg: number;
    total_duration_minutes: number;
  };
  recovery: Record<string, unknown> | null;
  body: Record<string, unknown> | null;
  settings: Record<string, unknown> | null;
  dailyReport: Record<string, unknown> | null;
}

export const dashboardApi = {
  get: (date?: string) => apiGet<DashboardData>('/dashboard', date ? { date } : undefined),
};
