import type { FastifyInstance } from 'fastify';
import { settingsService } from './settings.service.js';
import { settingsSchema, updateSettingsSchema } from '@fitness/shared';

export async function settingsRoutes(app: FastifyInstance) {
  app.get('/', async (_request, reply) => {
    const data = await settingsService.get();
    return reply.send({ success: true, message: '', data });
  });

  app.put('/', async (request, reply) => {
    const body = settingsSchema.parse(request.body);
    const data = await settingsService.upsert(body);
    return reply.send({ success: true, message: '', data });
  });

  app.patch('/', async (request, reply) => {
    const body = updateSettingsSchema.parse(request.body);
    const data = await settingsService.update(body);
    return reply.send({ success: true, message: '', data });
  });
}
