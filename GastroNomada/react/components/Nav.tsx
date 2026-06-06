'use client';

import { useState } from 'react';
import Link from 'next/link';

type ActiveMenu = 'paises' | 'recetas' | 'perfil' | null;

const PAISES = [
  { href: '/gastronomia-mundo/espana', src: '/imagenes/banderas/españa.png',   title: 'España' },
  { href: '/en-construccion',          src: '/imagenes/banderas/francia.png',   title: 'Francia' },
  { href: '/en-construccion',          src: '/imagenes/banderas/italia.png',    title: 'Italia' },
  { href: '/en-construccion',          src: '/imagenes/banderas/alemania.png',  title: 'Alemania' },
  { href: '/en-construccion',          src: '/imagenes/banderas/japon.png',     title: 'Japón' },
  { href: '/en-construccion',          src: '/imagenes/banderas/china.png',     title: 'China' },
  { href: '/en-construccion',          src: '/imagenes/banderas/marruecos.png', title: 'Marruecos' },
  { href: '/en-construccion',          src: '/imagenes/banderas/sudáfrica.png', title: 'Sudáfrica' },
  { href: '/en-construccion',          src: '/imagenes/banderas/EEUU.png',      title: 'EEUU' },
  { href: '/en-construccion',          src: '/imagenes/banderas/mexico.png',    title: 'Mexico' },
  { href: '/en-construccion',          src: '/imagenes/banderas/colombia.png',  title: 'Colombia' },
  { href: '/en-construccion',          src: '/imagenes/banderas/peru.png',      title: 'Perú' },
  { href: '/en-construccion',          src: '/imagenes/banderas/ecuador.png',   title: 'Ecuador' },
];

export default function Nav() {
  const [active, setActive] = useState<ActiveMenu>(null);

  function toggle(menu: ActiveMenu) {
    setActive(prev => (prev === menu ? null : menu));
  }

  return (
    <>
      <div id="nav">
        <nav>
          <Link href="/">
            <img src="/imagenes/logo.png" width={100} alt="GastroNómada" />
          </Link>

          <button className="desplegable_paises" onClick={() => toggle('paises')}>
            <b>Gastronomía del mundo</b>
          </button>

          <button className="desplegable_recetas" onClick={() => toggle('recetas')}>
            <b>Recetas</b>
          </button>

          <Link href="/foro"><b>Foro gastronómico</b></Link>

          <Link href="/en-construccion"><b>Utensilios y más</b></Link>

          <button className="bot_perfil" onClick={() => toggle('perfil')}>
            <img className="perfil" src="/imagenes/perfil.png" alt="Perfil" />
          </button>

          <img className="lupa" src="/imagenes/lupa.png" alt="Buscar" />
        </nav>
      </div>

      {/* ── Dropdown perfil ── */}
      <div className="desplegable_perfil">
        <div className={`desplegable_cont_perfil${active === 'perfil' ? ' active' : ''}`}>
          <h1>Inicio de sesión</h1>
          <form name="inicioSesion" method="post" action="/api/login">
            <br />
            <label htmlFor="usuario">Nombre de usuario o email</label><br />
            <input id="usuario" type="text" spellCheck={false} required /><br />
            <label htmlFor="contrasena">Contraseña</label><br />
            <input id="contrasena" type="password" spellCheck={false} required minLength={11} /><br />
            <input type="checkbox" name="mantenerSesion" value="check" id="mantener" />
            <label htmlFor="mantener"> Mantener sesión abierta</label><br />
            ¿No tienes cuenta?{' '}
            <Link href="/registro" title="Regístrate"><b>pincha aquí</b></Link><br />
            <input type="submit" value="verificar" />
          </form>
        </div>
      </div>

      {/* ── Dropdown recetas ── */}
      <div className="desplegable_recetas">
        <div className={`desplegable_cont_recetas${active === 'recetas' ? ' active' : ''}`}>
          <table>
            <caption><h3>Recetas</h3></caption>
            <tbody>
              <tr>
                <td><Link href="/gastronomia-tradicional">Gastronomía tradicional</Link></td>
                <td><Link href="/recetas-modernas">Gastronomía moderna</Link></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Dropdown países ── */}
      <div className="desplegable">
        <div className={`desplegable_content${active === 'paises' ? ' active' : ''}`}>
          <table className="tabla">
            <caption><h3>Gastronomias del mundo</h3></caption>
            <tbody>
              <tr>
                {PAISES.map(p => (
                  <td key={p.title}>
                    <Link href={p.href}>
                      <img src={p.src} width={50} height={30} title={p.title} alt={p.title} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
