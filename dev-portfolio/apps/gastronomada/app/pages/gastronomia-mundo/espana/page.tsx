import type { Metadata } from "next";

import RecipeGrid from "@/components/recetas/RecipeGrid";
import { getRecetasEspana } from "@/lib/data/recetas";

export const metadata: Metadata = {
  title: "GastroNómada — Cocina Española",
};

export default async function CocinaEspanola() {
  const recetas = await getRecetasEspana();

  return (
    <article>
      <h1 className="titulo_Esp">Cocina Española</h1>
      <img className="img_españa" src="/imagenes/banderas/españa.png" width={200} alt="Bandera de España" />
      <br />
      La cocina española es una fusión perfecta de tradición y creatividad, donde cada plato cuenta una
      historia. Desde las icónicas tapas hasta la paella, su gastronomía destaca por ingredientes frescos,
      sabores auténticos y una pasión por compartir.
      <br />
      Con raíces locales y proyección global, la cocina española no solo alimenta, sino que conecta.{" "}
      <b>¡Descubre por qué es un referente mundial!</b>
      <br /><br />

      <h1>Recetas de la cocina española</h1>
      <RecipeGrid recetas={recetas} />
    </article>
  );
}
