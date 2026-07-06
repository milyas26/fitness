import type { FastifyInstance } from 'fastify';
import { bodyService } from './body.service.js';
import { createBodyMeasurementSchema, dashboardQuerySchema } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export async function bodyRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await bodyService.getByDate(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/range', async (request, reply) => {
    const query = request.query as { start?: string; end?: string };
    const startDate = parseDate(query.start);
    const endDate = parseDate(query.end);
    const data = await bodyService.getRange(startDate, endDate);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/trend', async (request, reply) => {
    const query = request.query as { start?: string; end?: string; days?: string };
    const days = parseInt(query.days || '30', 10);
    const endDate = query.end
      ? parseDate(query.end)
      : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1));
    const startDate = query.start
      ? parseDate(query.start)
      : new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    const data = await bodyService.getWeightTrend(startDate, endDate);
    return reply.send({ success: true, message: '', data });
  });

  app.post('/', async (request, reply) => {
    const body = createBodyMeasurementSchema.parse(request.body);
    const data = await bodyService.record(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.delete('/:date', async (request, reply) => {
    const { date } = request.params as { date: string };
    await bodyService.delete(date);
    return reply.send({ success: true, message: 'Deleted', data: null });
  });
}
