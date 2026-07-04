import { prisma } from '../../plugins/prisma.js';
import { dayStr, dateRange } from '../../utils/date.js';
import type { Prisma } from '@prisma/client';

export const nutritionRepository = {
  findByDate(date: Date) {
    const { startOfDay, endOfDay } = dateRange(dayStr(date));
    return prisma.nutritionEntry.findMany({
      where: { entry_date: { gte: startOfDay, lte: endOfDay } },
      orderBy: { created_at: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.nutritionEntry.findUnique({ where: { id } });
  },

  create(data: Prisma.NutritionEntryCreateInput) {
    return prisma.nutritionEntry.create({ data });
  },

  createMany(data: Prisma.NutritionEntryCreateManyInput[]) {
    return prisma.nutritionEntry.createMany({ data });
  },

  update(id: string, data: Prisma.NutritionEntryUpdateInput) {
    return prisma.nutritionEntry.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.nutritionEntry.delete({ where: { id } });
  },

  aggregateByDate(date: Date) {
    const { startOfDay, endOfDay } = dateRange(dayStr(date));
    return prisma.nutritionEntry.aggregate({
      where: { entry_date: { gte: startOfDay, lte: endOfDay } },
      _sum: {
        calories: true,
        protein_g: true,
        carbs_g: true,
        fat_g: true,
        fiber_g: true,
      },
      _count: true,
    });
  },

  findDateRange(startDate: Date, endDate: Date) {
    return prisma.nutritionEntry.findMany({
      where: {
        entry_date: { gte: startDate, lte: endDate },
      },
      orderBy: { entry_date: 'asc' },
    });
  },

  dailySummaries(startDate: Date, endDate: Date) {
    return prisma.nutritionEntry.groupBy({
      by: ['entry_date'],
      where: {
        entry_date: { gte: startDate, lte: endDate },
      },
      _sum: {
        calories: true,
        protein_g: true,
        carbs_g: true,
        fat_g: true,
        fiber_g: true,
      },
      _count: true,
      orderBy: { entry_date: 'asc' },
    });
  },
};

export type NutritionRepository = typeof nutritionRepository;
