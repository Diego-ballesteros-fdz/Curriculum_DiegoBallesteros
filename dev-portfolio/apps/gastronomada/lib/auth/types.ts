/** Usuario expuesto a la sesión (sin datos sensibles como el hash de contraseña). */
export interface SessionUser {
  id: string;
  usuario: string;
  nombre: string;
  email: string;
}
