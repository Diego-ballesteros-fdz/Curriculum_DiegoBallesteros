import type { ConversacionMensaje } from '@prisma/client';

import type { UserRepository } from '@/modules/users/users.repository.js';
import type { WSManager } from '@/modules/ws/ws.manager.js';
import { dmRoom } from '@/modules/ws/ws.types.js';
import { HttpError } from '@/utils/http.error.js';

import type { ConversacionRepository, HiloConMensajes } from './buzon.repository.js';
import type { ConversacionDTO, MensajeChatDTO } from './buzon.schema.js';

// El buzón es siempre personal: se filtra por el `userId` de la sesión (no
// aplica el scope GLOBAL del admin, que no tendría sentido para una bandeja).
export class BuzonService {
  constructor(
    private readonly repository: ConversacionRepository,
    private readonly userRepository: UserRepository,
    private readonly wsManager?: WSManager,
  ) {}

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

  // Conversaciones del usuario (el snapshot completo lo compone el controlador,
  // que añade las notificaciones del módulo `notification`).
  async listarConversaciones(userId: string): Promise<ConversacionDTO[]> {
    const threads = await this.repository.findThreads(userId);
    return threads.map((t) => this.toConversacion(t));
  }

  // Devuelve el hilo o uno vacío si aún no existe (permite iniciar conversación).
  async obtenerHilo(userId: string, usuario: string): Promise<ConversacionDTO> {
    const thread = await this.repository.findThread(userId, usuario);
    if (!thread) return { usuario, mensajes: [] };
    return this.toConversacion(thread);
  }

  async enviar(userId: string, usuario: string, texto: string): Promise<MensajeChatDTO> {
    // 1) Lado del emisor: persiste en su bandeja y sincroniza sus sesiones.
    const thread = await this.repository.upsertThread(userId, usuario);
    const mensaje = await this.repository.addMessage(thread.id, { texto, propio: true });
    await this.repository.touchThread(thread.id);
    const dto = this.toMensajeChat(mensaje);
    this.wsManager?.broadcastToUser(userId, {
      event: 'dm:message',
      room: dmRoom(usuario),
      payload: { ...dto, conversacionId: thread.id },
    });

    // 2) Entrega cruzada: si el handle corresponde a un usuario real, refleja el
    //    mensaje en SU bandeja (hilo con el nombre del emisor) y se lo empuja.
    await this.entregarADestinatario(userId, usuario, texto);

    return dto;
  }

  private async entregarADestinatario(
    senderId: string,
    handleDestino: string,
    texto: string,
  ): Promise<void> {
    const destinatario = await this.userRepository.findByName(handleDestino);
    if (!destinatario || destinatario.id === senderId) return;

    const emisor = await this.userRepository.findById(senderId);
    const handleEmisor = emisor?.name?.trim() || 'Usuario';

    const hilo = await this.repository.upsertThread(destinatario.id, handleEmisor);
    const mensaje = await this.repository.addMessage(hilo.id, { texto, propio: false });
    await this.repository.touchThread(hilo.id);

    this.wsManager?.broadcastToUser(destinatario.id, {
      event: 'dm:message',
      room: dmRoom(handleEmisor),
      payload: { ...this.toMensajeChat(mensaje), conversacionId: hilo.id },
    });
  }

  async marcarLeido(userId: string, usuario: string): Promise<{ count: number }> {
    const thread = await this.repository.findThread(userId, usuario);
    if (!thread) throw new HttpError(404, 'Conversación no encontrada');
    return this.repository.markThreadRead(thread.id);
  }

  /**
   * ¿El usuario puede acceder al hilo con `peer`? En el modelo de bandeja por
   * usuario una conversación válida es con un interlocutor REAL y distinto
   * (cualquiera puede iniciar un DM con cualquier usuario existente). Sirve para
   * blindar el `dm:join` del WebSocket: un tercero no participante no entra en la
   * sala del hilo. La lectura del histórico ya está acotada por `userId` en REST.
   */
  async puedeAccederAlHilo(userId: string, peer: string): Promise<boolean> {
    const interlocutor = await this.userRepository.findByName(peer);
    return interlocutor !== null && interlocutor.id !== userId;
  }
}
