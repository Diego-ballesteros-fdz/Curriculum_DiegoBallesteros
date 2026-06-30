import type { FastifyInstance } from 'fastify';

import { crearMensajeForoSchema } from '@/modules/foro/foro.schema.js';

import type { WSManager } from '../ws.manager.js';
import { ROOM_FORO, type WSClient, type WSMessage } from '../ws.types.js';

// ==========================================
// HANDLER DEL FORO
// ==========================================
//
// - `foro:join`    → suscribe el socket a la sala global "foro".
// - `foro:message` → delega en `foroService.crear`; el PROPIO service difunde el
//   mensaje a la sala "foro" (mismo punto que usa el POST REST), así que aquí no
//   reenviamos nada: evitamos duplicar la difusión.

export async function handleForo(
  fastify: FastifyInstance,
  manager: WSManager,
  client: WSClient,
  message: WSMessage,
): Promise<void> {
  switch (message.event) {
    case 'foro:join':
      manager.join(client, ROOM_FORO);
      return;

    case 'foro:message': {
      const parsed = crearMensajeForoSchema.safeParse(message.payload);
      if (!parsed.success) {
        manager.send(client, {
          event: 'error',
          payload: { message: 'Mensaje de foro inválido' },
        });
        return;
      }
      // El service persiste y difunde a la sala "foro" vía wsManager.
      await fastify.foroService.crear(parsed.data, client.userId);
      return;
    }
  }
}
