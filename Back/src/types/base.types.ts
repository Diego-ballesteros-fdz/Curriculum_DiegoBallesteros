// Alcance de acceso simplificado para la red social.
//   GLOBAL → superadmin (better-auth isSuperAdmin): ve/gestiona todos los registros.
//   OWN    → usuario estándar: solo sus propios registros (por userId).
export type Scope = 'GLOBAL' | 'OWN';

export interface ScopeContext {
  scope: Scope;
  userId?: string;
}

export interface WriteOptions {
  userId?: string;
  scope?: ScopeContext;
  include?: any;
  select?: any;
}
