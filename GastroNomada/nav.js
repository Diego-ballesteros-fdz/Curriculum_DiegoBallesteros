document.addEventListener('DOMContentLoaded', function () {
  function cerrarOtrosDesplegables(excepto) {
    document.querySelectorAll('.active').forEach(function (el) {
      if (el !== excepto) el.classList.remove('active');
    });
  }

  var btnPaises = document.querySelector('.desplegable_paises');
  var contPaises = document.querySelector('.desplegable_content');
  if (btnPaises && contPaises) {
    btnPaises.addEventListener('click', function () {
      cerrarOtrosDesplegables(contPaises);
      contPaises.classList.toggle('active');
    });
  }

  var btnRecetas = document.querySelector('.desplegable_recetas');
  var contRecetas = document.querySelector('.desplegable_cont_recetas');
  if (btnRecetas && contRecetas) {
    btnRecetas.addEventListener('click', function () {
      cerrarOtrosDesplegables(contRecetas);
      contRecetas.classList.toggle('active');
    });
  }

  var btnPerfil = document.querySelector('.bot_perfil');
  var contPerfil = document.querySelector('.desplegable_cont_perfil');
  if (btnPerfil && contPerfil) {
    btnPerfil.addEventListener('click', function () {
      cerrarOtrosDesplegables(contPerfil);
      contPerfil.classList.toggle('active');
    });
  }
});
