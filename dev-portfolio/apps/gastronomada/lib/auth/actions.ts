"use server";

import { redirect } from "next/navigation";

import {
  cambiarPasswordSchema,
  loginSchema,
  registroSchema,
} from "@/lib/schemas/auth";
import {
  cambiarPassword,
  crearUsuario,
  emailExiste,
  usuarioExiste,
  verificarCredenciales,
} from "./users";
import { crearSesion, destruirSesion, getSession } from "./session";

/**
 * Server actions de autenticación.
 *
 * Validan SIEMPRE en el servidor (no confían en el cliente) y devuelven un
 * resultado uniforme. Next protege las server actions frente a CSRF mediante la
 * comprobación de origen, y la cookie de sesión es httpOnly + SameSite=Lax.
 */
export type ResultadoAuth = { ok: true } | { ok: false; error: string };

export async function loginAction(values: unknown): Promise<ResultadoAuth> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Datos no válidos." };

  const user = verificarCredenciales(parsed.data.email, parsed.data.password);
  // Mensaje genérico: no revela si el email existe (evita enumeración de usuarios).
  if (!user) return { ok: false, error: "Correo o contraseña incorrectos." };

  await crearSesion(user.id);
  return { ok: true };
}

export async function registroAction(values: unknown): Promise<ResultadoAuth> {
  const parsed = registroSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Datos no válidos." };

  const { email, usuario, nombre, apellidos, password } = parsed.data;
  if (emailExiste(email)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }
  if (usuarioExiste(usuario)) {
    return { ok: false, error: "Ese nombre de usuario ya está en uso." };
  }

  const user = crearUsuario({ email, usuario, nombre, apellidos, password });
  await crearSesion(user.id);
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  await destruirSesion();
  redirect("/");
}

export async function cambiarPasswordAction(
  values: unknown,
): Promise<ResultadoAuth> {
  const session = await getSession();
  if (!session) return { ok: false, error: "No has iniciado sesión." };

  const parsed = cambiarPasswordSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Datos no válidos." };

  const ok = cambiarPassword(
    session.user.id,
    parsed.data.actual,
    parsed.data.password,
  );
  if (!ok) return { ok: false, error: "La contraseña actual no es correcta." };

  return { ok: true };
}
