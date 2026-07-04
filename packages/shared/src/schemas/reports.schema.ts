import { z } from 'zod';

export const dailyReportSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content_md: z.string().min(1),
  nutrition_score: z.number().min(0).max(100).optional(),
  workout_score: z.number().min(0).max(100).optional(),
  recovery_score: z.number().min(0).max(100).optional(),
  bulking_score: z.number().min(0).max(100).optional(),
});

export const weeklyReportSchema = z.object({
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content_md: z.string().min(1),
});

export const monthlyReportSchema = z.object({
  month_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  content_md: z.string().min(1),
});

export const createDailyReportSchema = dailyReportSchema;
export const createWeeklyReportSchema = weeklyReportSchema;
export const createMonthlyReportSchema = monthlyReportSchema;

export type DailyReport = z.infer<typeof dailyReportSchema> & {
  id: string;
  created_at: string;
};

export type WeeklyReport = z.infer<typeof weeklyReportSchema> & {
  id: string;
  created_at: string;
};

export type MonthlyReport = z.infer<typeof monthlyReportSchema> & {
  id: string;
  created_at: string;
};

export type CreateDailyReport = z.infer<typeof createDailyReportSchema>;
export type CreateWeeklyReport = z.infer<typeof createWeeklyReportSchema>;
export type CreateMonthlyReport = z.infer<typeof createMonthlyReportSchema>;
