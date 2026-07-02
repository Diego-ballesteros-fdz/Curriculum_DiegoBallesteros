"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { recuperarPasswordSchema, type RecuperarPasswordInput } from "@/lib/schemas";
import { requestPasswordReset } from "@/lib/auth-client";
import { AuthShell, Field, SubmitButton, FormBanner, inputClass } from "./form-ui";

export default function RecuperarPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarPasswordInput>({
    resolver: zodResolver(recuperarPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: RecuperarPasswordInput) {
    setServerError(null);
    const { error } = await requestPasswordReset({
      email: values.email,
      redirectTo: "/gastronomada/restablecer-contrasena",
    });
    if (error) {
      setServerError(error.message ?? "No se pudo enviar el correo de recuperación.");
      return;
    }
    setEnviado(true);
  }

  return (
    <AuthShell
      title="Recuperar contraseña"
      subtitle="Te enviaremos un enlace para restablecer tu contraseña."
      footer={
        <Link href="/gastronomada/login" className="font-semibold text-dark underline">
          Volver al inicio de sesión
        </Link>
      }
    >
      {enviado ? (
        <FormBanner tone="success">
          Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña.
        </FormBanner>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {serverError && <FormBanner tone="error">{serverError}</FormBanner>}

          <Field label="Correo electrónico" htmlFor="email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="tu@correo.com"
              className={inputClass}
              {...register("email")}
            />
          </Field>

          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? "Enviando…" : "Enviar enlace"}
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}
