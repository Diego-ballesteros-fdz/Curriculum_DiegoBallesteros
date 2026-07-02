"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { loginSchema, type LoginFormValues, type LoginInput } from "@/lib/schemas";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/**
 * Evita open redirects: solo rutas internas. Debe empezar por "/" y no ser
 * protocol-relative ("//" o "/\"), que algunos navegadores tratan como externa.
 */
function rutaSegura(destino: string | null): string {
  if (
    destino &&
    destino.startsWith("/") &&
    !destino.startsWith("//") &&
    !destino.startsWith("/\\")
  ) {
    return destino;
  }
  return "/gastronomada";
}
import { AuthShell, Field, SubmitButton, FormBanner, inputClass } from "./form-ui";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues, unknown, LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", recordarme: false },
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    // Mensaje genérico ante error: no revela si el email existe (anti-enumeración).
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.recordarme,
    });
    if (error) {
      setServerError("Correo o contraseña incorrectos.");
      return;
    }
    router.push(rutaSegura(searchParams.get("redirect")));
    router.refresh();
  }

  return (
    <AuthShell
      title="Inicio de sesión"
      subtitle="Accede a tu cuenta de GastroNómada."
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link href="/gastronomada/registro" className="font-semibold text-dark underline">
            Regístrate
          </Link>
        </>
      }
    >
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

        <Field label="Contraseña" htmlFor="password" error={errors.password?.message}>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              className={cn(inputClass, "pr-11")}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-mid-grey transition-colors hover:text-dark"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm text-dark">
          <input type="checkbox" className="accent-gold" {...register("recordarme")} />
          Mantener sesión abierta
        </label>

        <SubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Verificando…" : "Iniciar sesión"}
        </SubmitButton>

        <Link href="/gastronomada/recuperar-contrasena" className="text-center text-sm text-mid-grey underline">
          ¿Has olvidado tu contraseña?
        </Link>
      </form>
    </AuthShell>
  );
}
