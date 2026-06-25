import { z } from "zod";

/**
 * Contrato del foro gastronómico.
 *
 * Es la fuente de verdad para los mensajes del foro entre el cliente y el
 * (futuro) backend REST. La lista se renderiza a partir de `MensajeForo` y el
 * formulario de publicación valida contra `nuevoMensajeForoSchema`, de modo que
 * el backend podrá reutilizar el mismo esquema para validar `POST /api/foro`.
 */

/** Mensaje tal y como llega del feed del foro. */
export const mensajeForoSchema = z.object({
  id: z.string(),
  autor: z.string(),
  texto: z.string(),
  /** Fecha de publicación en ISO 8601 (UTC) que emite el backend. */
  fecha: z.string(),
});

export type MensajeForo = z.infer<typeof mensajeForoSchema>;

export const TEXTO_MAX = 1000;

/** Datos que envía el formulario para publicar un mensaje nuevo. */
export const nuevoMensajeForoSchema = z.object({
  autor: z
    .string()
    .trim()
    .min(3, "Indica un nombre de usuario (mínimo 3 caracteres)")
    .max(30, "El nombre de usuario no puede superar los 30 caracteres"),
  texto: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(TEXTO_MAX, `El comentario no puede superar los ${TEXTO_MAX} caracteres`),
});

export type NuevoMensajeForoValues = z.input<typeof nuevoMensajeForoSchema>;
export type NuevoMensajeForoInput = z.output<typeof nuevoMensajeForoSchema>;
