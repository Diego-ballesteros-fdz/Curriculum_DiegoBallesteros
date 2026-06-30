import type { ConversacionMensaje } from '@prisma/client';

import { HttpError } from '@/utils/http.error.js';

import type { ConversacionRepository, HiloConMensajes } from './buzon.repository.js';
import type { BuzonSnapshotDTO, ConversacionDTO, MensajeChatDTO } from './buzon.schema.js';

// El buzón es siempre personal: se filtra por el `userId` de la sesión (no
// aplica el scope GLOBAL del admin, que no tendría sentido para una bandeja).
export class BuzonService {
  constructor(private readonly repository: ConversacionRepository) {}

  private toMensajeChat(m: ConversacionMensaje): MensajeChatDTO {
    return {
      id: m.id,
      texto: m.texto,
      fecha: m.fecha.toISOString(),
      propio: m.propio,
      leido: m.leido,
    };
  }

  private toConversacion(hilo: HiloConMensajes): ConversacionDTO {
    return {
      usuario: hilo.usuario,
      mensajes: hilo.mensajes.map((m) => this.toMensajeChat(m)),
    };
  }

  async snapshot(userId: string): Promise<BuzonSnapshotDTO> {
    const threads = await this.repository.findThreads(userId);
    return {
      conversaciones: threads.map((t) => this.toConversacion(t)),
      notificaciones: [], // sin modelo de notificaciones todavía (ver FRONT.md)
    };
  }

  // Devuelve el hilo o uno vacío si aún no existe (permite iniciar conversación).
  async obtenerHilo(userId: string, usuario: string): Promise<ConversacionDTO> {
    const thread = await this.repository.findThread(userId, usuario);
    if (!thread) return { usuario, mensajes: [] };
    return this.toConversacion(thread);
  }

  async enviar(userId: string, usuario: string, texto: string): Promise<MensajeChatDTO> {
    const thread = await this.repository.upsertThread(userId, usuario);
    const mensaje = await this.repository.addMessage(thread.id, { texto, propio: true });
    await this.repository.touchThread(thread.id);
    return this.toMensajeChat(mensaje);
  }

  async marcarLeido(userId: string, usuario: string): Promise<{ count: number }> {
    const thread = await this.repository.findThread(userId, usuario);
    if (!thread) throw new HttpError(404, 'Conversación no encontrada');
    return this.repository.markThreadRead(thread.id);
  }
}
