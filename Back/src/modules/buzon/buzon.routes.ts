import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '@/hooks/require.auth.js';

import {
  buzonParamsSchema,
  buzonSnapshotSchema,
  conversacionSchema,
  enviarMensajeSchema,
  marcarLeidoRespuestaSchema,
  mensajeChatSchema,
} from './buzon.schema.js';

export default async function buzonRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = fastify.buzonController;

  app.get('/', {
    schema: {
      tags: ['Buzón'],
      summary: 'Snapshot del buzón (conversaciones + notificaciones)',
      response: { 200: buzonSnapshotSchema },
    },
    preHandler: [requireAuth],
    handler: controller.snapshot,
  });

  app.get('/:usuario', {
    schema: {
      tags: ['Buzón'],
      summary: 'Hilo de conversación con un usuario',
      params: buzonParamsSchema,
      response: { 200: conversacionSchema },
    },
    preHandler: [requireAuth],
    handler: controller.hilo,
  });

  app.post('/:usuario', {
    schema: {
      tags: ['Buzón'],
      summary: 'Envía un mensaje en un hilo (lo crea si no existe)',
      params: buzonParamsSchema,
      body: enviarMensajeSchema,
      response: { 201: mensajeChatSchema },
    },
    preHandler: [requireAuth],
    handler: controller.enviar,
  });

  app.patch('/:usuario/leido', {
    schema: {
      tags: ['Buzón'],
      summary: 'Marca como leídos los mensajes recibidos del hilo',
      params: buzonParamsSchema,
      response: { 200: marcarLeidoRespuestaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.marcarLeido,
  });
}
