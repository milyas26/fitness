import { prisma } from '../../plugins/prisma.js';
import type { HermesIngestPayload } from '@fitness/shared';
import { hermesRepository } from './hermes.repository.js';

export const hermesIngestService = {
  async ingest(payload: HermesIngestPayload) {
    const existing = await hermesRepository.findByKey(payload.idempotency_key);
    if (existing) {
      return { status: 'duplicate' as const, ingestLog: existing };
    }

    try {
      const date = new Date(payload.date + 'T00:00:00.000Z');

      await prisma.$transaction(async (tx) => {
        const entities = payload.entities;

        if (entities.nutrition && entities.nutrition.length > 0) {
          await tx.nutritionEntry.createMany({
            data: entities.nutrition.map((n) => ({
              food_name: n.food_name,
              quantity: n.quantity ?? 1,
              calories: n.calories,
              protein_g: n.protein_g,
              carbs_g: n.carbs_g,
              fat_g: n.fat_g,
              fiber_g: n.fiber_g ?? 0,
              meal_time: n.meal_time ?? 'snack',
              entry_date: n.entry_date ? new Date(n.entry_date + 'T00:00:00.000Z') : date,
              notes: n.notes || null,
              source: 'hermes',
            })),
          });
        }

        if (entities.workout) {
          await tx.workoutSession.create({
            data: {
              date,
              split: entities.workout.split,
              duration_minutes: entities.workout.duration_minutes,
              notes: entities.workout.notes || null,
              source: 'hermes',
              exercises: {
                create: entities.workout.exercises.map((e) => ({
                  name: e.name,
                  weight_kg: e.weight_kg,
                  reps: e.reps,
                  sets: e.sets,
                  order: e.order,
                })),
              },
            },
          });
        }

        if (entities.recovery) {
          await tx.recoveryLog.upsert({
            where: { date },
            create: {
              date,
              sleep_hours: entities.recovery.sleep_hours,
              energy_level: entities.recovery.energy_level ?? 5,
              muscle_soreness: entities.recovery.muscle_soreness ?? 'mild',
              notes: entities.recovery.notes || null,
              source: 'hermes',
            },
            update: {
              sleep_hours: entities.recovery.sleep_hours,
              energy_level: entities.recovery.energy_level ?? 5,
              muscle_soreness: entities.recovery.muscle_soreness ?? 'mild',
              notes: entities.recovery.notes || null,
            },
          });
        }

        if (entities.body) {
          await tx.bodyMeasurement.upsert({
            where: { date },
            create: {
              date,
              morning_weight_kg: entities.body.morning_weight_kg,
              waist_cm: entities.body.waist_cm || null,
              source: 'hermes',
            },
            update: {
              morning_weight_kg: entities.body.morning_weight_kg,
              waist_cm: entities.body.waist_cm || null,
            },
          });
        }

      });

      const ingestLog = await hermesRepository.createIngestLog({
        idempotency_key: payload.idempotency_key,
        conversation_id: payload.conversation_id || null,
        request_body: JSON.parse(JSON.stringify(payload)),
        status: 'success',
        error_message: null,
      });

      return { status: 'success' as const, ingestLog };
    } catch (error) {
      await hermesRepository.createIngestLog({
        idempotency_key: payload.idempotency_key,
        conversation_id: payload.conversation_id || null,
        request_body: JSON.parse(JSON.stringify(payload)),
        status: 'server_error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  },
};
