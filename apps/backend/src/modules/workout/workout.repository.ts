import { prisma } from '../../plugins/prisma.js';
import type { Prisma } from '@prisma/client';

export const workoutRepository = {
  findByDate(date: Date) {
    const startOfDay = new Date(date.toISOString().slice(0, 10) + 'T00:00:00.000Z');
    const endOfDay = new Date(date.toISOString().slice(0, 10) + 'T23:59:59.999Z');
    return prisma.workoutSession.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { exercises: { orderBy: { order: 'asc' } } },
      orderBy: { created_at: 'desc' },
    });
  },

  findById(id: string) {
    return prisma.workoutSession.findUnique({
      where: { id },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
  },

  create(data: Prisma.WorkoutSessionCreateInput) {
    return prisma.workoutSession.create({ data });
  },

  update(id: string, data: Prisma.WorkoutSessionUpdateInput) {
    return prisma.workoutSession.update({
      where: { id },
      data,
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
  },

  delete(id: string) {
    return prisma.workoutSession.delete({ where: { id } });
  },

  aggregateByDate(date: Date) {
    const startOfDay = new Date(date.toISOString().slice(0, 10) + 'T00:00:00.000Z');
    const endOfDay = new Date(date.toISOString().slice(0, 10) + 'T23:59:59.999Z');
    return prisma.workoutSession.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { exercises: true },
    });
  },

  findDateRange(startDate: Date, endDate: Date) {
    return prisma.workoutSession.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: { exercises: { orderBy: { order: 'asc' } } },
      orderBy: { date: 'asc' },
    });
  },

  dailySummaries(startDate: Date, endDate: Date) {
    return prisma.workoutSession.findMany({
      where: {
        date: { gte: startDate, lte: endDate },
      },
      include: {
        exercises: true,
      },
      orderBy: { date: 'asc' },
    });
  },
};

export type WorkoutRepository = typeof workoutRepository;
