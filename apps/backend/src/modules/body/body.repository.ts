import { prisma } from '../../plugins/prisma.js';

export const bodyRepository = {
  findByDate(date: Date) {
    return prisma.bodyMeasurement.findUnique({ where: { date } });
  },

  upsert(
    date: Date,
    data: { morning_weight_kg: number; waist_cm: number | null; source: string },
  ) {
    return prisma.bodyMeasurement.upsert({
      where: { date },
      create: { date, ...data },
      update: data,
    });
  },

  delete(date: Date) {
    return prisma.bodyMeasurement.delete({ where: { date } });
  },

  findDateRange(startDate: Date, endDate: Date) {
    return prisma.bodyMeasurement.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });
  },
};
