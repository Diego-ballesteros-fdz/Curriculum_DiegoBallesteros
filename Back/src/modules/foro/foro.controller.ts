import type { FastifyReply, FastifyRequest } from 'fastify';

import { parsePagination } from '@/utils/pagination.js';
import { requireScope } from '@/utils/scope.js';

import type { CrearMensajeForoInput } from './foro.schema.js';
import type { ForoService } from './foro.service.js';

export class ForoController {
  constructor(private readonly service: ForoService) {}

  feed = async (request: FastifyRequest, reply: FastifyReply) => {
    const { skip, take, meta } = parsePagination(request.query as Record<string, unknown>);
    const { data, total } = await this.service.feed({ skip, take });
    return reply.send({ data, meta: meta(total) });
  };

  crear = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const mensaje = await this.service.crear(request.body as CrearMensajeForoInput, userId);
    return reply.status(201).send(mensaje);
  };

  eliminar = async (request: FastifyRequest, reply: FastifyReply) => {
    const scope = requireScope(request)!;
    const { id } = request.params as { id: string };
    await this.service.eliminar(id, scope);
    return reply.status(204).send();
  };
}
