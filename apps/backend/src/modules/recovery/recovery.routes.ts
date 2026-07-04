import type { FastifyInstance } from 'fastify';
import { recoveryService } from './recovery.service.js';
import { createRecoveryLogSchema, dashboardQuerySchema } from '@fitness/shared';
import { parseDate } from '../../utils/date.js';

export async function recoveryRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await recoveryService.getByDate(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/range', async (request, reply) => {
    const query = request.query as { start?: string; end?: string };
    const startDate = parseDate(query.start);
    const endDate = parseDate(query.end);
    const data = await recoveryService.getRange(startDate, endDate);
    return reply.send({ success: true, message: '', data });
  });

  app.post('/', async (request, reply) => {
    const body = createRecoveryLogSchema.parse(request.body);
    const data = await recoveryService.log(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.delete('/:date', async (request, reply) => {
    const { date } = request.params as { date: string };
    await recoveryService.delete(date);
    return reply.send({ success: true, message: 'Deleted', data: null });
  });
}
