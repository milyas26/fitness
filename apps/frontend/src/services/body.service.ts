import { apiGet, apiPost, apiDelete } from '../lib/api';
import type { BodyMeasurement, WeightTrend, CreateBodyMeasurement } from '@fitness/shared';

export const bodyApi = {
  get: (date?: string) => apiGet<BodyMeasurement | null>('/body', date ? { date } : undefined),

  getRange: (start: string, end: string) =>
    apiGet<BodyMeasurement[]>('/body/range', { start, end }),

  getTrend: (days = 30) =>
    apiGet<WeightTrend[]>('/body/trend', { days: String(days) }),

  create: (data: CreateBodyMeasurement) => apiPost<BodyMeasurement>('/body', data),

  delete: (date: string) => apiDelete(`/body/${date}`),
};
