import type { FastifyReply, FastifyRequest } from 'fastify';

import { parsePagination } from '@/utils/pagination.js';
import { requireScope } from '@/utils/scope.js';

import type { ActualizarRecetaInput, CrearRecetaInput } from './receta.schema.js';
import type { RecetaService } from './receta.service.js';

export class RecetaController {
  constructor(private readonly service: RecetaService) {}

  listar = async (request: FastifyRequest, reply: FastifyReply) => {
    const scope = requireScope(request)!;
    const query = request.query as { tipo?: 'tradicional' | 'moderna'; pais?: string };
    const { skip, take, meta } = parsePagination(request.query as Record<string, unknown>);
    const { data, total } = await this.service.listar(
      scope,
      { skip, take },
      { tipo: query.tipo, pais: query.pais },
    );
    return reply.send({ data, meta: meta(total) });
  };

  obtener = async (request: FastifyRequest, reply: FastifyReply) => {
    const scope = requireScope(request)!;
    const { id } = request.params as { id: string };
    return reply.send(await this.service.obtener(id, scope));
  };

  crear = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.session!.user.id;
    const receta = await this.service.crear(request.body as CrearRecetaInput, userId);
    return reply.status(201).send(receta);
  };

  actualizar = async (request: FastifyRequest, reply: FastifyReply) => {
    const scope = requireScope(request)!;
    const { id } = request.params as { id: string };
    const receta = await this.service.actualizar(id, request.body as ActualizarRecetaInput, scope);
    return reply.send(receta);
  };

  eliminar = async (request: FastifyRequest, reply: FastifyReply) => {
    const scope = requireScope(request)!;
    const { id } = request.params as { id: string };
    await this.service.eliminar(id, scope);
    return reply.status(204).send();
  };
}
