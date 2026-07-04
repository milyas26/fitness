import { prisma } from '../../plugins/prisma.js';

export const recoveryRepository = {
  findByDate(date: Date) {
    return prisma.recoveryLog.findUnique({ where: { date } });
  },

  upsert(
    date: Date,
    data: {
      sleep_hours: number;
      energy_level: number;
      muscle_soreness: string;
      notes: string | null;
      source: string;
    },
  ) {
    return prisma.recoveryLog.upsert({
      where: { date },
      create: { date, ...data },
      update: data,
    });
  },

  delete(date: Date) {
    return prisma.recoveryLog.delete({ where: { date } });
  },

  findDateRange(startDate: Date, endDate: Date) {
    return prisma.recoveryLog.findMany({
      where: { date: { gte: startDate, lte: endDate } },
      orderBy: { date: 'asc' },
    });
  },
};
