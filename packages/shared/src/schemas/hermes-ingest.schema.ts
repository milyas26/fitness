import { z } from 'zod';

const hermesNutritionSchema = z.object({
  food_name: z.string().min(1),
  meal_time: z.string(),
  quantity: z.number().positive().default(1),
  calories: z.number().int().min(0),
  protein_g: z.number().min(0),
  carbs_g: z.number().min(0),
  fat_g: z.number().min(0),
  fiber_g: z.number().min(0).default(0),
  entry_date: z.string().optional(),
  notes: z.string().optional(),
});

const hermesWorkoutSchema = z.object({
  split: z.string().min(1),
  duration_minutes: z.number().int().min(1),
  notes: z.string().optional(),
  exercises: z
    .array(
      z.object({
        name: z.string().min(1),
        weight_kg: z.number().min(0),
        reps: z.number().int().min(0),
        sets: z.number().int().min(1),
        order: z.number().int().min(0).default(0),
      }),
    )
    .min(1),
});

const hermesRecoverySchema = z.object({
  sleep_hours: z.number().min(0).max(24),
  energy_level: z.number().int().min(1).max(10).optional(),
  muscle_soreness: z.string().optional(),
  notes: z.string().optional(),
});

const hermesBodySchema = z.object({
  morning_weight_kg: z.number().positive(),
  waist_cm: z.number().positive().optional(),
});

export const hermesIngestSchema = z.object({
  idempotency_key: z.string().uuid(),
  conversation_id: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entities: z.object({
    nutrition: z.array(hermesNutritionSchema).optional(),
    workout: hermesWorkoutSchema.optional(),
    recovery: hermesRecoverySchema.optional(),
    body: hermesBodySchema.optional(),
  }),
});

export const hermesConversationSchema = z.object({
  raw_text: z.string().min(1),
  source: z.string().default('telegram'),
  message_id: z.string().optional(),
  chat_id: z.string().optional(),
});

export const contextQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type HermesIngestPayload = z.infer<typeof hermesIngestSchema>;
export type HermesConversationPayload = z.infer<typeof hermesConversationSchema>;
export type HermesContextQuery = z.infer<typeof contextQuerySchema>;
