import type { FastifyReply, FastifyRequest } from 'fastify';

export function responseWrapper(
  _request: FastifyRequest,
  _reply: FastifyReply,
  payload: unknown,
  done: () => void,
) {
  if (typeof payload !== 'string' || !payload.startsWith('{')) {
    done();
    return;
  }

  try {
    const parsed = JSON.parse(payload);
    if ('success' in parsed) {
      done();
      return;
    }
  } catch {
    done();
    return;
  }

  done();
}
