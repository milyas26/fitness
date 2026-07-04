import { nutritionRepository } from './nutrition.repository.js';
import type {
  CreateNutritionEntry,
  NutritionSummary,
} from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export const nutritionService = {
  async getByDate(dateStr?: string) {
    const date = parseDate(dateStr);
    return nutritionRepository.findByDate(date);
  },

  async getById(id: string) {
    return nutritionRepository.findById(id);
  },

  async create(data: CreateNutritionEntry) {
    return nutritionRepository.create({
      food_name: data.food_name,
      quantity: data.quantity,
      calories: data.calories,
      protein_g: data.protein_g,
      carbs_g: data.carbs_g,
      fat_g: data.fat_g,
      fiber_g: data.fiber_g,
      meal_time: data.meal_time,
      notes: data.notes || null,
      source: data.source,
      entry_date: parseDate(data.entry_date),
    });
  },

  async bulkCreate(entries: Array<Omit<CreateNutritionEntry, 'source'>>, source: 'hermes' | 'manual' = 'hermes') {
    const data = entries.map((e) => ({
      food_name: e.food_name,
      quantity: e.quantity ?? 1,
      calories: e.calories,
      protein_g: e.protein_g,
      carbs_g: e.carbs_g,
      fat_g: e.fat_g,
      fiber_g: e.fiber_g ?? 0,
      meal_time: e.meal_time ?? 'snack',
      notes: e.notes || null,
      source,
      entry_date: parseDate(e.entry_date),
    }));
    return nutritionRepository.createMany(data);
  },

  async update(id: string, data: Partial<CreateNutritionEntry>) {
    return nutritionRepository.update(id, {
      ...(data.food_name && { food_name: data.food_name }),
      ...(data.quantity && { quantity: data.quantity }),
      ...(data.calories !== undefined && { calories: data.calories }),
      ...(data.protein_g !== undefined && { protein_g: data.protein_g }),
      ...(data.carbs_g !== undefined && { carbs_g: data.carbs_g }),
      ...(data.fat_g !== undefined && { fat_g: data.fat_g }),
      ...(data.fiber_g !== undefined && { fiber_g: data.fiber_g }),
      ...(data.meal_time && { meal_time: data.meal_time }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.entry_date && { entry_date: parseDate(data.entry_date) }),
    });
  },

  async delete(id: string) {
    return nutritionRepository.delete(id);
  },

  async getTodaySummary(dateStr?: string): Promise<NutritionSummary> {
    const date = parseDate(dateStr);
    const agg = await nutritionRepository.aggregateByDate(date);
    return {
      date: date.toISOString().slice(0, 10),
      total_calories: agg._sum.calories || 0,
      total_protein_g: agg._sum.protein_g || 0,
      total_carbs_g: agg._sum.carbs_g || 0,
      total_fat_g: agg._sum.fat_g || 0,
      total_fiber_g: agg._sum.fiber_g || 0,
      entry_count: agg._count,
    };
  },

  async getRange(startDate: Date, endDate: Date) {
    return nutritionRepository.findDateRange(startDate, endDate);
  },

  async getDailySummaries(startDate: Date, endDate: Date) {
    const summaries = await nutritionRepository.dailySummaries(startDate, endDate);
    return summaries.map((s) => ({
      date: s.entry_date.toISOString().slice(0, 10),
      total_calories: s._sum.calories || 0,
      total_protein_g: s._sum.protein_g || 0,
      total_carbs_g: s._sum.carbs_g || 0,
      total_fat_g: s._sum.fat_g || 0,
      total_fiber_g: s._sum.fiber_g || 0,
      entry_count: s._count,
    }));
  },
};
