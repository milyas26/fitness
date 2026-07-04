import { prisma } from '../../plugins/prisma.js';

export const reportRepository = {
  findDailyByDate(date: Date) {
    return prisma.dailyReport.findUnique({ where: { date } });
  },

  findAllDaily(limit = 30) {
    return prisma.dailyReport.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    });
  },

  upsertDaily(date: Date, data: { content_md: string; nutrition_score?: number | null; workout_score?: number | null; recovery_score?: number | null; bulking_score?: number | null }) {
    return prisma.dailyReport.upsert({
      where: { date },
      create: { date, ...data },
      update: data,
    });
  },

  findAllWeekly(limit = 12) {
    return prisma.weeklyReport.findMany({
      orderBy: { week_start: 'desc' },
      take: limit,
    });
  },

  upsertWeekly(weekStart: Date, data: { content_md: string }) {
    return prisma.weeklyReport.upsert({
      where: { week_start: weekStart },
      create: { week_start: weekStart, ...data },
      update: data,
    });
  },

  findAllMonthly(limit = 12) {
    return prisma.monthlyReport.findMany({
      orderBy: { month_start: 'desc' },
      take: limit,
    });
  },

  upsertMonthly(monthStart: Date, data: { content_md: string }) {
    return prisma.monthlyReport.upsert({
      where: { month_start: monthStart },
      create: { month_start: monthStart, ...data },
      update: data,
    });
  },
};
