import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GastroNómada",
  description: "Un viaje culinario por el mundo — recetas tradicionales y modernas de todas las culturas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
