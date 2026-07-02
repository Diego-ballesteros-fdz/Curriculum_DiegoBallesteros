import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Tarjeta centrada reutilizada por todas las pantallas de autenticación. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-very-dark to-mid-grey px-4 py-16">
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl bg-cream shadow-2xl",
          wide ? "max-w-lg" : "max-w-md",
        )}
      >
        {/* Franja superior dorada como acento de marca. */}
        <div className="h-1.5 bg-gold" />
        <div className="p-8 sm:p-10">
          <header className="mb-8 text-center">
            <img
              src="/imagenes/logo.png"
              width={72}
              height={72}
              alt="GastroNómada"
              className="mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold tracking-tight text-very-dark">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-mid-grey">{subtitle}</p>}
          </header>
          {children}
          {footer && <div className="mt-8 text-center text-sm text-dark">{footer}</div>}
        </div>
      </div>
    </main>
  );
}

/** Campo con etiqueta + slot de control + mensaje de error de validación. */
export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-dark">
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

/** Clases compartidas de los `<input>` para mantener un estilo coherente. */
export const inputClass =
  "w-full rounded-lg border border-dark/15 bg-white px-4 py-2.5 text-sm text-dark placeholder:text-mid-grey/40 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 disabled:opacity-50";

/** Botón de envío con los colores corporativos. */
export function SubmitButton({
  children,
  disabled,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(
        "w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-very-dark shadow-sm transition hover:bg-gold/90 hover:shadow active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Banner de error/éxito global del formulario. */
export function FormBanner({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg px-4 py-3 text-sm",
        tone === "error" ? "bg-destructive/10 text-destructive" : "bg-gold/20 text-dark",
      )}
    >
      {children}
    </p>
  );
}
