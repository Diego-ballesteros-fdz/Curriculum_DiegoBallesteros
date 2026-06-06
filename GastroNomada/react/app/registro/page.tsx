import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GastroNómada — Registro",
};

export default function Registro() {
  return (
    <article className="sing_in">
      <div className="letras">
        <h1>Rellena tu solicitud</h1>
        <legend>Datos de registro</legend>
      </div>

      <form name="registro" method="post" action="/api/registro">
        <div className="columna1">
          <br />
          <label htmlFor="usuario">Nombre de usuario</label><br />
          <input id="usuario" type="text" spellCheck={false} required /><br />
          <label htmlFor="nombre">Nombre</label><br />
          <input id="nombre" type="text" spellCheck={false} required /><br />
          <label htmlFor="apellidos">Apellidos</label><br />
          <input id="apellidos" type="text" spellCheck={false} required /><br />
          <label htmlFor="email">Correo electrónico</label><br />
          <input id="email" type="email" spellCheck={false} required />
        </div>

        <div className="columna2">
          <label htmlFor="password">Contraseña</label><br />
          <input id="password" type="password" spellCheck={false} required minLength={11} /><br />
          <label htmlFor="password2">Repita contraseña</label><br />
          <input id="password2" type="password" spellCheck={false} required minLength={11} /><br />
          <label>Género</label><br />
          <input type="radio" name="genero" value="H" id="hombre" />
          <label htmlFor="hombre"> Hombre</label><br />
          <input type="radio" name="genero" value="M" id="mujer" />
          <label htmlFor="mujer"> Mujer</label><br />
          <input type="radio" name="genero" value="O" id="otro" />
          <label htmlFor="otro"> Otro</label><br />
          <label>¿Qué tipo de cociner@ eres?</label><br />
          <input type="radio" name="nivel" value="PR" id="profesional" />
          <label htmlFor="profesional"> Profesional</label><br />
          <input type="radio" name="nivel" value="AF" id="aficionado" />
          <label htmlFor="aficionado"> Aficionado</label><br />
        </div>

        <div className="rellenar">
          <br />
          En caso de ser profesional adjunte título, o en su defecto carnet de manipulador de alimentos.{' '}
          <b title="Si no verificas no podrás tener acceso a la cuenta profesional">|?|</b>
          <br />
          <label htmlFor="titulo_prof">Verificación</label><br />
          <input type="file" id="titulo_prof" name="titulo_prof" accept=".pdf,.jpg,.jpeg" /><br />
          <input type="checkbox" name="boletin" value="check" id="boletin" />
          <label htmlFor="boletin"> Quiero recibir notificaciones</label><br />
        </div>

        <div className="bot_Enviar">
          <input type="submit" value="Guardar cambios" />
          <input type="reset" value="Borrar los datos introducidos" />
        </div>
      </form>
    </article>
  );
}
