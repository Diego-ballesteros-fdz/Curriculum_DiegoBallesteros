"use client";

import { useState } from "react";
import { useFieldArray, useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DESCRIPCION_MAX,
  NOMBRE_MAX,
  PAISES_RECETA,
  TIPO_RECETA_LABEL,
  tipoRecetaSchema,
  type NuevaRecetaInput,
  type Receta,
} from "@/lib/schemas/receta";

/**
 * Formulario de creación/edición de receta.
 *
 * Usa un esquema PROPIO del formulario (`recetaFormSchema`): los ingredientes y
 * pasos se modelan como `{ valor }[]` para encajar con `useFieldArray`, y al
 * enviar se transforman a la forma del contrato (`NuevaRecetaInput`, con
 * arrays de string). Así la capa de UI no contamina el contrato compartido.
 * La imagen se sube como fichero y se guarda como data URL (base64), que es lo
 * que el backend persiste.
 */

const TAMANO_MAX_IMAGEN = 2 * 1024 * 1024; // 2 MB

const lineaSchema = z.object({ valor: z.string().trim().min(1, "No puede estar vacío") });

const recetaFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "Indica el nombre de la receta")
    .max(NOMBRE_MAX, `Máximo ${NOMBRE_MAX} caracteres`),
  tipo: tipoRecetaSchema,
  pais: z.string().trim().min(1, "Selecciona el país"),
  imagenSrc: z.string().min(1, "Sube una imagen del plato"),
  descripcion: z
    .string()
    .trim()
    .min(1, "Añade una descripción")
    .max(DESCRIPCION_MAX, `Máximo ${DESCRIPCION_MAX} caracteres`),
  raciones: z.string().trim().optional(),
  ingredientes: z.array(lineaSchema).min(1, "Indica al menos un ingrediente"),
  pasos: z.array(lineaSchema).min(1, "Indica al menos un paso"),
});

type RecetaFormValues = z.infer<typeof recetaFormSchema>;

function recetaToValues(receta?: Receta): RecetaFormValues {
  return {
    nombre: receta?.nombre ?? "",
    tipo: receta?.tipo ?? "tradicional",
    pais: receta?.pais ?? "",
    imagenSrc: receta?.imagen.src ?? "",
    descripcion: receta?.detalle?.descripcion ?? "",
    raciones: receta?.detalle?.raciones ?? "",
    ingredientes:
      receta?.detalle?.ingredientes.map((valor) => ({ valor })) ?? [{ valor: "" }],
    pasos: receta?.detalle?.pasos.map((valor) => ({ valor })) ?? [{ valor: "" }],
  };
}

function valuesToInput(values: RecetaFormValues): NuevaRecetaInput {
  return {
    nombre: values.nombre,
    tipo: values.tipo,
    pais: values.pais,
    imagen: { src: values.imagenSrc, alt: values.nombre },
    detalle: {
      descripcion: values.descripcion,
      raciones: values.raciones ? values.raciones : undefined,
      ingredientes: values.ingredientes.map((i) => i.valor),
      pasos: values.pasos.map((p) => p.valor),
    },
  };
}

function leerComoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full rounded-lg border border-app-border bg-surface-2 px-4 py-2.5 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-50";

