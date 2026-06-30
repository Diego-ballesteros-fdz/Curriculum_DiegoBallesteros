import type { FastifyRequest } from 'fastify';

import type { ScopeContext } from '@/types/base.types.js';

// Deriva el alcance de acceso desde la sesión:
//   superadmin (better-auth) → GLOBAL (todos los registros)
//   resto                    → OWN (solo los suyos, por userId)
export function scopeFromRequest(request: FastifyRequest): ScopeContext | undefined {
  const user = request.session?.user;
  if (!user) return undefined;

  return {
    scope: user.isSuperAdmin ? 'GLOBAL' : 'OWN',
    userId: user.id,
  };
}

export function requireScope(request: FastifyRequest): ScopeContext | undefined {
  return scopeFromRequest(request);
}
