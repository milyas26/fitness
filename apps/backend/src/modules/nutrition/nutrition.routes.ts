import type { FastifyInstance } from 'fastify';
import { nutritionService } from './nutrition.service.js';
import { createNutritionEntrySchema, dashboardQuerySchema } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export async function nutritionRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await nutritionService.getByDate(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/today', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await nutritionService.getTodaySummary(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/range', async (request, reply) => {
    const query = request.query as { start?: string; end?: string };
    const startDate = parseDate(query.start);
    const endDate = parseDate(query.end);
    const data = await nutritionService.getDailySummaries(startDate, endDate);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = await nutritionService.getById(id);
    if (!data) return reply.status(404).send({ success: false, message: 'Not found', data: null });
    return reply.send({ success: true, message: '', data });
  });

  app.post('/', async (request, reply) => {
    const body = createNutritionEntrySchema.parse(request.body);
    const data = await nutritionService.create(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = createNutritionEntrySchema.partial().parse(request.body);
    const data = await nutritionService.update(id, body);
    return reply.send({ success: true, message: '', data });
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await nutritionService.delete(id);
    return reply.send({ success: true, message: 'Deleted', data: null });
  });
}
