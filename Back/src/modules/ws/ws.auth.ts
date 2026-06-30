import { fromNodeHeaders } from 'better-auth/node';
import type { FastifyInstance, FastifyRequest } from 'fastify';

// ==========================================
// AUTENTICACIÓN DEL WEBSOCKET (Better Auth)
// ==========================================
//
// El WS se autentica con la MISMA sesión de Better Auth que el resto de la API.
// Soportamos dos vías:
//
//  1) Handshake: si la petición de upgrade ya trae la cookie de sesión firmada
//     (front en el mismo origen o tras un proxy), se valida con `getSession`.
//  2) Mensaje `auth`: `{ event: "auth", payload: { sessionToken } }`. Aquí el
//     `sessionToken` es el `session.token` que el front obtiene de `getSession`
//     (no la cookie httpOnly, que el navegador no puede leer). Como ese token es
//     el identificador de sesión SIN firmar, no sirve reconstruir la cookie; se
//     valida directamente contra la tabla `Session` (token único, vigente).

export interface WSAuthResult {
  userId: string;
}

/** Valida la sesión a partir de las cabeceras del handshake (cookie incluida). */
export async function authenticateFromRequest(
  fastify: FastifyInstance,
  request: FastifyRequest,
): Promise<WSAuthResult | null> {
  try {
    const session = await fastify.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });
    if (!session?.user?.id) return null;
    return { userId: session.user.id };
  } catch (error) {
    fastify.log.warn({ error }, 'WS auth: fallo validando handshake');
    return null;
  }
}

/** Valida la sesión a partir del `session.token` recibido en el mensaje `auth`. */
export async function authenticateFromToken(
  fastify: FastifyInstance,
  sessionToken: string,
): Promise<WSAuthResult | null> {
  if (!sessionToken || typeof sessionToken !== 'string') return null;
  try {
    const session = await fastify.prisma.session.findUnique({
      where: { token: sessionToken },
      select: { userId: true, expiresAt: true, isValid: true },
    });
    if (!session || !session.isValid || session.expiresAt.getTime() < Date.now()) {
      return null;
    }
    return { userId: session.userId };
  } catch (error) {
    fastify.log.warn({ error }, 'WS auth: fallo validando token de sesión');
    return null;
  }
}
