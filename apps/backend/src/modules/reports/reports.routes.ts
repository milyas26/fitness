import type { FastifyInstance } from 'fastify';
import { reportService } from './reports.service.js';
import {
  createDailyReportSchema,
  createWeeklyReportSchema,
  createMonthlyReportSchema,
} from '@fitness/shared';

export async function reportRoutes(app: FastifyInstance) {
  app.get('/daily', async (request, reply) => {
    const query = request.query as { date?: string };
    if (query.date) {
      const data = await reportService.getDailyByDate(query.date);
      if (!data)
        return reply.status(404).send({
          success: false,
          message: 'No report for this date',
          data: null,
        });
      return reply.send({ success: true, message: '', data });
    }
    const data = await reportService.getAllDaily();
    return reply.send({ success: true, message: '', data });
  });

  app.post('/daily', async (request, reply) => {
    const body = createDailyReportSchema.parse(request.body);
    const data = await reportService.upsertDaily(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.get('/weekly', async (_request, reply) => {
    const data = await reportService.getAllWeekly();
    return reply.send({ success: true, message: '', data });
  });

  app.post('/weekly', async (request, reply) => {
    const body = createWeeklyReportSchema.parse(request.body);
    const data = await reportService.upsertWeekly(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.get('/monthly', async (_request, reply) => {
    const data = await reportService.getAllMonthly();
    return reply.send({ success: true, message: '', data });
  });

  app.post('/monthly', async (request, reply) => {
    const body = createMonthlyReportSchema.parse(request.body);
    const data = await reportService.upsertMonthly(body);
    return reply.status(201).send({ success: true, message: '', data });
  });
}
