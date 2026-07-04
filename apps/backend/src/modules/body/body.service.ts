import { bodyRepository } from './body.repository.js';
import type { CreateBodyMeasurement, WeightTrend } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export const bodyService = {
  async getByDate(dateStr?: string) {
    const date = parseDate(dateStr);
    return bodyRepository.findByDate(date);
  },

  async record(data: CreateBodyMeasurement) {
    return bodyRepository.upsert(parseDate(data.date), {
      morning_weight_kg: data.morning_weight_kg,
      waist_cm: data.waist_cm || null,
      source: data.source,
    });
  },

  async delete(dateStr: string) {
    return bodyRepository.delete(parseDate(dateStr));
  },

  async getRange(startDate: Date, endDate: Date) {
    return bodyRepository.findDateRange(startDate, endDate);
  },

  async getWeightTrend(startDate: Date, endDate: Date): Promise<WeightTrend[]> {
    const measurements = await bodyRepository.findDateRange(startDate, endDate);
    const trends: WeightTrend[] = [];

    for (let i = 0; i < measurements.length; i++) {
      const current = measurements[i]!;
      const weekAgo = measurements.slice(0, i + 1).reverse().find(
        (m) => (current.date.getTime() - m.date.getTime()) >= 6 * 24 * 60 * 60 * 1000,
      );

      trends.push({
        date: current.date.toISOString().slice(0, 10),
        weight_kg: current.morning_weight_kg,
        change_weekly_kg: weekAgo
          ? parseFloat((current.morning_weight_kg - weekAgo.morning_weight_kg).toFixed(2))
          : undefined,
      });
    }

    return trends;
  },
};
