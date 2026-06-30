import fp from 'fastify-plugin';

import { BuzonController } from '@/modules/buzon/buzon.controller.js';
import { ForoController } from '@/modules/foro/foro.controller.js';
import { NotificationController } from '@/modules/notification/notification.controller.js';
import { RecetaController } from '@/modules/receta/receta.controller.js';
import { UsersController } from '@/modules/users/users.controller.js';

// Capa de controladores de dominio (consumen los servicios del plugin 06).
export default fp(
  async (fastify) => {
    fastify.decorate('recetaController', new RecetaController(fastify.recetaService));
    fastify.decorate('foroController', new ForoController(fastify.foroService));
    fastify.decorate(
      'buzonController',
      new BuzonController(fastify.buzonService, fastify.notificationService),
    );
    fastify.decorate(
      'notificationController',
      new NotificationController(fastify.notificationService),
    );
    fastify.decorate('usersController', new UsersController(fastify.usersService));

    fastify.log.info('Controllers ready');
  },
  {
    name: 'controllers',
    dependencies: ['services'],
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    recetaController: RecetaController;
    foroController: ForoController;
    buzonController: BuzonController;
    notificationController: NotificationController;
    usersController: UsersController;
  }
}