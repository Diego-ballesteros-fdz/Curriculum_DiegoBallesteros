import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import type { SessionUser } from "./types";

/**
 * Store de usuarios MOCK en memoria — SOLO DESARROLLO.
 *
 * Sustituye al backend (better-auth + BD) mientras no exista. Las contraseñas se
 * guardan con hash (scrypt + salt por usuario), nunca en claro. Al wirear el
 * backend real, eliminar este archivo y la semilla admin.
 *
 * ⚠️ Es un singleton de módulo: el estado se reinicia al reiniciar el servidor y
 * se comparte entre peticiones (aceptable para mock; inadmisible en producción).
 */
interface StoredUser extends SessionUser {
  /** Formato `salt:hash` en hexadecimal. */
  passwordHash: string;
}

function hashPassword(
  password: string,
  salt: string = randomBytes(16).toString("hex"),
): string {
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function passwordCoincide(password: string, almacenado: string): boolean {
  const [salt, hash] = almacenado.split(":");
  if (!salt || !hash) return false;
  const calculado = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  // Comparación en tiempo constante para evitar timing attacks.
  return (
    calculado.length === original.length &&
    timingSafeEqual(calculado, original)
  );
}

function sinPassword(user: StoredUser): SessionUser {
  const { passwordHash: _omit, ...rest } = user;
  void _omit;
  return rest;
}

// ── Almacén ──────────────────────────────────────────────────────────────────
const usuariosPorId = new Map<string, StoredUser>();
const idPorEmail = new Map<string, string>();
const idPorUsuario = new Map<string, string>();

function registrar(user: StoredUser) {
  usuariosPorId.set(user.id, user);
  idPorEmail.set(user.email.toLowerCase(), user.id);
  idPorUsuario.set(user.usuario.toLowerCase(), user.id);
}

// Hash señuelo para igualar el tiempo de verificación cuando el email no existe
// (evita enumeración de usuarios por timing).
const DUMMY_HASH = hashPassword("contrasena-senuelo-sin-uso");

// Semilla admin (SOLO desarrollo). Credenciales: admin@gastronomada.com / Admin123456
registrar({
  id: "admin",
  usuario: "admin",
  nombre: "Admin",
  email: "admin@gastronomada.com",
  passwordHash: hashPassword("Admin123456"),
});

// ── API del store ────────────────────────────────────────────────────────────
export function buscarPorId(id: string): SessionUser | null {
  const user = usuariosPorId.get(id);
  return user ? sinPassword(user) : null;
}

export function emailExiste(email: string): boolean {
  return idPorEmail.has(email.toLowerCase());
}

export function usuarioExiste(usuario: string): boolean {
  return idPorUsuario.has(usuario.toLowerCase());
}

export function crearUsuario(datos: {
  usuario: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
}): SessionUser {
  const user: StoredUser = {
    id: randomUUID(),
    usuario: datos.usuario,
    nombre: `${datos.nombre} ${datos.apellidos}`.trim(),
    email: datos.email,
    passwordHash: hashPassword(datos.password),
  };
  registrar(user);
  return sinPassword(user);
}

/** Devuelve el usuario si las credenciales son correctas; si no, null. */
export function verificarCredenciales(
  email: string,
  password: string,
): SessionUser | null {
  const id = idPorEmail.get(email.toLowerCase());
  const user = id ? usuariosPorId.get(id) : undefined;
  if (!user) {
    // Verificación señuelo: mismo coste aunque el email no exista.
    passwordCoincide(password, DUMMY_HASH);
    return null;
  }
  if (!passwordCoincide(password, user.passwordHash)) return null;
  return sinPassword(user);
}

/** Cambia la contraseña validando antes la actual. */
export function cambiarPassword(
  id: string,
  actual: string,
  nueva: string,
): boolean {
  const user = usuariosPorId.get(id);
  if (!user || !passwordCoincide(actual, user.passwordHash)) return false;
  user.passwordHash = hashPassword(nueva);
  return true;
}
