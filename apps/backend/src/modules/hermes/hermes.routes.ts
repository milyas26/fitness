import type { FastifyInstance } from 'fastify';
import { apiKeyMiddleware } from '../../middleware/api-key.js';
import { hermesIngestService } from './hermes-ingest.service.js';
import { hermesConversationService } from './hermes-conversation.service.js';
import { hermesContextService } from './hermes-context.service.js';
import {
  hermesIngestSchema,
  hermesConversationSchema,
  contextQuerySchema,
} from '@fitness/shared';

export async function hermesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', apiKeyMiddleware);

  app.post('/ingest', async (request, reply) => {
    const body = hermesIngestSchema.parse(request.body);
    const result = await hermesIngestService.ingest(body);
    return reply.status(201).send({
      success: true,
      message: result.status === 'duplicate' ? 'Duplicate request' : 'Ingested',
      data: result,
    });
  });

  app.post('/conversation', async (request, reply) => {
    const body = hermesConversationSchema.parse(request.body);
    const data = await hermesConversationService.save(body);
    return reply.status(201).send({ success: true, message: '', data });
  });

  app.get('/context/daily', async (request, reply) => {
    const query = contextQuerySchema.parse(request.query);
    const data = await hermesContextService.getDailyContext(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/context/weekly', async (request, reply) => {
    const query = contextQuerySchema.parse(request.query);
    const data = await hermesContextService.getWeeklyContext(query.date);
    return reply.send({ success: true, message: '', data });
  });

  app.get('/context/monthly', async (request, reply) => {
    const query = contextQuerySchema.parse(request.query);
    const data = await hermesContextService.getMonthlyContext(query.date);
    return reply.send({ success: true, message: '', data });
  });
}
