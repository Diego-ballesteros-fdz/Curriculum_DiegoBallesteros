import type { FastifyReply, FastifyRequest } from 'fastify';

import type { BuscarUsuariosQuery } from './users.schema.js';
import type { UsersService } from './users.service.js';

export class UsersController {
  constructor(private readonly service: UsersService) {}

  buscar = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const { search, limit } = request.query as BuscarUsuariosQuery;
    const data = await this.service.buscar(search, limit, userId);
    return reply.send({ data });
  };
}
