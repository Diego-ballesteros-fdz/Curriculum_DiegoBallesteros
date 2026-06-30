import fp from 'fastify-plugin';

import { BuzonController } from '@/modules/buzon/buzon.controller.js';
import { ForoController } from '@/modules/foro/foro.controller.js';
import { RecetaController } from '@/modules/receta/receta.controller.js';

// Capa de controladores de dominio (consumen los servicios del plugin 06).
export default fp(
  async (fastify) => {
    fastify.decorate('recetaController', new RecetaController(fastify.recetaService));
    fastify.decorate('foroController', new ForoController(fastify.foroService));
    fastify.decorate('buzonController', new BuzonController(fastify.buzonService));

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
  }
}
