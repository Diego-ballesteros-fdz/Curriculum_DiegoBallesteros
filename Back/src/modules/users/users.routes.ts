import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '@/hooks/require.auth.js';

import { buscarUsuariosQuerySchema, listaUsuariosSchema } from './users.schema.js';

export default async function usersRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = fastify.usersController;

  app.get('/', {
    schema: {
      tags: ['Usuarios'],
      summary: 'Busca usuarios por nombre (datos públicos)',
      querystring: buscarUsuariosQuerySchema,
      response: { 200: listaUsuariosSchema },
    },
    preHandler: [requireAuth],
    handler: controller.buscar,
  });
}
