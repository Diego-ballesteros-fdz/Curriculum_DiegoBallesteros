import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diego Ballesteros · Portfolio",
  description:
    "Portfolio de Diego Ballesteros Fernández — Junior Backend Developer. Proyectos de backend, microservicios e infraestructura cloud.",
};

/**
 * Layout de la sección PORTFOLIO (raíz `/`). Fija la estética "terminal": fondo
 * oscuro, fósforo verde y tipografía monoespaciada. El shell raíz deja `body`
 * neutro, así que el fondo a pantalla completa lo pone este envoltorio.
 */
export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-term-bg font-mono text-term-fg">
      {children}
    </div>
  );
}
