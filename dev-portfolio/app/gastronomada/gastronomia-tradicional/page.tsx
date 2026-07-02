import type { Metadata } from "next";

import RecetasFiltradas from "@/components/recetas/RecetasFiltradas";

export const metadata: Metadata = {
  title: "GastroNómada — Gastronomía Tradicional",
};

export default function GastronomiaTradicional() {
  return (
    <>
      <article>
        <h1 className="tit_trad">
          Recetas tradicionales del Mundo: Sabores que Unen Culturas
        </h1>
        <img
          className="img_trad"
          src="/imagenes/gastronomiaTrad.jpg"
          alt="Gastronomía tradicional"
        />
      </article>

      <RecetasFiltradas
        filtro={{ type: "tradicional" }}
        textoVacio="Todavía no hay recetas tradicionales."
      />
    </>
  );
}
