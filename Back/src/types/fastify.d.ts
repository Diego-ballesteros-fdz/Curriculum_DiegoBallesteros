import { PrismaClient } from '@prisma/client';
import type { Auth } from 'better-auth';

import type { RateLimitTiers } from '@/plugins/02.security.js';
import type { WSManager } from '@/modules/ws/ws.manager.js';

type BetterAuthInstance = Auth;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  isSuperAdmin: boolean;
  rol: 'MIEMBRO' | 'NO_MIEMBRO';
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSession {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    rateLimitTiers: RateLimitTiers;
    auth: BetterAuthInstance;
    wsManager: WSManager;
  }

  interface FastifyRequest {
    session: AppSession | null; // null cuando no hay sesión activa
  }
}
