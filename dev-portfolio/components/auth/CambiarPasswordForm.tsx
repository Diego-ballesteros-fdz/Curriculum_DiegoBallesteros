"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  cambiarPasswordSchema,
  type CambiarPasswordFormValues,
  type CambiarPasswordInput,
} from "@/lib/schemas";
import { changePassword } from "@/lib/auth-client";
import { AuthShell, Field, FormBanner, SubmitButton, inputClass } from "./form-ui";

export default function CambiarPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CambiarPasswordFormValues, unknown, CambiarPasswordInput>({
    resolver: zodResolver(cambiarPasswordSchema),
    defaultValues: { actual: "", password: "", confirmarPassword: "" },
  });

  async function onSubmit(values: CambiarPasswordInput) {
    setServerError(null);
    setExito(false);
    const { error } = await changePassword({
      currentPassword: values.actual,
      newPassword: values.password,
      // Cerrar el resto de sesiones tras cambiar la contraseña (buena práctica).
      revokeOtherSessions: true,
    });
    if (error) {
      setServerError(
        error.message ?? "No se pudo cambiar la contraseña. Revisa la actual.",
      );
      return;
    }
    setExito(true);
    reset();
  }

  return (
    <AuthShell
      title="Cambiar contraseña"
      subtitle="Actualiza la contraseña de tu cuenta."
      footer={
        <Link href="/gastronomada" className="font-semibold text-dark underline">
          Volver al inicio
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {serverError && <FormBanner tone="error">{serverError}</FormBanner>}
        {exito && <FormBanner tone="success">Contraseña actualizada correctamente.</FormBanner>}

        <Field label="Contraseña actual" htmlFor="actual" error={errors.actual?.message}>
          <input
            id="actual"
            type="password"
            autoComplete="current-password"
            placeholder="Tu contraseña actual"
            className={inputClass}
            {...register("actual")}
          />
        </Field>

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
          label="Repite la nueva contraseña"
          htmlFor="confirmarPassword"
          error={errors.confirmarPassword?.message}
        >
          <input
            id="confirmarPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repite la nueva contraseña"
            className={inputClass}
            {...register("confirmarPassword")}
          />
        </Field>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : "Guardar cambios"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
