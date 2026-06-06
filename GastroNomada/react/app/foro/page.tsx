import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GastroNómada — Foro gastronómico",
};

const mensajes = [
  {
    usuario: 'chefs_games',
    texto: '¿Alguien sabe dónde puedo encontrar achiote en Madrid?',
  },
  {
    usuario: 'chefs_games',
    texto: 'Yo lo compro en una tienda de productos latinos que está en la calle La Oca.',
  },
  {
    usuario: 'chefs_Country',
    texto: 'Tengo problemas con mi sifón, no consigo hacer que salga la espuma fluida. ¿Qué puede causarlo?',
  },
  {
    usuario: 'chefs_Silver',
    texto: 'Puede ser por la suciedad encrustada en la boquilla o tal vez por la mezcla de grasa en la espuma en sí. Recuerda que tiene que tener un mínimo de 30% de grasa o, en su defecto, gelatina o agar-agar.',
  },
  {
    usuario: 'chefs_games',
    texto: 'Yo, aunque tenga el % de grasa necesario, siempre añado una o dos colas para asegurar una buena consistencia en la espuma.',
  },
];

export default function Foro() {
  return (
    <article id="art_Foro">
      <h1>Foro gastronómico</h1>
      <p>
        ¡Nos alegra tenerte aquí! Este espacio es el lugar perfecto para compartir, debatir y aprender
        sobre todo lo relacionado con la gastronomía. Dentro de nuestra página de recetas, el foro se
        convierte en un punto de encuentro para todos los apasionados de la cocina, desde principiantes
        hasta chefs experimentados.
      </p>
      <p>¿Tienes alguna pregunta? ¿Quieres compartir una experiencia o simplemente debatir sobre tu cocina favorita? ¡Este es el lugar!</p>

      <div className="foro_Gast" style={{ position: 'relative', left: 0, width: '100%', height: 'auto' }}>
        {mensajes.map((m, i) => (
          <p key={i}>
            <b>Usuario:</b> {m.usuario}<br />
            {m.texto}<br />
            <a href="#">responder</a>
          </p>
        ))}
      </div>

      <div className="responder">
        <form action="/api/foro" method="post">
          <label className="nombre" htmlFor="usuario">Nombre de usuario</label><br />
          <input className="nom" id="usuario" type="text" spellCheck={false} required />
          <label className="comentario" htmlFor="comentario">Escriba comentario</label>
          <textarea
            className="EscribirComentario"
            id="comentario"
            name="texto"
            cols={33}
            rows={5}
            spellCheck={true}
            defaultValue="escriba lo que quiera"
          />
          <input className="enviar" type="submit" value="Enviar" />
        </form>
      </div>

      <img className="fotoChat" src="/imagenes/burbuja-de-dialogo.png" alt="Foro" />
    </article>
  );
}
