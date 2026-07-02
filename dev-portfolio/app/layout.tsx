import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { THEME_COOKIE } from "@/lib/auth/config";

/**
 * Shell raíz del sitio: es el ÚNICO layout con `<html>`/`<body>`. Sirve dos
 * estéticas — el terminal del portfolio (raíz) y la app Gastronómada
 * (`/gastronomada`) — así que aquí no se fija ni fondo ni tipografía en `body`:
 * cada layout de sección envuelve su contenido con su fondo/fuente. Solo se
 * exponen las variables de fuente y se aplica `.dark` (tema de Gastronómada)
 * en `<html>`, que es donde better-auth/shadcn esperan la clase.
 */
const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Diego Ballesteros · Portfolio",
  description:
    "Portfolio de Diego Ballesteros Fernández — Junior Backend Developer, y demo de la red social GastroNómada.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tema =
    (await cookies()).get(THEME_COOKIE)?.value === "claro" ? "claro" : "oscuro";

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${
        tema === "oscuro" ? "dark" : ""
      }`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
