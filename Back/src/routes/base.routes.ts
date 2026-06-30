import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { BaseController } from '@/controllers/base.controller.js';
import { buildPreHandler } from '@/hooks/buildPreHandler.js';
import { BaseRoutesOptions } from '@/types/base-routes.types.js';

export function registerBaseRoutes<T>(
  fastify: FastifyInstance,
  controller: BaseController<T>,
  options: BaseRoutesOptions,
) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const { tags, schemas: s } = options;
  const preHandler = buildPreHandler(options);

  // ==========================================
  // BULK
  // ==========================================

  app.post(
    '/bulk',
    {
      schema: {
        tags,
        body: s.bulkCreateBody,
        response: {
          201: s.bulkResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.createMany(req as any, reply),
  );

  app.delete(
    '/bulk',
    {
      schema: {
        tags,
        body: s.bulkIdsBody,
        response: {
          200: s.bulkResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.softDeleteMany(req as any, reply),
  );

  app.patch(
    '/bulk/restore',
    {
      schema: {
        tags,
        body: s.bulkIdsBody,
        response: {
          200: s.bulkResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.restoreMany(req as any, reply),
  );

  app.delete(
    '/bulk/permanent',
    {
      schema: {
        tags,
        body: s.bulkIdsBody,
        response: {
          200: s.bulkResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.deletePermanentMany(req as any, reply),
  );

  // ==========================================
  // LECTURA
  // ==========================================

  app.get(
    '/',
    {
      schema: {
        tags,
        querystring: s.getManyQuery,
        response: {
          200: s.getManyResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.getAll(req as any, reply),
  );

  app.get(
    '/list',
    {
      schema: {
        tags,
        querystring: s.GetListQuery,
        response: {
          200: s.getListResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.getList(req as any, reply),
  );

  app.get(
    '/:id',
    {
      schema: {
        tags,
        params: s.idParams,
        response: {
          200: s.getOneResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.getById(req as any, reply),
  );

  // ==========================================
  // ESCRITURA INDIVIDUAL
  // ==========================================

  app.post(
    '/',
    {
      schema: {
        tags,
        body: s.createBody,
        response: {
          201: s.createResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.create(req as any, reply),
  );

  app.put(
    '/:id',
    {
      schema: {
        tags,
        params: s.idParams,
        body: s.updateBody,
        response: {
          200: s.updateResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.update(req as any, reply),
  );

  // ==========================================
  // ESTADOS Y BORRADO INDIVIDUAL
  // ==========================================

  app.delete(
    '/:id',
    {
      schema: {
        tags,
        params: s.idParams,
        response: {
          200: s.deleteResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.softDelete(req as any, reply),
  );

  app.patch(
    '/:id/restore',
    {
      schema: {
        tags,
        params: s.idParams,
        response: {
          200: s.restoreResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.restore(req as any, reply),
  );

  app.delete(
    '/:id/permanent',
    {
      schema: {
        tags,
        params: s.idParams,
        response: {
          204: s.deleteResponse,
        },
      },
      preHandler,
    },
    (req, reply) => controller.deletePermanent(req as any, reply),
  );
}
