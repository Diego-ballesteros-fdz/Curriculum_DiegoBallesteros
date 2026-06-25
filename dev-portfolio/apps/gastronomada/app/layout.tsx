import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist } from "next/font/google";

import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSession } from "@/lib/auth/session";
import { THEME_COOKIE } from "@/lib/auth/config";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "GastroNómada",
  description:
    "Un viaje culinario por el mundo — recetas tradicionales y modernas de todas las culturas.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);
  const tema = cookieStore.get(THEME_COOKIE)?.value === "claro" ? "claro" : "oscuro";

  return (
    <html
      lang="es"
      className={cn("font-sans", geist.variable, tema === "oscuro" && "dark")}
    >
      <body className="flex min-h-screen flex-col bg-app-bg text-app-fg">
        <ThemeProvider inicial={tema}>
          <SessionProvider user={session?.user ?? null}>
            <Nav />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
