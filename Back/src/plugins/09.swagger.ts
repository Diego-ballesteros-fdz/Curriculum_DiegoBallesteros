import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export default fp(
  async (fastify) => {
    if (fastify.config.SWAGGER_ENABLED !== true) {
      fastify.log.info('Swagger disabled (SWAGGER_ENABLED=false)');
      return;
    }

    await fastify.register(swagger, {
      openapi: {
        openapi: '3.1.0',
        info: {
          title: 'GastroNómada API',
          version: '1.0.0',
          description: [
            'API REST de la red social GastroNómada construida sobre Fastify 5 + Prisma.',
            '',
            '**Autenticación:** gestionada por better-auth bajo `' +
              `${fastify.config.API_PREFIX}/auth/*` +
              '` (email/contraseña y Google). La sesión viaja en la cookie `better-auth.session_token`.',
            '',
            '**Autorización:** el acceso se resuelve por propietario — cada usuario gestiona',
            'sus propios registros (scope OWN); el administrador (superadmin de better-auth)',
            'tiene acceso global (scope GLOBAL). El rol `MIEMBRO`/`NO_MIEMBRO` distingue a los',
            'usuarios de la red.',
            '',
            'La especificación detallada de los endpoints de auth está disponible en el',
            'reference de better-auth (plugin openAPI).',
          ].join('\n'),
          contact: {
            name: 'GastroNómada',
            url: fastify.config.FRONTEND_URL,
          },
        },
        servers: [{ url: fastify.config.BACKEND_URL, description: 'Servidor actual' }],
        tags: [
          { name: 'Health', description: 'Sondas de estado y disponibilidad del servicio.' },
          { name: 'Auth', description: 'Sesión y cuenta gestionadas por better-auth.' },
          { name: 'Recetas', description: 'Recetas del usuario (scope OWN; admin GLOBAL).' },
          {
            name: 'Foro',
            description: 'Foro gastronómico: feed público y publicación autenticada.',
          },
          { name: 'Buzón', description: 'Mensajería directa: conversaciones por usuario.' },
        ],
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'better-auth.session_token',
            },
          },
        },
        // Esto aplica el candado a todo lo que no sea explícitamente público
        security: [{ cookieAuth: [] }],
      },

      transform: (data) => {
        return jsonSchemaTransform(data);
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: `/docs`,
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
        persistAuthorization: true,
      },
      staticCSP: true,
    });

    fastify.log.info(`Swagger UI available at ${fastify.config.API_PREFIX}/docs`);
  },
  {
    name: 'swagger',
    dependencies: ['config'],
  },
);
