import { prisma } from '../../plugins/prisma.js';
import type { Prisma } from '@prisma/client';

export const hermesRepository = {
  findByKey(idempotencyKey: string) {
    return prisma.ingestLog.findUnique({ where: { idempotency_key: idempotencyKey } });
  },

  createIngestLog(data: Prisma.IngestLogCreateInput) {
    return prisma.ingestLog.create({ data });
  },

  createConversation(data: Prisma.HermesConversationCreateInput) {
    return prisma.hermesConversation.create({ data });
  },
};
