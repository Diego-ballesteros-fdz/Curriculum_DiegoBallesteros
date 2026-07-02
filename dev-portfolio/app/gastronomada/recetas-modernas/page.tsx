import type { Metadata } from "next";

import RecetasFiltradas from "@/components/recetas/RecetasFiltradas";

export const metadata: Metadata = {
  title: "GastroNómada — Recetas Modernas",
};

export default function RecetasModernas() {
  return (
    <>
      <article>
        <h1 className="tit_mod">
          Recetas del Mundo: Sabores que Unen Culturas
        </h1>
        <img
          className="img_mod"
          src="/imagenes/cocina moderna.jpg"
          alt="Cocina moderna"
        />
      </article>

      <RecetasFiltradas
        filtro={{ type: "moderna" }}
        textoVacio="Todavía no hay recetas modernas."
      />
    </>
  );
}
