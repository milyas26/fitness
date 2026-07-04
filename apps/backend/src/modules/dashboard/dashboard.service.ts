import { nutritionService } from '../nutrition/nutrition.service.js';
import { workoutService } from '../workout/workout.service.js';
import { recoveryService } from '../recovery/recovery.service.js';
import { bodyService } from '../body/body.service.js';
import { settingsService } from '../settings/settings.service.js';
import { reportService } from '../reports/reports.service.js';
import { parseDate } from '../../utils/date.js';

export const dashboardService = {
  async getToday(dateStr?: string) {
    const date = parseDate(dateStr);
    const dateStrNorm = date.toISOString().slice(0, 10);

    const [nutritionSummary, workoutSummary, recovery, body, settings, dailyReport] =
      await Promise.all([
        nutritionService.getTodaySummary(dateStrNorm),
        workoutService.todaySummary(dateStrNorm),
        recoveryService.getByDate(dateStrNorm),
        bodyService.getByDate(dateStrNorm),
        settingsService.get(),
        reportService.getDailyByDate(dateStrNorm),
      ]);

    return {
      date: dateStrNorm,
      nutrition: nutritionSummary,
      workout: workoutSummary,
      recovery,
      body,
      settings,
      dailyReport,
    };
  },

  async getContext(dateStr?: string) {
    const date = parseDate(dateStr);
    const dateStrNorm = date.toISOString().slice(0, 10);
    const endDate = date;
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 7);

    const [
      nutritionEntries,
      workoutSessions,
      recoveryLog,
      bodyMeasurement,
      settings,
      dailyReport,
    ] = await Promise.all([
      nutritionService.getRange(startDate, endDate),
      workoutService.getRange(startDate, endDate),
      recoveryService.getByDate(dateStrNorm),
      bodyService.getByDate(dateStrNorm),
      settingsService.get(),
      reportService.getDailyByDate(dateStrNorm),
    ]);

    return {
      date: dateStrNorm,
      nutrition: { entries: nutritionEntries },
      workout: { sessions: workoutSessions },
      recovery: recoveryLog,
      body: bodyMeasurement,
      settings,
      latestReport: dailyReport,
    };
  },
};
