import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Diego Ballesteros · Portfolio",
  description:
    "Portfolio de Diego Ballesteros Fernández — Junior Backend Developer. Proyectos de backend, microservicios e infraestructura cloud.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={geistMono.variable}>
      <body className="min-h-screen font-mono">{children}</body>
    </html>
  );
}
