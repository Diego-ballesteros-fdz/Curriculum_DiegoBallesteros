"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { restablecerPasswordSchema, type RestablecerPasswordInput } from "@/lib/schemas";
import { resetPassword } from "@/lib/auth-client";
import { AuthShell, Field, SubmitButton, FormBanner, inputClass } from "./form-ui";

export default function RestablecerPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RestablecerPasswordInput>({
    resolver: zodResolver(restablecerPasswordSchema),
    defaultValues: { token, password: "", confirmarPassword: "" },
  });

  async function onSubmit(values: RestablecerPasswordInput) {
    setServerError(null);
    const { error } = await resetPassword({
      newPassword: values.password,
      token: values.token,
    });
    if (error) {
      setServerError(error.message ?? "El enlace no es válido o ha caducado.");
      return;
    }
    router.push("/gastronomada/login");
  }

  return (
    <AuthShell title="Nueva contraseña" subtitle="Introduce y confirma tu nueva contraseña.">
      {token ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
          {serverError && <FormBanner tone="error">{serverError}</FormBanner>}
          <input type="hidden" {...register("token")} />

          <Field label="Nueva contraseña" htmlFor="password" error={errors.password?.message}>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              className={inputClass}
              {...register("password")}
            />
          </Field>

          <Field
            label="Repite la contraseña"
            htmlFor="confirmarPassword"
            error={errors.confirmarPassword?.message}
          >
            <input
              id="confirmarPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repite la contraseña"
              className={inputClass}
              {...register("confirmarPassword")}
            />
          </Field>

          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? "Guardando…" : "Guardar contraseña"}
          </SubmitButton>
        </form>
      ) : (
        <FormBanner tone="error">
          Enlace no válido. Solicita uno nuevo desde{" "}
          <Link href="/gastronomada/recuperar-contrasena" className="underline">
            recuperar contraseña
          </Link>
          .
        </FormBanner>
      )}
    </AuthShell>
  );
}
