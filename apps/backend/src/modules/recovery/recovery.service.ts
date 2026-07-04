import { recoveryRepository } from './recovery.repository.js';
import type { CreateRecoveryLog } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export const recoveryService = {
  async getByDate(dateStr?: string) {
    const date = parseDate(dateStr);
    return recoveryRepository.findByDate(date);
  },

  async log(data: CreateRecoveryLog) {
    return recoveryRepository.upsert(parseDate(data.date), {
      sleep_hours: data.sleep_hours,
      energy_level: data.energy_level,
      muscle_soreness: data.muscle_soreness,
      notes: data.notes || null,
      source: data.source,
    });
  },

  async delete(dateStr: string) {
    return recoveryRepository.delete(parseDate(dateStr));
  },

  async getRange(startDate: Date, endDate: Date) {
    return recoveryRepository.findDateRange(startDate, endDate);
  },
};
