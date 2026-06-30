import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { WebSocket } from '@fastify/websocket';

import { authenticateFromRequest, authenticateFromToken } from './ws.auth.js';
import { handleDm } from './handlers/dm.handler.js';
import { handleForo } from './handlers/foro.handler.js';
import type { WSManager } from './ws.manager.js';
import type { WSClient, WSMessage } from './ws.types.js';

// ==========================================
// ROUTER DE CONEXIÓN WEBSOCKET
// ==========================================
//
// Crea el handler de `GET /api/ws`. Responsabilidades:
//  1. Autenticar (handshake con cookie, o mensaje `auth` con sessionToken).
//  2. Registrar/limpiar el cliente en el `WSManager`.
//  3. Enrutar cada evento entrante a su handler (foro / dm) y el heartbeat.

const AUTH_TIMEOUT_MS = 10_000; // margen para enviar el mensaje `auth`
const CLOSE_UNAUTHORIZED = 4001;

export function createWSConnectionHandler(fastify: FastifyInstance, manager: WSManager) {
  return async function onConnection(socket: WebSocket, request: FastifyRequest): Promise<void> {
    let client: WSClient | null = null;

    const registrar = (userId: string): WSClient => {
      const nuevo: WSClient = {
        socket,
        userId,
        connectedAt: Date.now(),
        rooms: new Set(),
      };
      manager.register(nuevo);
      manager.send(nuevo, { event: 'auth', payload: { ok: true, userId } });
      return nuevo;
    };

    // 1) Intento de auth por handshake (cookie ya presente en el upgrade).
    const porCookie = await authenticateFromRequest(fastify, request);
    if (porCookie) {
      client = registrar(porCookie.userId);
    }

    // Si no se autenticó por cookie, exigimos el mensaje `auth` a tiempo.
    const authTimer =
      client === null
        ? setTimeout(() => {
            if (client === null) socket.close(CLOSE_UNAUTHORIZED, 'Unauthorized');
          }, AUTH_TIMEOUT_MS)
        : null;

    socket.on('message', async (raw: Buffer | ArrayBuffer | Buffer[]) => {
      const message = parseMessage(raw);
      if (!message) return; // frame no-JSON o sin forma de WSMessage: lo ignoramos

      // Heartbeat: disponible incluso antes de autenticar (evita timeouts de proxy).
      if (message.event === 'ping') {
        socket.send(JSON.stringify({ event: 'pong' } satisfies WSMessage));
        return;
      }

      // 2) Aún sin autenticar: solo se acepta `auth`.
      if (client === null) {
        if (message.event !== 'auth') {
          socket.close(CLOSE_UNAUTHORIZED, 'Unauthorized');
          return;
        }
        const token = extraerToken(message.payload);
        const resultado = token ? await authenticateFromToken(fastify, token) : null;
        if (!resultado) {
          socket.close(CLOSE_UNAUTHORIZED, 'Unauthorized');
          return;
        }
        if (authTimer) clearTimeout(authTimer);
        client = registrar(resultado.userId);
        return;
      }

      // 3) Autenticado: enrutamos por prefijo de evento.
      try {
        await route(fastify, manager, client, message);
      } catch (error) {
        fastify.log.error({ error, event: message.event }, 'WS error procesando evento');
        manager.send(client, { event: 'error', payload: { message: 'Error procesando el evento' } });
      }
    });

    socket.on('close', () => {
      if (authTimer) clearTimeout(authTimer);
      if (client) manager.unregister(client);
    });

    socket.on('error', (error: Error) => {
      fastify.log.warn({ error }, 'WS socket error');
    });
  };
}

async function route(
  fastify: FastifyInstance,
  manager: WSManager,
  client: WSClient,
  message: WSMessage,
): Promise<void> {
  if (message.event.startsWith('foro:')) return handleForo(fastify, manager, client, message);
  if (message.event.startsWith('dm:')) return handleDm(fastify, manager, client, message);
  // 'auth' repetido, 'pong', 'notification:new' (server→client), etc.: sin acción.
}

function parseMessage(raw: Buffer | ArrayBuffer | Buffer[]): WSMessage | null {
  try {
    const text = Array.isArray(raw) ? Buffer.concat(raw).toString() : raw.toString();
    const obj = JSON.parse(text) as Partial<WSMessage>;
    if (!obj || typeof obj.event !== 'string') return null;
    return obj as WSMessage;
  } catch {
    return null;
  }
}

function extraerToken(payload: unknown): string | null {
  if (payload && typeof payload === 'object' && 'sessionToken' in payload) {
    const token = (payload as { sessionToken: unknown }).sessionToken;
    return typeof token === 'string' ? token : null;
  }
  return null;
}
