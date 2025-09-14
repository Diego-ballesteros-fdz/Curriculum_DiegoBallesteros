
    console.log("JS externo cargado");
    
    //he estado depurando con console.log todo el codigo y resulta que usar 
    //document.addEventListener('DOMContentLoaded', function ()  da fallo en xslt
    //console.log("DOM cargado con exito");
    function cerrarOtrosDesplegables(excepto) {
    const desplegablesActivos = document.querySelectorAll('.active');
    desplegablesActivos.forEach((desplegable) => {
      if (desplegable !== excepto) {
        desplegable.classList.remove('active');
      }
    });
  }
  
  const toggleButtonPaises = document.querySelector('.desplegable_paises');
  const desplegableContentPaises = document.querySelector('.desplegable_content');

  toggleButtonPaises.addEventListener('click', function () {
    cerrarOtrosDesplegables(desplegableContentPaises);
    desplegableContentPaises.classList.toggle('active');
  });

  const toggleButtonRecetas = document.querySelector('.desplegable_recetas');
  const desplegableContentRecetas = document.querySelector('.desplegable_cont_recetas');

  toggleButtonRecetas.addEventListener('click', function () {
    cerrarOtrosDesplegables(desplegableContentRecetas);
    desplegableContentRecetas.classList.toggle('active');
  });

  const toggleButtonPerfil = document.querySelector('.bot_perfil');
  const desplegableContentPerfil = document.querySelector('.desplegable_cont_perfil');

  toggleButtonPerfil.addEventListener('click', function () {
    cerrarOtrosDesplegables(desplegableContentPerfil);
    desplegableContentPerfil.classList.toggle('active');
  });
 console.log("XSL sí carga JS en línea");
