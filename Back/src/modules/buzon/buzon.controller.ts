import type { FastifyReply, FastifyRequest } from 'fastify';

import type { NotificationService } from '@/modules/notification/notification.service.js';

import type { EnviarMensajeInput } from './buzon.schema.js';
import type { BuzonService } from './buzon.service.js';

export class BuzonController {
  constructor(
    private readonly service: BuzonService,
    private readonly notificationService: NotificationService,
  ) {}

  snapshot = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    // El snapshot combina las conversaciones del buzón con las notificaciones
    // persistidas (menciones, etc.) del usuario.
    const [conversaciones, notificaciones] = await Promise.all([
      this.service.listarConversaciones(userId),
      this.notificationService.listar(userId),
    ]);
    return reply.send({ conversaciones, notificaciones });
  };

  hilo = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const { usuario } = request.params as { usuario: string };
    return reply.send(await this.service.obtenerHilo(userId, usuario));
  };

  enviar = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const { usuario } = request.params as { usuario: string };
    const { texto } = request.body as EnviarMensajeInput;
    const mensaje = await this.service.enviar(userId, usuario, texto);
    return reply.status(201).send(mensaje);
  };

  marcarLeido = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const { usuario } = request.params as { usuario: string };
    return reply.send(await this.service.marcarLeido(userId, usuario));
  };
}
