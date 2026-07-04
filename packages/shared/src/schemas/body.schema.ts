import { z } from 'zod';

export const createBodyMeasurementSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  morning_weight_kg: z.number().positive(),
  waist_cm: z.number().positive().optional(),
  source: z.enum(['hermes', 'manual']).default('manual'),
});

export const updateBodyMeasurementSchema = createBodyMeasurementSchema.partial();

export const bodyMeasurementSchema = createBodyMeasurementSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
});

export const weightTrendSchema = z.object({
  date: z.string(),
  weight_kg: z.number(),
  change_weekly_kg: z.number().optional(),
});

export type CreateBodyMeasurement = z.infer<typeof createBodyMeasurementSchema>;
export type UpdateBodyMeasurement = z.infer<typeof updateBodyMeasurementSchema>;
export type BodyMeasurement = z.infer<typeof bodyMeasurementSchema>;
export type WeightTrend = z.infer<typeof weightTrendSchema>;
