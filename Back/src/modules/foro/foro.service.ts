import type { Mensaje } from '@prisma/client';

import type { NotificationService } from '@/modules/notification/notification.service.js';
import type { UserRepository } from '@/modules/users/users.repository.js';
import type { ScopeContext } from '@/types/base.types.js';
import type { WSManager } from '@/modules/ws/ws.manager.js';
import { ROOM_FORO } from '@/modules/ws/ws.types.js';
import { HttpError } from '@/utils/http.error.js';

import type { MensajeRepository } from './foro.repository.js';
import type { CrearMensajeForoInput, MensajeForoDTO } from './foro.schema.js';

// Captura menciones `@token` (letras/números/_/. tras la arroba).
const MENCION_REGEX = /@([\p{L}\p{N}_.]+)/gu;

export class ForoService {
  // `wsManager` difunde a la sala "foro"; `notificationService` + `userRepository`
  // permiten avisar a los usuarios mencionados (`@usuario`). Todos opcionales para
  // no acoplar el dominio a la capa de tiempo real en tests.
  constructor(
    private readonly repository: MensajeRepository,
    private readonly wsManager?: WSManager,
    private readonly notificationService?: NotificationService,
    private readonly userRepository?: UserRepository,
  ) {}

  private toDTO(m: Mensaje): MensajeForoDTO {
    return { id: m.id, autor: m.autor, texto: m.texto, fecha: m.fecha.toISOString() };
  }

  // Feed público: todos los mensajes, sin filtrar por propietario.
  async feed(page: { skip: number; take: number }) {
    const { data, total } = await this.repository.findManyWithCount({
      skip: page.skip,
      take: page.take,
      orderBy: { fecha: 'desc' },
    });
    return { data: data.map((m) => this.toDTO(m)), total };
  }

  async crear(input: CrearMensajeForoInput, userId: string): Promise<MensajeForoDTO> {
    const mensaje = await this.repository.create({
      data: { autor: input.autor, texto: input.texto, userId },
    });
    const dto = this.toDTO(mensaje);
    // Tiempo real: empuja el mensaje a todos los suscritos a la sala "foro".
    this.wsManager?.broadcast(ROOM_FORO, {
      event: 'foro:message',
      room: ROOM_FORO,
      payload: dto,
    });
    // Notifica a los usuarios mencionados (no bloquea la respuesta si algo falla).
    void this.notificarMenciones(dto, userId);
    return dto;
  }

  // Detecta `@usuario` en el texto y crea una notificación de mención por cada
  // usuario real resuelto (excepto el propio autor). Best-effort: los fallos se
  // registran pero no rompen la publicación del mensaje.
  private async notificarMenciones(mensaje: MensajeForoDTO, autorUserId: string): Promise<void> {
    if (!this.notificationService || !this.userRepository) return;

    const tokens = new Set<string>();
    for (const match of mensaje.texto.matchAll(MENCION_REGEX)) tokens.add(match[1]);
    if (tokens.size === 0) return;

    for (const token of tokens) {
      try {
        const usuario = await this.userRepository.findByName(token);
        if (!usuario || usuario.id === autorUserId) continue;
        await this.notificationService.notificar({
          userId: usuario.id,
          type: 'mention',
          texto: `${mensaje.autor} te ha mencionado en el foro`,
          from: mensaje.autor,
          foroMessageId: mensaje.id,
        });
      } catch {
        // Una mención que no se puede resolver no debe afectar al resto.
      }
    }
  }

  // Borrado por propiedad: el autor (OWN) o el admin (GLOBAL).
  async eliminar(id: string, scope: ScopeContext): Promise<void> {
    const existing = await this.repository.findFirst({ where: { id }, scope });
    if (!existing) throw new HttpError(404, 'Mensaje no encontrado');
    await this.repository.delete({ where: { id } });
  }
}
