import type { FastifyInstance } from 'fastify';
import { dashboardService } from './dashboard.service.js';
import { dashboardQuerySchema } from '@fitness/shared';

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const query = dashboardQuerySchema.parse(request.query);
    const data = await dashboardService.getToday(query.date);
    return reply.send({ success: true, message: '', data });
  });
}
