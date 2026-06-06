import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GastroNómada — Recetas Modernas",
};

const recetas = [
  { src: '/imagenes/Recetas/Bravas_Mod.webp',           title: 'Bravas modernas' },
  { src: '/imagenes/Recetas/tortilla de patata Mod.jpg', title: 'Tortilla de patatas de Adrià' },
  { src: '/imagenes/Recetas/socarrat.png',               title: 'Socarrat' },
  { src: '/imagenes/Recetas/bao crab.jpg',               title: 'Bao de cangrejo' },
  { src: '/imagenes/Recetas/oliva.png',                  title: 'Esferificación de oliva' },
  { src: '/imagenes/Recetas/puro.png',                   title: 'Puro de los Roca' },
  { src: '/imagenes/Recetas/bombon salmon.jpg',          title: 'Bombón de salmón' },
  { src: '/imagenes/Recetas/cherry.jpg',                 title: 'Trampantojo cherry' },
  { src: '/imagenes/Recetas/brownie carrillera.jpg',     title: 'Brownie de carrillera' },
  { src: '/imagenes/Recetas/sushi flame.jpg',            title: 'Sushi flame' },
];

export default function RecetasModernas() {
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

      <div className="carrusel_recetas">
        <div className="seccion2_mod">
          {recetas.map(r => (
            <a key={r.title} title={r.title}>
              <img src={r.src} width={200} height={150} alt={r.title} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
