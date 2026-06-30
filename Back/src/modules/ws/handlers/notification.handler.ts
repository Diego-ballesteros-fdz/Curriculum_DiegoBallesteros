import type { WSManager } from '../ws.manager.js';
import { notificationsRoom } from '../ws.types.js';

// ==========================================
// HANDLER DE NOTIFICACIONES (server → client)
// ==========================================
//
// Las notificaciones son SIEMPRE iniciadas por el servidor: no hay evento
// entrante de cliente que procesar aquí. Este módulo expone el emisor que el
// resto del sistema usa para empujar una notificación a un usuario concreto
// (todas sus sesiones) cuando exista el modelo de notificaciones.
//
// El `payload` es opaco a esta capa (lo define quien notifica); el front lo
// valida contra su `notificacionSchema` antes de despacharlo al store.

export function emitNotification(
  manager: WSManager,
  userId: string,
  payload: unknown,
): void {
  manager.broadcastToUser(userId, {
    event: 'notification:new',
    room: notificationsRoom(userId),
    payload,
  });
}
