import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '@/hooks/require.auth.js';

import {
  marcarLeidoRespuestaSchema,
  notificationParamsSchema,
} from './notification.schema.js';

export default async function notificationRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = fastify.notificationController;

  app.get('/', {
    schema: {
      tags: ['Notificaciones'],
      summary: 'Lista las notificaciones del usuario',
    },
    preHandler: [requireAuth],
    handler: controller.listar,
  });

  app.patch('/read', {
    schema: {
      tags: ['Notificaciones'],
      summary: 'Marca todas las notificaciones como leídas',
      response: { 200: marcarLeidoRespuestaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.marcarTodoLeido,
  });

  app.patch('/:id/read', {
    schema: {
      tags: ['Notificaciones'],
      summary: 'Marca una notificación como leída',
      params: notificationParamsSchema,
      response: { 200: marcarLeidoRespuestaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.marcarLeido,
  });
}
