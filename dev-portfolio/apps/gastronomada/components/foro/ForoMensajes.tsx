"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { TEXTO_MAX, type MensajeForo } from "@/lib/schemas/foro";
import { listarForo, publicarMensajeForo } from "@/lib/api/foro";
import { ApiError } from "@/lib/api/http";
import { suscribirseAlForo } from "@/lib/realtime/ws-client";
import MensajeCard from "@/components/foro/MensajeCard";

/**
 * Hilo del foro: carga el feed público desde el backend y permite publicar como
 * el usuario de la sesión (el `autor` lo fija el front, no se pide en el form).
 */

const inputClass =
  "w-full rounded-lg border border-app-border bg-surface-2 px-4 py-2.5 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-50";

const comentarioSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(1, "El comentario no puede estar vacío")
    .max(TEXTO_MAX, `El comentario no puede superar los ${TEXTO_MAX} caracteres`),
});

type ComentarioValues = z.infer<typeof comentarioSchema>;

export default function ForoMensajes({ autor }: { autor: string }) {
  const [mensajes, setMensajes] = useState<MensajeForo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ComentarioValues>({
    resolver: zodResolver(comentarioSchema),
    defaultValues: { texto: "" },
  });

  const texto = watch("texto") ?? "";

  useEffect(() => {
    let activo = true;
    listarForo()
      .then((data) => {
        if (activo) setMensajes(data);
      })
      .catch(() => {
        if (activo) setErrorCarga("No se pudieron cargar los mensajes del foro.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Tiempo real: mensajes nuevos del foro (de cualquier usuario) por WebSocket.
  useEffect(() => suscribirseAlForo((mensaje) => agregarMensaje(mensaje)), []);

  // Añade un mensaje evitando duplicados por id (el eco del WS y la respuesta
  // del POST traen el mismo id de backend).
  function agregarMensaje(nuevo: MensajeForo) {
    setMensajes((prev) =>
      prev.some((m) => m.id === nuevo.id) ? prev : [...prev, nuevo],
    );
  }

  async function onSubmit(values: ComentarioValues) {
    setErrorEnvio(null);
    try {
      const nuevo = await publicarMensajeForo({ autor, texto: values.texto });
      agregarMensaje(nuevo);
      reset({ texto: "" });
    } catch (err) {
      setErrorEnvio(
        err instanceof ApiError ? err.message : "No se pudo publicar el comentario.",
      );
    }
  }

  function responder(autorMensaje: string) {
    setValue("texto", `@${autorMensaje} `, { shouldDirty: true });
    setFocus("texto");
  }

  return (
    <div className="space-y-8">
      <section className="max-h-[70vh] space-y-3 overflow-y-auto rounded-2xl bg-surface-2 p-4">
        {cargando ? (
          <p className="py-8 text-center text-sm text-surface-muted">Cargando mensajes…</p>
        ) : errorCarga ? (
          <p role="alert" className="py-8 text-center text-sm text-destructive">
            {errorCarga}
          </p>
        ) : mensajes.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-muted">
            Aún no hay mensajes. ¡Sé el primero en escribir!
          </p>
        ) : (
          mensajes.map((mensaje) => (
            <MensajeCard key={mensaje.id} mensaje={mensaje} onResponder={responder} />
          ))
        )}
      </section>

      <section className="rounded-2xl bg-surface p-6 shadow-lg">
        <h2 className="text-lg font-bold text-surface-fg">Deja tu comentario</h2>
        <p className="mt-1 text-sm text-surface-muted">
          Publicarás como <span className="font-semibold text-surface-fg">{autor}</span>.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4" noValidate>
          {errorEnvio && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {errorEnvio}
            </p>
          )}

          <div>
            <label htmlFor="texto" className="mb-1.5 block text-sm font-medium text-surface-fg">
              Comentario
            </label>
            <textarea
              id="texto"
              rows={4}
              placeholder="Comparte tu duda o experiencia…"
              className={cn(inputClass, "resize-y")}
              {...register("texto")}
            />
            <div className="mt-1.5 flex items-center justify-between gap-2">
              {errors.texto ? (
                <p role="alert" className="text-xs font-medium text-destructive">
                  {errors.texto.message}
                </p>
              ) : (
                <span />
              )}
              <span className="shrink-0 text-xs text-surface-muted">
                {texto.length}/{TEXTO_MAX}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="self-end rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Publicando…" : "Enviar comentario"}
          </button>
        </form>
      </section>
    </div>
  );
}
