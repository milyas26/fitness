import { prisma } from '../../plugins/prisma.js';

const FIRST_SETTINGS_ID = '00000000-0000-0000-0000-000000000000';

export const settingsRepository = {
  async get() {
    return prisma.settings.findFirst();
  },

  async upsert(data: {
    height_cm: number;
    target_weight_kg: number;
    daily_calories: number;
    daily_protein_g: number;
    daily_carbs_g: number;
    daily_fat_g: number;
    daily_fiber_g: number;
    daily_water_ml: number;
    current_split: string;
    workout_days_per_week: number;
  }) {
    const existing = await prisma.settings.findFirst();
    const id = existing?.id || FIRST_SETTINGS_ID;

    return prisma.settings.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  },

  async update(
    id: string,
    data: Partial<{
      height_cm: number;
      target_weight_kg: number;
      daily_calories: number;
      daily_protein_g: number;
      daily_carbs_g: number;
      daily_fat_g: number;
      daily_fiber_g: number;
      daily_water_ml: number;
      current_split: string;
      workout_days_per_week: number;
    }>,
  ) {
    return prisma.settings.update({ where: { id }, data });
  },
};
