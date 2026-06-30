import type { Notification } from '@prisma/client';

import { emitNotification } from '@/modules/ws/handlers/notification.handler.js';
import type { WSManager } from '@/modules/ws/ws.manager.js';

import type { NotificationRepository } from './notification.repository.js';
import type { CrearNotificacionInput, NotificationDTO } from './notification.schema.js';

export class NotificationService {
  // `wsManager` (opcional) empuja la notificación en tiempo real al destinatario.
  constructor(
    private readonly repository: NotificationRepository,
    private readonly wsManager?: WSManager,
  ) {}

  private toDTO(n: Notification): NotificationDTO {
    return {
      id: n.id,
      type: n.type,
      texto: n.texto,
      leido: n.leido,
      from: n.from,
      foroMessageId: n.foroMessageId,
      conversacionId: n.conversacionId,
      fecha: n.fecha.toISOString(),
    };
  }

  async listar(userId: string): Promise<NotificationDTO[]> {
    const rows = await this.repository.findByUser(userId);
    return rows.map((n) => this.toDTO(n));
  }

  /** Persiste una notificación y la empuja por WebSocket al destinatario. */
  async notificar(input: CrearNotificacionInput): Promise<NotificationDTO> {
    const row = await this.repository.create(input);
    const dto = this.toDTO(row);
    if (this.wsManager) emitNotification(this.wsManager, input.userId, dto);
    return dto;
  }

  marcarLeido(id: string, userId: string): Promise<{ count: number }> {
    return this.repository.markRead(id, userId);
  }

  marcarTodoLeido(userId: string): Promise<{ count: number }> {
    return this.repository.markAllRead(userId);
  }
}