export default function RecetaForm({
  receta,
  onGuardar,
  onCancelar,
}: {
  receta?: Receta;
  /** Persiste la receta (crear o actualizar). Puede lanzar para mostrar el error. */
  onGuardar: (input: NuevaRecetaInput) => Promise<void>;
  onCancelar: () => void;
}) {
  const [errorImagen, setErrorImagen] = useState<string | null>(null);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RecetaFormValues>({
    resolver: zodResolver(recetaFormSchema),
    defaultValues: recetaToValues(receta),
  });

  const ingredientes = useFieldArray({ control, name: "ingredientes" });
  const pasos = useFieldArray({ control, name: "pasos" });

  const imagenSrc = watch("imagenSrc");

  async function onImagen(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorImagen(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > TAMANO_MAX_IMAGEN) {
      setErrorImagen("La imagen no puede superar los 2 MB.");
      return;
    }
    try {
      const dataUrl = await leerComoDataUrl(file);
      setValue("imagenSrc", dataUrl, { shouldValidate: true });
    } catch {
      setErrorImagen("No se pudo procesar la imagen.");
    }
  }

  async function onSubmit(values: RecetaFormValues) {
    setErrorServidor(null);
    try {
      await onGuardar(valuesToInput(values));
    } catch (err) {
      setErrorServidor(
        err instanceof Error ? err.message : "No se pudo guardar la receta.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-h-[88vh] flex-col gap-5 overflow-y-auto p-6 sm:p-8"
      noValidate
    >
      <h2 className="text-2xl font-bold text-brand">
        {receta ? "Editar receta" : "Subir nueva receta"}
      </h2>

      {errorServidor && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorServidor}
        </p>
      )}

      {/* Nombre */}
      <Campo label="Nombre" htmlFor="nombre" error={errors.nombre?.message}>
        <input id="nombre" type="text" placeholder="Paella valenciana" className={inputClass} {...register("nombre")} />
      </Campo>

      {/* Tipo + País */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo label="Tipo de cocina" htmlFor="tipo" error={errors.tipo?.message}>
          <select id="tipo" className={inputClass} {...register("tipo")}>
            {tipoRecetaSchema.options.map((t) => (
              <option key={t} value={t}>
                {TIPO_RECETA_LABEL[t]}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="País" htmlFor="pais" error={errors.pais?.message}>
          <select id="pais" className={inputClass} defaultValue="" {...register("pais")}>
            <option value="" disabled>
              Selecciona un país
            </option>
            {PAISES_RECETA.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      {/* Imagen */}
      <Campo label="Imagen del plato" htmlFor="imagen" error={errorImagen ?? errors.imagenSrc?.message}>
        <div className="flex items-center gap-4">
          {imagenSrc ? (
            <img src={imagenSrc} alt="Vista previa" className="size-20 rounded-lg object-cover" />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-lg bg-surface-2 text-xs text-surface-muted">
              Sin imagen
            </div>
          )}
          <input
            id="imagen"
            type="file"
            accept="image/*"
            onChange={onImagen}
            className="text-sm text-surface-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-fg hover:file:bg-brand/90"
          />
        </div>
      </Campo>

      {/* Descripción */}
      <Campo label="Descripción" htmlFor="descripcion" error={errors.descripcion?.message}>
        <textarea
          id="descripcion"
          rows={3}
          placeholder="Cuenta qué hace especial a esta receta…"
          className={cn(inputClass, "resize-y")}
          {...register("descripcion")}
        />
      </Campo>

      {/* Raciones */}
      <Campo label="Raciones (opcional)" htmlFor="raciones" error={errors.raciones?.message}>
        <input id="raciones" type="text" placeholder="4 personas" className={inputClass} {...register("raciones")} />
      </Campo>

      {/* Ingredientes */}
      <ListaCampos
        titulo="Ingredientes"
        placeholder="200 g de arroz"
        error={errors.ingredientes?.message ?? errors.ingredientes?.root?.message}
        fields={ingredientes.fields}
        register={(i) => register(`ingredientes.${i}.valor`)}
        errorEn={(i) => errors.ingredientes?.[i]?.valor?.message}
        onAdd={() => ingredientes.append({ valor: "" })}
        onRemove={ingredientes.fields.length > 1 ? (i) => ingredientes.remove(i) : undefined}
      />

      {/* Pasos */}
      <ListaCampos
        titulo="Pasos"
        placeholder="Sofríe la cebolla a fuego medio…"
        ordenada
        error={errors.pasos?.message ?? errors.pasos?.root?.message}
        fields={pasos.fields}
        register={(i) => register(`pasos.${i}.valor`)}
        errorEn={(i) => errors.pasos?.[i]?.valor?.message}
        onAdd={() => pasos.append({ valor: "" })}
        onRemove={pasos.fields.length > 1 ? (i) => pasos.remove(i) : undefined}
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-lg bg-surface-2 px-5 py-2.5 text-sm font-semibold text-surface-fg transition hover:bg-app-bg"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : receta ? "Guardar cambios" : "Publicar receta"}
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-surface-fg">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Lista dinámica de líneas de texto (ingredientes o pasos). */
function ListaCampos({
  titulo,
  placeholder,
  ordenada = false,
  error,
  fields,
  register,
  errorEn,
  onAdd,
  onRemove,
}: {
  titulo: string;
  placeholder: string;
  ordenada?: boolean;
  error?: string;
  fields: { id: string }[];
  register: (index: number) => UseFormRegisterReturn;
  errorEn: (index: number) => string | undefined;
  onAdd: () => void;
  onRemove?: (index: number) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-surface-fg">{titulo}</legend>
      <div className="space-y-2">
        {fields.map((field, i) => (
          <div key={field.id}>
            <div className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-xs text-surface-muted">
                {ordenada ? `${i + 1}.` : "•"}
              </span>
              <input type="text" placeholder={placeholder} className={inputClass} {...register(i)} />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  aria-label={`Eliminar ${titulo.toLowerCase()} ${i + 1}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-surface-muted transition-colors hover:bg-surface-2 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            {errorEn(i) && (
              <p role="alert" className="ml-7 mt-1 text-xs font-medium text-destructive">
                {errorEn(i)}
              </p>
            )}
          </div>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-surface-fg"
      >
        <Plus className="size-4" />
        Añadir {ordenada ? "paso" : "ingrediente"}
      </button>
    </fieldset>
  );
}
