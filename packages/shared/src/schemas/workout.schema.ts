import { z } from 'zod';

export const createWorkoutExerciseSchema = z.object({
  name: z.string().min(1).max(200),
  weight_kg: z.number().min(0),
  reps: z.number().int().min(0),
  sets: z.number().int().min(1),
  order: z.number().int().min(0).default(0),
});

export const createWorkoutSessionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  split: z.string().min(1).max(50),
  duration_minutes: z.number().int().min(1),
  notes: z.string().max(500).optional(),
  source: z.enum(['hermes', 'manual']).default('manual'),
  exercises: z.array(createWorkoutExerciseSchema).min(1),
});

export const updateWorkoutSessionSchema = createWorkoutSessionSchema.partial();

export const workoutExerciseSchema = createWorkoutExerciseSchema.extend({
  id: z.string().uuid(),
  session_id: z.string().uuid(),
  created_at: z.string(),
});

export const workoutSessionSchema = createWorkoutSessionSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
  exercises: z.array(workoutExerciseSchema),
});

export const workoutSummarySchema = z.object({
  date: z.string(),
  session_count: z.number(),
  total_exercises: z.number(),
  total_sets: z.number(),
  total_volume_kg: z.number(),
  total_duration_minutes: z.number(),
});

export type CreateWorkoutExercise = z.infer<typeof createWorkoutExerciseSchema>;
export type CreateWorkoutSession = z.infer<typeof createWorkoutSessionSchema>;
export type UpdateWorkoutSession = z.infer<typeof updateWorkoutSessionSchema>;
export type WorkoutExercise = z.infer<typeof workoutExerciseSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
export type WorkoutSummary = z.infer<typeof workoutSummarySchema>;
