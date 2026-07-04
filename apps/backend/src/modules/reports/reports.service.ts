import { reportRepository } from './reports.repository.js';
import type { CreateDailyReport, CreateWeeklyReport, CreateMonthlyReport } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export const reportService = {
  async getDailyByDate(dateStr?: string) {
    const date = parseDate(dateStr);
    return reportRepository.findDailyByDate(date);
  },

  async getAllDaily(limit?: number) {
    return reportRepository.findAllDaily(limit);
  },

  async upsertDaily(data: CreateDailyReport) {
    return reportRepository.upsertDaily(parseDate(data.date), {
      content_md: data.content_md,
      nutrition_score: data.nutrition_score ?? null,
      workout_score: data.workout_score ?? null,
      recovery_score: data.recovery_score ?? null,
      bulking_score: data.bulking_score ?? null,
    });
  },

  async getAllWeekly(limit?: number) {
    return reportRepository.findAllWeekly(limit);
  },

  async upsertWeekly(data: CreateWeeklyReport) {
    return reportRepository.upsertWeekly(parseDate(data.week_start), {
      content_md: data.content_md,
    });
  },

  async getAllMonthly(limit?: number) {
    return reportRepository.findAllMonthly(limit);
  },

  async upsertMonthly(data: CreateMonthlyReport) {
    return reportRepository.upsertMonthly(parseDate(data.month_start), {
      content_md: data.content_md,
    });
  },
};
