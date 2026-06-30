import type { FastifyReply, FastifyRequest } from 'fastify';

import { parsePagination } from '@/utils/pagination.js';

import type { ActualizarRecetaInput, CrearRecetaInput } from './receta.schema.js';
import type { RecetaService } from './receta.service.js';

export class RecetaController {
  constructor(private readonly service: RecetaService) {}

  listar = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      type?: 'tradicional' | 'moderna';
      pais?: string;
      mias?: boolean;
    };
    const { skip, take, meta } = parsePagination(request.query as Record<string, unknown>);
    // `mias=true` acota a las recetas del usuario (perfil); si no, listado global.
    const ownerUserId = query.mias ? request.session!.user.id : undefined;
    const { data, total } = await this.service.listar(
      { skip, take },
      { tipo: query.type, pais: query.pais },
      ownerUserId,
    );
    return reply.send({ data, meta: meta(total) });
  };

  obtener = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    return reply.send(await this.service.obtener(id));
  };

  crear = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const receta = await this.service.crear(request.body as CrearRecetaInput, userId);
    return reply.status(201).send(receta);
  };

  actualizar = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = request.session!.user.id;
    const receta = await this.service.actualizar(id, request.body as ActualizarRecetaInput, userId);
    return reply.send(receta);
  };

  eliminar = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const userId = request.session!.user.id;
    await this.service.eliminar(id, userId);
    return reply.status(204).send();
  };
}
