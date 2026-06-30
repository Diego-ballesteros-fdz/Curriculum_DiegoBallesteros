import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '@/hooks/require.auth.js';
import { paginationQuerySchema } from '@/schemas/pagination.schema.js';

import {
  crearMensajeForoSchema,
  listaForoSchema,
  mensajeForoParamsSchema,
  mensajeForoSchema,
} from './foro.schema.js';

export default async function foroRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = fastify.foroController;

  app.get('/', {
    schema: {
      tags: ['Foro'],
      summary: 'Feed público del foro gastronómico',
      querystring: paginationQuerySchema,
      response: { 200: listaForoSchema },
      security: [],
    },
    handler: controller.feed,
  });

  app.post('/', {
    schema: {
      tags: ['Foro'],
      summary: 'Publica un mensaje en el foro',
      body: crearMensajeForoSchema,
      response: { 201: mensajeForoSchema },
    },
    preHandler: [requireAuth],
    handler: controller.crear,
  });

  app.delete('/:id', {
    schema: {
      tags: ['Foro'],
      summary: 'Elimina un mensaje propio del foro',
      params: mensajeForoParamsSchema,
    },
    preHandler: [requireAuth],
    handler: controller.eliminar,
  });
}
