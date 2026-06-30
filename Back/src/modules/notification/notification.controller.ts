import type { FastifyReply, FastifyRequest } from 'fastify';

import type { NotificationService } from './notification.service.js';

export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  listar = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    return reply.send({ data: await this.service.listar(userId) });
  };

  marcarLeido = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const { id } = request.params as { id: string };
    return reply.send(await this.service.marcarLeido(id, userId));
  };

  marcarTodoLeido = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    return reply.send(await this.service.marcarTodoLeido(userId));
  };
}
