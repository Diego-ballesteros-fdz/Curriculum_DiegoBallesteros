import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyReply, FastifyRequest } from 'fastify';

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const session = await request.server.auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Valid session required',
    });
  }

  // El plugin customSession de better-auth añade isSuperAdmin y rol en runtime,
  // pero el tipo genérico de getSession no los expone; el cast refleja la forma real.
  request.session = session as unknown as NonNullable<typeof request.session>;
}
