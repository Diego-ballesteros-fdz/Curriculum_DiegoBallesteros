import { z } from "zod";

/**
 * Contrato de autenticación.
 *
 * Estos esquemas son la única fuente de verdad para los datos de auth que
 * viajan entre el cliente y el (futuro) backend. Tanto los formularios
 * (react-hook-form + zodResolver) como las llamadas a better-auth validan
 * contra ellos, de modo que cuando el backend REST se implemente solo tendrá
 * que reutilizar estos mismos esquemas para validar las peticiones.
 */

/**
 * Longitud mínima de contraseña. Alineada con la política REAL del backend
 * (better-auth valida `minPasswordLength: 8`). El front no debe ser más estricto
 * que el back o rechazaría en cliente credenciales que el servidor sí acepta.
 */
export const PASSWORD_MIN_LENGTH = 8;

// ── Primitivas reutilizables ───────────────────────────────────────────────
export const emailSchema = z.email("Introduce un correo electrónico válido").trim();

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`);

/** Género del perfil. Coincide con los valores del formulario HTML previo (H/M/O). */
export const generoSchema = z.enum(["H", "M", "O"]);

/** Tipo de cociner@. Coincide con los valores del formulario HTML previo (PR/AF). */
export const nivelCocinaSchema = z.enum(["PR", "AF"]);

// ── Inicio de sesión ────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  recordarme: z.boolean().default(false),
});

// ── Registro ─────────────────────────────────────────────────────────────────
export const registroSchema = z
  .object({
    usuario: z
      .string()
      .trim()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
      .max(30, "El nombre de usuario no puede superar los 30 caracteres"),
    nombre: z.string().trim().min(1, "Introduce tu nombre"),
    apellidos: z.string().trim().min(1, "Introduce tus apellidos"),
    email: emailSchema,
    password: passwordSchema,
    confirmarPassword: z.string(),
    genero: generoSchema,
    nivel: nivelCocinaSchema,
    boletin: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

// ── Recuperación de contraseña ────────────────────────────────────────────────
export const recuperarPasswordSchema = z.object({
  email: emailSchema,
});

export const restablecerPasswordSchema = z
  .object({
    token: z.string().min(1, "Token de restablecimiento no válido"),
    password: passwordSchema,
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

// ── Cambio de contraseña (usuario con sesión activa) ──────────────────────────
export const cambiarPasswordSchema = z
  .object({
    actual: z.string().min(1, "Introduce tu contraseña actual"),
    password: passwordSchema,
    confirmarPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  })
  .refine((data) => data.actual !== data.password, {
    message: "La nueva contraseña debe ser distinta de la actual",
    path: ["password"],
  });

// ── Tipos de salida (lo que se envía al backend tras validar/transformar) ──────
export type LoginInput = z.output<typeof loginSchema>;
export type RegistroInput = z.output<typeof registroSchema>;
export type CambiarPasswordInput = z.output<typeof cambiarPasswordSchema>;
export type RecuperarPasswordInput = z.output<typeof recuperarPasswordSchema>;
export type RestablecerPasswordInput = z.output<typeof restablecerPasswordSchema>;
export type Genero = z.output<typeof generoSchema>;
export type NivelCocina = z.output<typeof nivelCocinaSchema>;

// ── Tipos de entrada (valores que maneja react-hook-form en el formulario) ─────
// Difieren de los de salida cuando hay `.default()`: el campo es opcional en la
// entrada y obligatorio en la salida. react-hook-form necesita ambos.
export type LoginFormValues = z.input<typeof loginSchema>;
export type RegistroFormValues = z.input<typeof registroSchema>;
export type CambiarPasswordFormValues = z.input<typeof cambiarPasswordSchema>;
export type RecuperarPasswordFormValues = z.input<typeof recuperarPasswordSchema>;
export type RestablecerPasswordFormValues = z.input<typeof restablecerPasswordSchema>;
