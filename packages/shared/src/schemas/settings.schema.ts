import { z } from 'zod';
import { WORKOUT_SPLITS } from '../constants/index.js';

export const settingsSchema = z.object({
  height_cm: z.number().positive(),
  target_weight_kg: z.number().positive(),
  daily_calories: z.number().int().positive(),
  daily_protein_g: z.number().int().positive(),
  daily_carbs_g: z.number().int().positive(),
  daily_fat_g: z.number().int().positive(),
  daily_fiber_g: z.number().int().positive(),
  daily_water_ml: z.number().int().positive(),
  current_split: z.enum(WORKOUT_SPLITS),
  workout_days_per_week: z.number().int().min(1).max(7),
});

export const updateSettingsSchema = settingsSchema.partial();

export const settingsRowSchema = settingsSchema.extend({
  id: z.string().uuid(),
  updated_at: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;
export type SettingsRow = z.infer<typeof settingsRowSchema>;
