import { workoutRepository } from './workout.repository.js';
import type { CreateWorkoutSession, WorkoutSummary } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export const workoutService = {
  async getByDate(dateStr?: string) {
    const date = parseDate(dateStr);
    return workoutRepository.findByDate(date);
  },

  async getById(id: string) {
    return workoutRepository.findById(id);
  },

  async create(data: CreateWorkoutSession) {
    return workoutRepository.create({
      date: parseDate(data.date),
      split: data.split,
      duration_minutes: data.duration_minutes,
      notes: data.notes || null,
      source: data.source,
      exercises: {
        create: data.exercises.map((e) => ({
          name: e.name,
          weight_kg: e.weight_kg,
          reps: e.reps,
          sets: e.sets,
          order: e.order,
        })),
      },
    });
  },

  async update(id: string, data: Partial<CreateWorkoutSession>) {
    const updateData: Record<string, unknown> = {};
    if (data.split) updateData.split = data.split;
    if (data.duration_minutes) updateData.duration_minutes = data.duration_minutes;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.date) updateData.date = parseDate(data.date);

    return workoutRepository.update(id, updateData as never);
  },

  async delete(id: string) {
    return workoutRepository.delete(id);
  },

  async getRange(startDate: Date, endDate: Date) {
    return workoutRepository.findDateRange(startDate, endDate);
  },

  async getDailySummaries(startDate: Date, endDate: Date): Promise<WorkoutSummary[]> {
    const sessions = await workoutRepository.dailySummaries(startDate, endDate);
    const grouped = new Map<string, WorkoutSummary>();

    for (const session of sessions) {
      const dateStr = session.date.toISOString().slice(0, 10);
      const existing = grouped.get(dateStr) || {
        date: dateStr,
        session_count: 0,
        total_exercises: 0,
        total_sets: 0,
        total_volume_kg: 0,
        total_duration_minutes: 0,
      };

      existing.session_count += 1;
      existing.total_exercises += session.exercises.length;
      existing.total_sets += session.exercises.reduce((sum, e) => sum + e.sets, 0);
      existing.total_volume_kg += session.exercises.reduce(
        (sum, e) => sum + e.weight_kg * e.reps * e.sets,
        0,
      );
      existing.total_duration_minutes += session.duration_minutes;

      grouped.set(dateStr, existing);
    }

    return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
  },

  async todaySummary(dateStr?: string) {
    const date = parseDate(dateStr);
    const sessions = await workoutRepository.aggregateByDate(date);

    let totalExercises = 0;
    let totalSets = 0;
    let totalVolume = 0;
    let totalDuration = 0;

    for (const session of sessions) {
      totalExercises += session.exercises.length;
      totalSets += session.exercises.reduce((sum, e) => sum + e.sets, 0);
      totalVolume += session.exercises.reduce((sum, e) => sum + e.weight_kg * e.reps * e.sets, 0);
      totalDuration += session.duration_minutes;
    }

    return {
      date: date.toISOString().slice(0, 10),
      session_count: sessions.length,
      total_exercises: totalExercises,
      total_sets: totalSets,
      total_volume_kg: totalVolume,
      total_duration_minutes: totalDuration,
    } satisfies WorkoutSummary;
  },
};
