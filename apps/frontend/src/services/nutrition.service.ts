import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
import type {
  NutritionEntry,
  NutritionSummary,
  CreateNutritionEntry,
} from '@fitness/shared';

export const nutritionApi = {
  getAll: (date?: string) => apiGet<NutritionEntry[]>('/nutrition', date ? { date } : undefined),

  getToday: (date?: string) =>
    apiGet<NutritionSummary>('/nutrition/today', date ? { date } : undefined),

  getRange: (start: string, end: string) =>
    apiGet<NutritionSummary[]>('/nutrition/range', { start, end }),

  create: (data: CreateNutritionEntry) =>
    apiPost<NutritionEntry>('/nutrition', data),

  update: (id: string, data: Partial<CreateNutritionEntry>) =>
    apiPatch<NutritionEntry>(`/nutrition/${id}`, data),

  getCaloriesRange: (start: string, end: string) =>
    apiGet<{ date: string; calories: number }[]>('/nutrition/calories-range', { start, end }),

  delete: (id: string) => apiDelete(`/nutrition/${id}`),
};
