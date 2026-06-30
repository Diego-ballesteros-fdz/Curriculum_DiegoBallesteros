import type { Notification, PrismaClient } from '@prisma/client';

import type { CrearNotificacionInput } from './notification.schema.js';

// Repositorio de notificaciones (bandeja personal por `userId`).
export class NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // Notificaciones del usuario, más recientes primero.
  findByUser(userId: string, limit = 50): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { fecha: 'desc' },
      take: limit,
    });
  }

  create(input: CrearNotificacionInput): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        texto: input.texto,
        from: input.from ?? null,
        foroMessageId: input.foroMessageId ?? null,
        conversacionId: input.conversacionId ?? null,
      },
    });
  }

  // Marca una notificación como leída (solo si es del usuario).
  markRead(id: string, userId: string): Promise<{ count: number }> {
    return this.prisma.notification.updateMany({
      where: { id, userId, leido: false },
      data: { leido: true },
    });
  }

  markAllRead(userId: string): Promise<{ count: number }> {
    return this.prisma.notification.updateMany({
      where: { userId, leido: false },
      data: { leido: true },
    });
  }
}
