import type { Metadata } from "next";
import RecipeOverlay from "@/components/RecipeOverlay";

export const metadata: Metadata = {
  title: "GastroNómada — Gastronomía Tradicional",
};

const recetasGrid = [
  { src: '/imagenes/Recetas/pad thai.jpg',        title: 'Pad thai' },
  { src: '/imagenes/Recetas/butter chicken.jpg',   title: 'Butter chicken' },
  { src: '/imagenes/Recetas/carbonara.png',         title: 'Carbonara' },
  { src: '/imagenes/Recetas/Bravas_Tra.jpg',        title: 'Bravas tradicionales' },
  { src: '/imagenes/Recetas/callos.jpg',            title: 'Callos' },
  { src: '/imagenes/Recetas/costillas.jpg',         title: 'Costillas BBQ' },
  { src: '/imagenes/Recetas/tacos cochinita.jpg',   title: 'Cochinita pibil' },
  { src: '/imagenes/Recetas/codillo.jpg',           title: 'Codillo' },
  { src: '/imagenes/Recetas/paella.webp',           title: 'Paella valenciana' },
];

export default function GastronomiaTradicional() {
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

      <div className="carrusel_recetas">
        <div className="seccion2_trad">
          {/* Tortilla — tiene overlay con receta completa */}
          <RecipeOverlay
            triggerSrc="/imagenes/Recetas/tortilla de patatas.jpg"
            triggerAlt="Tortilla de patatas"
            triggerTitle="Tortilla de patatas"
            triggerWidth={200}
            nombre="Tortilla de patatas"
            imagenSrc="/imagenes/Recetas/tortilla de patatas.jpg"
            descripcion={
              <>
                La tortilla de patatas es un clásico de la cocina española, simple y deliciosa.
                <br />Con tan solo patatas, huevos, y un toque de cebolla si te gusta, se crea un plato
                que es pura tradición y sabor. Perfecta para compartir, ya sea en un picnic, en casa con
                amigos, o como tapa en un bar. ¡Siempre es un acierto!
              </>
            }
            ingredientes={
              <>
                <br />Para una tortilla mediana (4 personas).<br />
                <ul>
                  <li>6 huevos (si son de corral o criados en suelo, mejor).</li>
                  <li>2 kg de patatas.</li>
                  <li>500 ml de aceite de oliva.</li>
                  <li>1/2 cebolla (opcional).</li>
                </ul>
              </>
            }
            pasos={
              <ol>
                <li>Pelamos las patatas y las cortamos en rodajas; cuanto más finas, mejor.</li>
                <li>Cortamos la cebolla en <u title="En rodajas o tiras">juliana</u>. Esta parte es opcional.</li>
                <li>En una sartén con todo el aceite, volcamos la patata y la cebolla y <u title="Cocer en abundante aceite a 140ºC">pochamos</u> durante 40 minutos.</li>
                <li>Colamos la patata, batimos los huevos con sal y mezclamos.</li>
                <li>Calentamos una sartén <u title="Que no se pegue en el fondo">antiadherente</u> con un poco de aceite y volcamos la mezcla.</li>
                <li>Cuando el borde empiece a <u title="El huevo se vuelve más oscuro">cuajar</u>, damos la vuelta con un plato húmedo.</li>
                <li>Dejamos al gusto de cuajado y servimos.</li>
              </ol>
            }
          />

          {/* Resto de recetas — sin overlay aún */}
          {recetasGrid.map(r => (
            <a key={r.title} title={r.title}>
              <img src={r.src} width={200} height={150} alt={r.title} />
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
