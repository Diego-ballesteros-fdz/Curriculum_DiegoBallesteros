import type { Metadata } from "next";

import RecipeGrid from "@/components/recetas/RecipeGrid";
import { getRecetasModernas } from "@/lib/data/recetas";

export const metadata: Metadata = {
  title: "GastroNómada — Recetas Modernas",
};

export default async function RecetasModernas() {
  const recetas = await getRecetasModernas();

  return (
    <>
      <article>
        <h1 className="tit_mod">Recetas del Mundo: Sabores que Unen Culturas</h1>
        <img className="img_mod" src="/imagenes/cocina moderna.jpg" alt="Cocina moderna" />
        <br />
        ¿Listo para un tour gastronómico sin salir de tu cocina? Aquí encontrarás un mix de recetas
        modernas de todos los rincones del planeta. La comida es nuestra forma de viajar, conectar y
        celebrar, así que prepárate para descubrir sabores únicos y llevar un pedacito del mundo a tu
        mesa.
        <p>¡Vamos a cocinar y a romper fronteras!</p>
      </article>

      <RecipeGrid recetas={recetas} />
    </>
  );
}
