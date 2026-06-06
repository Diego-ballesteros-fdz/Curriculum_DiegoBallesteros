import type { Metadata } from "next";
import RecipeOverlay from "@/components/RecipeOverlay";

export const metadata: Metadata = {
  title: "GastroNómada — Cocina Española",
};

export default function CocinaEspanola() {
  return (
    <article>
      <h1 className="titulo_Esp">Cocina Española</h1>
      <img className="img_españa" src="/imagenes/banderas/españa.png" width={200} alt="Bandera de España" />
      <br />
      La cocina española es una fusión perfecta de tradición y creatividad, donde cada plato cuenta una
      historia. Desde las icónicas tapas hasta la paella, su gastronomía destaca por ingredientes frescos,
      sabores auténticos y una pasión por compartir.
      <br />
      Con raíces locales y proyección global, la cocina española no solo alimenta, sino que conecta.{' '}
      <b>¡Descubre por qué es un referente mundial!</b>
      <br /><br />

      <h1>Recetas de la cocina española</h1>
      <div className="carrusel_recetas">
        <div className="seccion2">
          {/* Tortilla — con overlay */}
          <RecipeOverlay
            triggerSrc="/imagenes/Recetas/tortilla de patatas.jpg"
            triggerAlt="Tortilla de patatas"
            triggerTitle="Tortilla de patatas"
            nombre="Tortilla de patatas"
            imagenSrc="/imagenes/Recetas/tortilla de patatas.jpg"
            descripcion={
              <>
                La tortilla de patatas es un clásico de la cocina española, simple y deliciosa.
                <br />Con tan solo patatas, huevos y un toque de cebolla si te gusta, se crea un plato
                que es pura tradición y sabor. Perfecta para compartir, ya sea en un picnic, en casa con
                amigos o como tapa en un bar. ¡Siempre es un acierto!
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
                <li>En una sartén con todo el aceite, pochamos patata y cebolla durante 40 minutos.</li>
                <li>Colamos, batimos los huevos con sal y mezclamos todo.</li>
                <li>En sartén antiadherente a 190 ºC volcamos la mezcla.</li>
                <li>Cuando el borde cuaje, damos la vuelta con un plato húmedo.</li>
                <li>Dejamos al gusto y servimos.</li>
              </ol>
            }
          />

          {/* Resto — sin overlay aún */}
          <a title="Bravas tradicionales">
            <img src="/imagenes/Recetas/Bravas_Tra.jpg" width={400} alt="Bravas tradicionales" />
          </a>
          <a title="Bravas contemporáneas">
            <img src="/imagenes/Recetas/Bravas_Mod.webp" width={400} alt="Bravas contemporáneas" />
          </a>
          <a title="Callos">
            <img src="/imagenes/Recetas/callos.jpg" width={400} alt="Callos" />
          </a>
          <a title="Paella valenciana">
            <img src="/imagenes/Recetas/paella.webp" width={400} alt="Paella valenciana" />
          </a>
          <a title="Tortilla de patatas de Adrià">
            <img src="/imagenes/Recetas/tortilla de patata Mod.jpg" width={400} alt="Tortilla moderna" />
          </a>
        </div>
      </div>
    </article>
  );
}
