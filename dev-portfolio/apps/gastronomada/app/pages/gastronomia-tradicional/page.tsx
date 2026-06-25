import type { Metadata } from "next";

import RecipeGrid from "@/components/recetas/RecipeGrid";
import { getRecetasTradicionales } from "@/lib/data/recetas";

export const metadata: Metadata = {
  title: "GastroNómada — Gastronomía Tradicional",
};

export default async function GastronomiaTradicional() {
  const recetas = await getRecetasTradicionales();

  return (
    <>
      <article>
        <h1 className="tit_trad">Recetas tradicionales del Mundo: Sabores que Unen Culturas</h1>
        <img className="img_trad" src="/imagenes/gastronomiaTrad.jpg" alt="Gastronomía tradicional" />
        <p>
          ¿Listo para un tour gastronómico sin salir de tu cocina? Aquí encontrarás un mix de recetas
          tradicionales de todos los rincones del planeta. Desde los tacos más auténticos de México
          hasta un ramen calentito de Japón, cada plato viene con su propia historia y mucho sazón.
          La comida es nuestra forma de viajar, conectar y celebrar, así que prepárate para descubrir
          sabores únicos y llevar un pedacito del mundo a tu mesa.
        </p>
        <br />
        <p>¡Vamos a cocinar y a romper fronteras!</p>
      </article>

      <RecipeGrid recetas={recetas} />
    </>
  );
}
