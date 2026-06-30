import { Conversacion, ConversacionMensaje, PrismaClient } from '@prisma/client';

import { BaseRepository } from '@/repositories/base.repository.js';

// Hilo con sus mensajes embebidos (forma que consume el servicio).
export type HiloConMensajes = Conversacion & { mensajes: ConversacionMensaje[] };

// Resumen de hilo para la lista: el último mensaje (en `mensajes`, 0 o 1) y el
// nº de recibidos sin leer.
export type ResumenHilo = HiloConMensajes & { noLeidos: number };

// Repositorio del buzón. Además del CRUD de hilos (BaseRepository), añade los
// accesos a los mensajes anidados (`ConversacionMensaje`).
export class ConversacionRepository extends BaseRepository<Conversacion> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'conversacion');
  }

  // Resúmenes de los hilos del usuario para la LISTA: último mensaje + nº sin
  // leer, ordenados por actividad reciente (último mensaje primero). NO carga el
  // historial completo (eso es bajo demanda en `findThread`). Dos consultas: una
  // para los hilos con su último mensaje, otra para los conteos de no leídos.
  async findThreadSummaries(userId: string): Promise<ResumenHilo[]> {
    const threads = await this.prisma.conversacion.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { mensajes: { orderBy: { fecha: 'desc' }, take: 1 } },
    });
    if (threads.length === 0) return [];

    const counts = await this.prisma.conversacionMensaje.groupBy({
      by: ['conversacionId'],
      where: { conversacion: { userId }, propio: false, leido: false },
      _count: { _all: true },
    });
    const noLeidosPorHilo = new Map(counts.map((c) => [c.conversacionId, c._count._all]));

    return threads.map((t) => ({ ...t, noLeidos: noLeidosPorHilo.get(t.id) ?? 0 }));
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
