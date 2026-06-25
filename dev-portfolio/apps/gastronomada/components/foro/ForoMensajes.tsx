"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import {
  nuevoMensajeForoSchema,
  TEXTO_MAX,
  type MensajeForo,
  type NuevoMensajeForoInput,
  type NuevoMensajeForoValues,
} from "@/lib/schemas/foro";
import MensajeCard from "@/components/foro/MensajeCard";

const inputClass =
  "w-full rounded-lg border border-app-border bg-surface-2 px-4 py-2.5 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-50";

export default function ForoMensajes({ initial }: { initial: MensajeForo[] }) {
  const [mensajes, setMensajes] = useState<MensajeForo[]>(initial);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NuevoMensajeForoValues, unknown, NuevoMensajeForoInput>({
    resolver: zodResolver(nuevoMensajeForoSchema),
    defaultValues: { autor: "", texto: "" },
  });

  const texto = watch("texto") ?? "";

  function onSubmit(values: NuevoMensajeForoInput) {
    // En el futuro: `await api.post("/foro", values)` y usar el mensaje devuelto
    // por el backend (con su id y fecha reales) en lugar de generarlo aquí.
    const nuevo: MensajeForo = {
      id: crypto.randomUUID(),
      autor: values.autor,
      texto: values.texto,
      fecha: new Date().toISOString(),
    };
    setMensajes((prev) => [...prev, nuevo]);
    // Conservamos el nombre de usuario y limpiamos el comentario.
    reset({ autor: values.autor, texto: "" });
  }

  function responder(autor: string) {
    setValue("texto", `@${autor} `, { shouldDirty: true });
    setFocus("texto");
  }

  return (
    <div className="space-y-8">
      <section className="max-h-[70vh] space-y-3 overflow-y-auto rounded-2xl bg-surface-2 p-4">
        {mensajes.map((mensaje) => (
          <MensajeCard key={mensaje.id} mensaje={mensaje} onResponder={responder} />
        ))}
      </section>

      <section className="rounded-2xl bg-surface p-6 shadow-lg">
        <h2 className="text-lg font-bold text-surface-fg">Deja tu comentario</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col gap-4"
          noValidate
        >
          <div>
            <label htmlFor="autor" className="mb-1.5 block text-sm font-medium text-surface-fg">
              Nombre de usuario
            </label>
            <input
              id="autor"
              type="text"
              spellCheck={false}
              placeholder="chef_nomada"
              className={inputClass}
              {...register("autor")}
            />
            {errors.autor && (
              <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
                {errors.autor.message}
              </p>
            )}
          </div>

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
            Enviar comentario
          </button>
        </form>
      </section>
    </div>
  );
}
