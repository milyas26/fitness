import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api';
import type { WorkoutSession, WorkoutSummary, CreateWorkoutSession } from '@fitness/shared';

export const workoutApi = {
  getAll: (date?: string) => apiGet<WorkoutSession[]>('/workout', date ? { date } : undefined),

  getToday: (date?: string) =>
    apiGet<WorkoutSummary>('/workout/today', date ? { date } : undefined),

  getRange: (start: string, end: string) =>
    apiGet<WorkoutSummary[]>('/workout/range', { start, end }),

  getById: (id: string) => apiGet<WorkoutSession>(`/workout/${id}`),

  create: (data: CreateWorkoutSession) =>
    apiPost<WorkoutSession>('/workout', data),

  update: (id: string, data: Partial<CreateWorkoutSession>) =>
    apiPatch<WorkoutSession>(`/workout/${id}`, data),

  delete: (id: string) => apiDelete(`/workout/${id}`),
};
