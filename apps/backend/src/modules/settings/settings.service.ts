import { settingsRepository } from './settings.repository.js';
import type { Settings, UpdateSettings } from '@fitness/shared';

export const settingsService = {
  async get() {
    return settingsRepository.get();
  },

  async upsert(data: Settings) {
    return settingsRepository.upsert({
      height_cm: data.height_cm,
      target_weight_kg: data.target_weight_kg,
      daily_calories: data.daily_calories,
      daily_protein_g: data.daily_protein_g,
      daily_carbs_g: data.daily_carbs_g,
      daily_fat_g: data.daily_fat_g,
      daily_fiber_g: data.daily_fiber_g,
      daily_water_ml: data.daily_water_ml,
      current_split: data.current_split,
      workout_days_per_week: data.workout_days_per_week,
    });
  },

  async update(data: UpdateSettings) {
    const current = await settingsRepository.get();
    if (!current) {
      throw new Error('Settings not found. Create settings first.');
    }
    return settingsRepository.update(current.id, data);
  },
};
