import type { FastifyReply, FastifyRequest } from 'fastify';

export async function apiKeyMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key'] as string | undefined;
  const expectedKey = process.env.HERMES_API_KEY;

  if (!expectedKey) {
    request.log.warn('HERMES_API_KEY not configured');
    return reply.status(500).send({
      success: false,
      message: 'Server misconfiguration: API key not set',
      data: null,
    });
  }

  if (!apiKey || apiKey !== expectedKey) {
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized: Invalid or missing API key',
      data: null,
    });
  }
}
