import RecipeCard from "@/components/recetas/RecipeCard";
import type { Receta } from "@/lib/schemas/receta";

/** Cuadrícula responsive de recetas. Recibe la lista ya resuelta del backend. */
export default function RecipeGrid({ recetas }: { recetas: Receta[] }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-3 lg:grid-cols-4">
      {recetas.map((receta) => (
        <RecipeCard key={receta.id} receta={receta} />
      ))}
    </div>
  );
}
