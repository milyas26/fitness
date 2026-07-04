import type { FastifyInstance } from 'fastify';
import { workoutService } from './workout.service.js';
import { createWorkoutSessionSchema, dashboardQuerySchema } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export async function workoutRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await workoutService.getByDate(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/today', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await workoutService.todaySummary(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/range', async (request, reply) => {
    const query = request.query as { start?: string; end?: string };
    const startDate = parseDate(query.start);
    const endDate = parseDate(query.end);
    const data = await workoutService.getDailySummaries(startDate, endDate);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await workoutService.getById(id);
    if (!data) return reply.status(404).send({ success: false, message: 'Not found', data: null });
    return reply.send({ success: true, message: '', data });
  });

  app.post('/', async (request, reply) => {
    const body = createWorkoutSessionSchema.parse(request.body);
    const data = await workoutService.create(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = createWorkoutSessionSchema.partial().parse(request.body);
    const data = await workoutService.update(id, body);
    return reply.send({ success: true, message: '', data });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await workoutService.delete(id);
    return reply.send({ success: true, message: 'Deleted', data: null });
  });
}
