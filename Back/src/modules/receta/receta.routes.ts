import type { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { requireAuth } from '@/hooks/require.auth.js';

import {
  actualizarRecetaSchema,
  crearRecetaSchema,
  listarRecetasQuerySchema,
  listaRecetasSchema,
  recetaParamsSchema,
  recetaSchema,
} from './receta.schema.js';

export default async function recetaRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = fastify.recetaController;

  app.get('/', {
    schema: {
      tags: ['Recetas'],
      summary: 'Lista las recetas del usuario autenticado (filtrable por tipo y país)',
      querystring: listarRecetasQuerySchema,
      response: { 200: listaRecetasSchema },
    },
    preHandler: [requireAuth],
    handler: controller.listar,
  });

  app.get('/:id', {
    schema: {
      tags: ['Recetas'],
      summary: 'Obtiene una receta por id',
      params: recetaParamsSchema,
      response: { 200: recetaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.obtener,
  });

  app.post('/', {
    schema: {
      tags: ['Recetas'],
      summary: 'Crea una receta',
      body: crearRecetaSchema,
      response: { 201: recetaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.crear,
  });

  app.put('/:id', {
    schema: {
      tags: ['Recetas'],
      summary: 'Actualiza una receta propia',
      params: recetaParamsSchema,
      body: actualizarRecetaSchema,
      response: { 200: recetaSchema },
    },
    preHandler: [requireAuth],
    handler: controller.actualizar,
  });

  app.delete('/:id', {
    schema: {
      tags: ['Recetas'],
      summary: 'Elimina una receta propia',
      params: recetaParamsSchema,
    },
    preHandler: [requireAuth],
    handler: controller.eliminar,
  });
}
