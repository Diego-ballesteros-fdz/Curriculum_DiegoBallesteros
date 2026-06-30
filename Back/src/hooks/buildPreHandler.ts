import { BaseRoutesOptions } from '@/types/base-routes.types.js';

import { requireAuth } from './require.auth.js';
import { requireSuperAdmin } from './require.superadmin.js';

// Cadena de prehandlers para las rutas base.
// Toda ruta exige sesión; el aislamiento por propietario (OWN vs GLOBAL) lo
// resuelve el scope en la capa de servicio. `requireSuperAdmin` restringe a admin.
export function buildPreHandler(options: BaseRoutesOptions) {
  const handlers: any[] = [requireAuth];

  if (options.auth?.requireSuperAdmin) {
    handlers.push(requireSuperAdmin);
  }

  return handlers;
}
