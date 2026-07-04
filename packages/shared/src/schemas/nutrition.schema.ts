import { z } from 'zod';
import { MEAL_TIMES } from '../constants/index.js';

export const createNutritionEntrySchema = z.object({
  food_name: z.string().min(1).max(200),
  quantity: z.number().positive().default(1),
  calories: z.number().int().min(0),
  protein_g: z.number().min(0),
  carbs_g: z.number().min(0),
  fat_g: z.number().min(0),
  fiber_g: z.number().min(0).default(0),
  meal_time: z.enum(MEAL_TIMES),
  entry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
  source: z.enum(['hermes', 'manual']).default('manual'),
});

export const updateNutritionEntrySchema = createNutritionEntrySchema.partial();

export const nutritionEntrySchema = createNutritionEntrySchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const nutritionSummarySchema = z.object({
  date: z.string(),
  total_calories: z.number(),
  total_protein_g: z.number(),
  total_carbs_g: z.number(),
  total_fat_g: z.number(),
  total_fiber_g: z.number(),
  entry_count: z.number(),
});

export type CreateNutritionEntry = z.infer<typeof createNutritionEntrySchema>;
export type UpdateNutritionEntry = z.infer<typeof updateNutritionEntrySchema>;
export type NutritionEntry = z.infer<typeof nutritionEntrySchema>;
export type NutritionSummary = z.infer<typeof nutritionSummarySchema>;
