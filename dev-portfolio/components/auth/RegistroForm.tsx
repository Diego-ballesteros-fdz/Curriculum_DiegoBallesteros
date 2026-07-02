"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registroSchema, type RegistroFormValues, type RegistroInput } from "@/lib/schemas";
import { signUp } from "@/lib/auth-client";
import { AuthShell, Field, SubmitButton, FormBanner, inputClass } from "./form-ui";

export default function RegistroForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormValues, unknown, RegistroInput>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      usuario: "",
      nombre: "",
      apellidos: "",
      email: "",
      password: "",
      confirmarPassword: "",
      boletin: false,
    },
  });

  async function onSubmit(values: RegistroInput) {
    setServerError(null);
    // El backend (better-auth) crea la cuenta, envía el email de verificación y
    // hace auto-login (deja la cookie de sesión). El resto de campos del contrato
    // (usuario, género, nivel, boletín) los persistirá el backend cuando extienda
    // el modelo de usuario; hoy solo acepta email/password/name.
    const { error } = await signUp.email({
      email: values.email,
      password: values.password,
      name: `${values.nombre} ${values.apellidos}`.trim(),
    });
    if (error) {
      setServerError(error.message ?? "No se pudo crear la cuenta.");
      return;
    }
    router.push("/gastronomada");
    router.refresh();
  }

  return (
    <AuthShell
      wide
      title="Crear cuenta"
      subtitle="Únete a la comunidad de GastroNómada."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/gastronomada/login" className="font-semibold text-dark underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {serverError && <FormBanner tone="error">{serverError}</FormBanner>}

        <Field label="Nombre de usuario" htmlFor="usuario" error={errors.usuario?.message}>
          <input id="usuario" type="text" spellCheck={false} placeholder="chef_nomada" className={inputClass} {...register("usuario")} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Nombre" htmlFor="nombre" error={errors.nombre?.message}>
            <input id="nombre" type="text" placeholder="Nombre" className={inputClass} {...register("nombre")} />
          </Field>
          <Field label="Apellidos" htmlFor="apellidos" error={errors.apellidos?.message}>
            <input id="apellidos" type="text" placeholder="Apellidos" className={inputClass} {...register("apellidos")} />
          </Field>
        </div>

        <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" spellCheck={false} placeholder="tu@correo.com" className={inputClass} {...register("email")} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
            <input id="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={inputClass} {...register("password")} />
          </Field>
          <Field label="Repite la contraseña" htmlFor="confirmarPassword" error={errors.confirmarPassword?.message}>
            <input id="confirmarPassword" type="password" autoComplete="new-password" placeholder="Repite la contraseña" className={inputClass} {...register("confirmarPassword")} />
          </Field>
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-sm font-medium text-dark">Género</legend>
          <div className="flex gap-4 text-sm text-dark">
            <label className="flex items-center gap-1.5"><input type="radio" value="H" className="accent-gold" {...register("genero")} /> Hombre</label>
            <label className="flex items-center gap-1.5"><input type="radio" value="M" className="accent-gold" {...register("genero")} /> Mujer</label>
            <label className="flex items-center gap-1.5"><input type="radio" value="O" className="accent-gold" {...register("genero")} /> Otro</label>
          </div>
          {errors.genero && <p role="alert" className="text-xs font-medium text-destructive">Selecciona una opción</p>}
        </fieldset>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-sm font-medium text-dark">¿Qué tipo de cociner@ eres?</legend>
          <div className="flex gap-4 text-sm text-dark">
            <label className="flex items-center gap-1.5"><input type="radio" value="PR" className="accent-gold" {...register("nivel")} /> Profesional</label>
            <label className="flex items-center gap-1.5"><input type="radio" value="AF" className="accent-gold" {...register("nivel")} /> Aficionado</label>
          </div>
          {errors.nivel && <p role="alert" className="text-xs font-medium text-destructive">Selecciona una opción</p>}
        </fieldset>

        <label className="flex items-center gap-2 text-sm text-dark">
          <input type="checkbox" className="accent-gold" {...register("boletin")} />
          Quiero recibir notificaciones
        </label>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
