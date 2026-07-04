import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      message: 'Validation error',
      data: error.errors,
    });
  }

  const statusCode = 'statusCode' in error ? (error as FastifyError).statusCode : 500;

  return reply.status(statusCode || 500).send({
    success: false,
    message: error.message || 'Internal server error',
    data: null,
  });
}
