import { Conversacion, ConversacionMensaje, PrismaClient } from '@prisma/client';

import { BaseRepository } from '@/repositories/base.repository.js';

// Hilo con sus mensajes embebidos (forma que consume el servicio).
export type HiloConMensajes = Conversacion & { mensajes: ConversacionMensaje[] };

// Repositorio del buzón. Además del CRUD de hilos (BaseRepository), añade los
// accesos a los mensajes anidados (`ConversacionMensaje`).
export class ConversacionRepository extends BaseRepository<Conversacion> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'conversacion');
  }

  // Hilos del usuario, más reciente primero, con sus mensajes cronológicos.
  findThreads(userId: string): Promise<HiloConMensajes[]> {
    return this.prisma.conversacion.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { mensajes: { orderBy: { fecha: 'asc' } } },
    });
  }

  findThread(userId: string, usuario: string): Promise<HiloConMensajes | null> {
    return this.prisma.conversacion.findFirst({
      where: { userId, usuario },
      include: { mensajes: { orderBy: { fecha: 'asc' } } },
    });
  }

  // Crea el hilo si no existe (clave única userId+usuario).
  upsertThread(userId: string, usuario: string): Promise<Conversacion> {
    return this.prisma.conversacion.upsert({
      where: { userId_usuario: { userId, usuario } },
      create: { userId, usuario },
      update: {},
    });
  }

  addMessage(
    conversacionId: string,
    data: { texto: string; propio: boolean },
  ): Promise<ConversacionMensaje> {
    return this.prisma.conversacionMensaje.create({
      data: { conversacionId, texto: data.texto, propio: data.propio },
    });
  }

  touchThread(conversacionId: string): Promise<Conversacion> {
    return this.prisma.conversacion.update({
      where: { id: conversacionId },
      data: { updatedAt: new Date() },
    });
  }

  // Marca como leídos los mensajes recibidos (no propios) del hilo.
  markThreadRead(conversacionId: string): Promise<{ count: number }> {
    return this.prisma.conversacionMensaje.updateMany({
      where: { conversacionId, propio: false, leido: false },
      data: { leido: true },
    });
  }
}
