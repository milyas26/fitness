import { z } from 'zod';
import { MUSCLE_SORENESS_LEVELS } from '../constants/index.js';

export const createRecoveryLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sleep_hours: z.number().min(0).max(24),
  energy_level: z.number().int().min(1).max(10),
  muscle_soreness: z.enum(MUSCLE_SORENESS_LEVELS),
  notes: z.string().max(500).optional(),
  source: z.enum(['hermes', 'manual']).default('manual'),
});

export const updateRecoveryLogSchema = createRecoveryLogSchema.partial();

export const recoveryLogSchema = createRecoveryLogSchema.extend({
  id: z.string().uuid(),
  created_at: z.string(),
});

export const recoverySummarySchema = z.object({
  date: z.string(),
  sleep_hours: z.number(),
  energy_level: z.number(),
  muscle_soreness: z.string(),
});

export type CreateRecoveryLog = z.infer<typeof createRecoveryLogSchema>;
export type UpdateRecoveryLog = z.infer<typeof updateRecoveryLogSchema>;
export type RecoveryLog = z.infer<typeof recoveryLogSchema>;
export type RecoverySummary = z.infer<typeof recoverySummarySchema>;
