<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html" encoding="UTF-8" />
 <xsl:template match="/">
  <html>
   <head>
      <link rel="stylesheet" type="text/css" href="./estilos.css"/>
   </head>
   <body>
   
      <div id="nav">
         <a href="./index.html">
            <img src="./imagenes/logo.png" width="100"/>
         </a>
         <button class="desplegable_paises">
            <b>Gastronomía del mundo</b>
         </button>
         <button class="desplegable_recetas">
            <b>Recetas</b>
         </button>
         <a href="./foro_gastronomico.html">
            <b>Foro gastronómico</b>
         </a>
         <a href="./work_in_progress.html">
            <b>Utensilios y más</b>
         </a>
         <button class="bot_perfil">
            <img class="perfil" src="./imagenes/perfil.png"/>
         </button>
         <img class="lupa" src="./imagenes/lupa.png"/>
      </div>
      <div class="desplegable_perfil">
         <div class="desplegable_cont_perfil">
            <h1>Inicio de sesión</h1>
            <form name="inicioSesion"
                  method="post"
                  action="../base_de_datos/gastronomada.php">
               <br/>
               <label for="usuario">Nombre de usuario o email </label>
               <br/>
               <input type="text" spellcheck="false" autofocus="required"/>
               <br/>
               <label for="contraseña">Contraseña </label>
               <br/>
               <input type="password"
                      spellcheck="false"
                      autofocus="required"
                      minlength="11"
                      pattern="[a-z0-9][A-Z]+11"
                      title="Letras y números, con al menos una mayuscula. Tamaño mínimo: 11, máximo: 50"/>
               <br/>
               <label for="mantenerSesion"/>
               <input type="checkbox" name="mantenerSesion" value="check">Mantener sesion abierta</input>
               <br/>
                    ¿No tienes cuenta?<a href="./Log_In/sign_in.html" title="Registrate">
                  <b> pincha aquí</b>
               </a>
               <input type="submit" value="verificar"/>
            </form>
         </div>
      </div>
      <div class="desplegable_recetas">
         <div class="desplegable_cont_recetas">
            <table>
               <caption>
                  <h3>Recetas</h3>
               </caption>
               <tbody>
                  <tr>
                     <td>
                        <a href="./Gastronomía_Tradicional/gastronomia_Tradicional.html">Gastronomía tradicional</a>
                     </td>
                     <td>
                        <a href="./Recetas_Modernas/Recetas_Modernas.html">Gastronomía moderna</a>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
      <div class="desplegable">
         <div class="desplegable_content">
            <table class="tabla">
               <caption>
                  <h3>Gastronomias del mundo</h3>
               </caption>
                Seleccione un país
                <tbody>
                  <tr>
                     <td>
                        <a href="./Gastronomia_mundo/Española.html">
                           <img src="./imagenes/banderas/españa.png"
                                width="50"
                                height="30"
                                title="España"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/francia.png"
                                width="50"
                                height="30"
                                title="Francia"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/italia.png" width="50" title="Italia"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/alemania.png"
                                height="30"
                                width="50"
                                title="Alemania"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/japon.png"
                                height="30"
                                width="50"
                                title="Japón"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/china.png"
                                height="30"
                                width="50"
                                title="China"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/marruecos.png"
                                height="30"
                                width="50"
                                title="Marruecos"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/sudáfrica.png"
                                height="30"
                                width="50"
                                title="Sudáfrica"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/EEUU.png"
                                height="30"
                                width="50"
                                title="EEUU"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/mexico.png"
                                height="30"
                                width="50"
                                title="Mexico"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/colombia.png"
                                height="30"
                                width="50"
                                title="Colombia"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/peru.png"
                                height="30"
                                width="50"
                                title="Perú"/>
                        </a>
                     </td>
                     <td>
                        <a href="./work_in_progress.html">
                           <img src="./imagenes/banderas/ecuador.png"
                                height="30"
                                width="50"
                                title="Ecuador"/>
                        </a>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
      <article>
         <h1>Puedes encontrar recetas como:</h1>
         <table border="1">
            <caption>
               <h3>Recetas</h3>
            </caption>
            <tbody>
               <td>
                  <th>nombre</th>
               </td>
               <td>
                  <th>descripcion</th>
               </td>
               <td>
                  <th>Ingredientes</th>
               </td>
               <td>
                  <th>Tiempo</th>
               </td>
               <td>
                  <th>Pasos</th>
               </td>
               <td>
                  <th>Tradicional</th>
               </td>
               <td>
                  <th>Dificultad</th>
               </td>
               <xsl:for-each select="recetario/receta">
               <tr>
                  <th><xsl:value-of select="nombre"/></th>
                  <th><xsl:value-of select="descripcion"/></th>
                  <th><xsl:for-each select="ingredientes/ingrediente">
                      <xsl:value-of select="."/>
                      (<xsl:value-of select="@cantidad"/> <xsl:value-of select="@unidad"/>)
                      <xsl:if test="position() != last()"><br/> </xsl:if><!-- comprobación de si queda información para escribir un espacio -->
                      </xsl:for-each></th>
                  <th><xsl:for-each select="pasos/paso">
                      <xsl:value-of select="@orden"/>. <xsl:value-of select="."/>
                      <xsl:if test="position() != last()"> <br/></xsl:if>
                      </xsl:for-each>
                  </th>
                  <th><xsl:value-of select="tiempo"/></th>
                  <th><xsl:value-of select="dificultad"/></th>
                  <th><xsl:value-of select="tradicional"/></th>
               </tr>
               </xsl:for-each>
            </tbody>
         </table>
      </article>
        <script src="./script.js"></script>
   </body>
   <footer>
    <div class="footer">
    <legend>Información de contacto</legend>
    <p>Redes Sociales</p>
        <a id="insta" href="https://www.instagram.com/" title="Instagram"><img src="./imagenes/Redes_Sociales/instagram.png" width="20"/> </a> 
        <a id="facebook" href="https://es-es.facebook.com/" title="Faceboock"><img src="./imagenes/Redes_Sociales/facebook_black.png" width="20"/> </a>
        <a id="X" href="https://x.com/?logout=1731672402589" title="X"><img src="./imagenes/Redes_Sociales/gorjeo.png" width="20"/> </a>
</div>
</footer>
</html>


        </xsl:template>
        </xsl:stylesheet>