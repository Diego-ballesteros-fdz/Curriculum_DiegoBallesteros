export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <legend>Información de contacto</legend>
        <p>Redes Sociales</p>
        <a id="insta" href="https://www.instagram.com/" title="Instagram">
          <img src="/imagenes/Redes_Sociales/instagram.png" width={20} alt="Instagram" />
        </a>
        <a id="facebook" href="https://es-es.facebook.com/" title="Facebook">
          <img src="/imagenes/Redes_Sociales/facebook_black.png" width={20} alt="Facebook" />
        </a>
        <a id="X" href="https://x.com/" title="X">
          <img src="/imagenes/Redes_Sociales/gorjeo.png" width={20} alt="X" />
        </a>
      </div>
    </footer>
  );
}
