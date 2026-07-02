import type { Metadata } from "next";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/auth/SessionProvider";
import RealtimeProvider from "@/components/realtime/RealtimeProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSession } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "GastroNómada",
  description:
    "Un viaje culinario por el mundo — recetas tradicionales y modernas de todas las culturas.",
};

/**
 * Layout de la sección GASTRONÓMADA (`/gastronomada/*`). Monta el marco de la
 * app (Nav + Footer), los providers (tema, sesión, tiempo real) y el fondo con
 * tipografía sans. La clase `.dark` la fija el shell raíz en `<html>`; aquí solo
 * se pasa el tema inicial al `ThemeProvider` para mantener el cliente en sync.
 */
export default async function GastronomadaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);
  const tema = cookieStore.get(THEME_COOKIE)?.value === "claro" ? "claro" : "oscuro";

  return (
    <div className="flex min-h-screen flex-col bg-app-bg font-sans text-app-fg transition-colors">
      <ThemeProvider inicial={tema}>
        <SessionProvider user={session?.user ?? null}>
          <RealtimeProvider />
          <Nav />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </SessionProvider>
      </ThemeProvider>
    </div>
  );
}
