import { z } from 'zod';
import type { FastifyInstance } from 'fastify';

import { TEXTO_MAX } from '@/modules/buzon/buzon.schema.js';

import type { WSManager } from '../ws.manager.js';
import { dmRoom, type WSClient, type WSMessage } from '../ws.types.js';

// ==========================================
// HANDLER DE MENSAJES DIRECTOS (buzón)
// ==========================================
//
// - `dm:join`    → suscribe el socket a la sala del hilo `dm:<peer>`, pero solo
//   si el usuario es participante legítimo (el `peer` es un usuario real y
//   distinto); si no, se cierra la conexión con `4003 Forbidden`. Así un tercero
//   no entra en la sala de una conversación ajena.
// - `dm:message` → delega en `buzonService.enviar`; el service persiste en la
//   bandeja del emisor, difunde a sus sesiones y entrega el mensaje en la bandeja
//   del destinatario (resolviendo su handle a un usuario), todo vía
//   `wsManager.broadcastToUser`.

// Código de cierre para un `dm:join` no autorizado (no participante).
const CLOSE_FORBIDDEN = 4003;

const dmJoinSchema = z.object({ peer: z.string().min(1) });

const dmMessageSchema = z.object({
  peer: z.string().min(1),
  texto: z.string().trim().min(1).max(TEXTO_MAX),
});

export async function handleDm(
  fastify: FastifyInstance,
  manager: WSManager,
  client: WSClient,
  message: WSMessage,
): Promise<void> {
  switch (message.event) {
    case 'dm:join': {
      const parsed = dmJoinSchema.safeParse(message.payload);
      if (!parsed.success) return;
      // Defensa en profundidad: solo participantes legítimos entran en la sala.
      const permitido = await fastify.buzonService.puedeAccederAlHilo(
        client.userId,
        parsed.data.peer,
      );
      if (!permitido) {
        client.socket.close(CLOSE_FORBIDDEN, 'Forbidden');
        return;
      }
      manager.join(client, dmRoom(parsed.data.peer));
      return;
    }

    case 'dm:message': {
      const parsed = dmMessageSchema.safeParse(message.payload);
      if (!parsed.success) {
        manager.send(client, {
          event: 'error',
          payload: { message: 'Mensaje directo inválido' },
        });
        return;
      }
      // El service persiste y difunde al usuario emisor vía wsManager.
      await fastify.buzonService.enviar(client.userId, parsed.data.peer, parsed.data.texto);
      return;
    }
  }
}
