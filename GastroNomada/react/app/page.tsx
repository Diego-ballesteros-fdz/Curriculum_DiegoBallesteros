import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GastroNómada — Inicio",
};

export default function Home() {
  return (
    <>
      <div className="imagenFondo">
        <div className="seccion">
          <img src="/imagenes/deslizable/image.jpg" alt="gastronomía" />
          <img src="/imagenes/deslizable/foto 2.jpg" alt="gastronomía" />
          <img src="/imagenes/deslizable/RR0J7X.jpg" alt="gastronomía" />
          <img src="/imagenes/deslizable/roberto-carlos-roman-don-TS_g_856-CA-unsplash.jpg" alt="gastronomía" />
        </div>
      </div>

      <article>
        <h1>¡¡Bienvenidos a GastroNómada!!</h1>
        <p>
          <b>¡Bienvenidos a Gastronómada!</b> Un espacio donde la pasión por la cocina y la aventura
          se unen para llevarte a un viaje culinario por el mundo. Aquí podrás explorar y aprender
          recetas de países lejanos, sumergirte en los sabores auténticos de cada cultura, y descubrir
          platos modernos y tradicionales que deleitarán todos los paladares.
        </p>
        <p>
          En nuestra sección de <b>gastronomias del mundo</b>, encontrarás un repertorio de platillos
          emblemáticos de diversas culturas, mientras que en <b>Recetas Modernas</b> podrás inspirarte
          con versiones innovadoras que siguen las últimas tendencias gastronómicas. Si prefieres lo
          clásico, en <b>Recetas Tradicionales</b> te ofrecemos los platos que han pasado de generación
          en generación, cargados de historia y sabor.
        </p>
        <p>
          Además, en nuestra <b>Zona de Blog y Foro de Debate</b>, podrás conectar con otros amantes de
          la gastronomía, compartir tus propias experiencias y aprender de una comunidad vibrante de
          chefs caseros y profesionales. Y para completar tu experiencia, la <b>Zona de Utensilios</b>{' '}
          te presenta una selección de herramientas y gadgets culinarios esenciales para hacer cada
          preparación más fácil y divertida.
        </p>
        <p>
          Únete a Gastronómada y déjate inspirar por el sabor de cada rincón del mundo, ¡directo a tu
          cocina!
        </p>
      </article>

      <article>
        <Link href="/recetario">
          <h1>Puedes encontrar recetas como...</h1>
        </Link>
      </article>
    </>
  );
}
