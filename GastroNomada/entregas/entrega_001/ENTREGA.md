# Entrega 001 — 2026-06-06

## Resumen

Corrección de bugs críticos y de validez HTML en todas las páginas, más extracción
del JavaScript de dropdowns duplicado a un único archivo externo `nav.js`.

---

## Bugs encontrados y corregidos

### Bug 1 — Typo `calss` en index.html (CRÍTICO visual)
- **Archivo:** `index.html:126`
- **Problema:** `<div calss="imagenFondo">` — el atributo está mal escrito.
  El carrusel de imágenes de la portada no recibe ningún estilo CSS.
- **Fix:** `class="imagenFondo"`

### Bug 2 — Título "GatroNómada" (falta la 's')
- **Archivos:** `index.html:5`, `foro_gastronomico.html:6`
- **Problema:** Aparece "GatroNómada" en la pestaña del navegador.
- **Fix:** "GastroNómada"

### Bug 3 — `</form>` faltante en el dropdown de login
- **Archivos:** todas las páginas con el formulario de inicio de sesión en el dropdown
- **Problema:** El `<form>` abre en la línea del `action` pero nunca cierra con `</form>`
  antes del `</div>`. HTML inválido; los navegadores lo toleran pero puede causar
  comportamientos inesperados al hacer submit.
- **Fix:** Añadir `</form>` antes del `</div class="desplegable_cont_perfil">`.

### Bug 4 — `</input>` inválido (HTML inválido)
- **Archivos:** todas las páginas
- **Problema:** `<input type="checkbox">Texto</input>` — `input` es un elemento vacío
  (void element), no tiene closing tag. El texto queda fuera del label sin asociación
  semántica con el input.
- **Fix:** Eliminar `</input>` y envolver el texto en un `<label>` asociado al input.

### Bug 5 — Enlace circular en sign_in.html
- **Archivo:** `Log_In/sign_in.html:82`
- **Problema:** El enlace "¿No tienes cuenta? pincha aquí" dentro del dropdown de login
  apunta a `./sign_in.html` — es la misma página, enlace a sí misma.
- **Fix:** El enlace ya está en la página de registro; se cambia el texto y el destino
  a `../index.html` (volver al inicio) o se elimina el enlace si es redundante.
  **Decisión tomada:** se elimina ese enlace del dropdown, ya que el usuario está
  en sign_in.html y la opción de registro es el formulario que tiene delante.

### Bug 6 — Título incorrecto en work_in_progress.html
- **Archivo:** `work_in_progress.html:6`
- **Problema:** `<title>Cocina Española</title>` — título copiado de otra página.
- **Fix:** `<title>GastroNómada — En construcción</title>`

### Bug 7 — Título incorrecto en Recetas/Tortilla_Mod.html
- **Archivo:** `Recetas/Tortilla_Mod.html:6`
- **Problema:** `<title>bravas contemporaneas</title>` — título equivocado.
- **Fix:** `<title>GastroNómada — Tortilla moderna</title>`
  (Este archivo no está en el scope de entrega porque no tiene nav y está incompleto.
  Se anota como pendiente.)

### Bug 8 — `<iframe>` de YouTube dentro de `<ol>` (HTML inválido)
- **Archivo:** `Recetas/Bravas_Mod.html:59`
- **Problema:** Un `<iframe>` está anidado dentro de `<ol>`, fuera de cualquier `<li>`.
  HTML inválido — los iframes no son hijos válidos de `<ol>`.
- **Fix:** Mover el `<iframe>` después del `</ol>`.
  (Este archivo tampoco tiene nav. Se anota como pendiente junto con Tortilla_Mod.html.)

### Bug 9 — `<footer>` fuera del `<body>` en recetario.xsl
- **Archivo:** `recetario.xsl`
- **Problema:** El bloque `<footer>` está declarado después de `</body>` y antes de `</html>`.
  El navegador lo renderiza, pero es HTML estructuralmente inválido.
- **Fix:** Mover el `</body>` para que englobe el `<footer>`. No incluido en esta entrega
  porque cambiar el XSL requiere verificar la transformación con servidor activo.
  Se anota como pendiente para entrega_002.

### Typos de contenido en Recetas_Modernas.html
- `"esferificacin de oliva"` → `"esferificación de oliva"`
- `"shusi flame"` → `"sushi flame"`
- `"bao babycrup"` → `"bao de cangrejo"` (interpretación probable; pendiente confirmación)

---

## Refactor incluido: extracción de JS a nav.js

### Problema
El mismo bloque de ~35 líneas de JavaScript (lógica de dropdowns) está copiado
literalmente en 7 archivos HTML:
`index.html`, `foro_gastronomico.html`, `work_in_progress.html`,
`Gastronomia_mundo/Española.html`, `Gastronomía_Tradicional/gastronomia_Tradicional.html`,
`Recetas_Modernas/Recetas_Modernas.html`, `Log_In/sign_in.html`.

### Solución
Se crea `nav.js` en la raíz del proyecto con la lógica centralizada
(usa `DOMContentLoaded`, con null checks para cada elemento).
Cada página HTML reemplaza su bloque `<script>` inline por:
```html
<script src="./nav.js"></script>          <!-- páginas en raíz -->
<script src="../nav.js"></script>         <!-- páginas en subdirectorio -->
```

`Script.js` (usado por la página XSL) permanece sin cambios — el motivo de su existencia
(no usar DOMContentLoaded en XSLT) sigue siendo válido.

---

## Archivos modificados

| Archivo | Tipo de cambio | Bug(s) corregidos |
|---|---|---|
| `nav.js` | **Nuevo archivo** | — centraliza lógica de dropdowns |
| `index.html` | Bug fix + refactor | Bug 1 (calss), Bug 2 (título), Bug 3 (form), Bug 4 (input), extracción JS |
| `foro_gastronomico.html` | Bug fix + refactor | Bug 2 (título), Bug 3 (form), Bug 4 (input), extracción JS |
| `work_in_progress.html` | Bug fix + refactor | Bug 6 (título), Bug 3 (form), Bug 4 (input), extracción JS |
| `Gastronomia_mundo/Española.html` | Bug fix + refactor | Bug 3 (form), Bug 4 (input), extracción JS |
| `Gastronomía_Tradicional/gastronomia_Tradicional.html` | Bug fix + refactor | Bug 3 (form), Bug 4 (input), extracción JS |
| `Recetas_Modernas/Recetas_Modernas.html` | Bug fix + refactor | Bug 3 (form), Bug 4 (input), typos, extracción JS |
| `Log_In/sign_in.html` | Bug fix + refactor | Bug 3 (form), Bug 4 (input), Bug 5 (enlace circular), extracción JS |

---

## Archivos NO modificados en esta entrega

| Archivo | Motivo |
|---|---|
| `recetario.xsl` | Bug 9 (footer fuera de body) requiere verificación con servidor activo |
| `Recetas/Bravas_Mod.html` | No tiene nav ni CSS; refactor más profundo, pendiente entrega_002 |
| `Recetas/Tortilla_Mod.html` | Página incompleta; pendiente entrega_002 |
| `Script.js` | Sin cambios — sigue siendo necesario para XSLT |
| `estilo generico.css` | Ninguna página lo referencia; se propone eliminarlo en entrega_002 |
| `estilos.css` | Sin bugs de CSS en esta entrega |

---

## Decisiones tomadas

- Se usa `var` en lugar de `const/let` en `nav.js` para máxima compatibilidad sin transpiler.
- Las páginas XSL no se tocan porque DOMContentLoaded no funciona igual en ese contexto
  (documentado en CLAUDE.md).
- El typo `"bao babycrup"` se corrige a `"bao de cangrejo"` de forma provisional;
  se requiere confirmación del usuario sobre el nombre exacto del plato.
- Bug 5 (enlace circular en sign_in.html): se elimina el enlace en lugar de redirigir
  al index porque la página de registro ya es el destino — el enlace no tenía sentido.

---

## Pendiente de revisión

1. ¿Confirmas `"bao de cangrejo"` como nombre correcto del plato en Recetas_Modernas?
2. ¿Quieres incluir `Bravas_Mod.html` y `Tortilla_Mod.html` en la próxima entrega (añadir nav y CSS)?
3. ¿Apruebas la eliminación de `estilo generico.css` en entrega_002 (no lo usa nadie)?
4. ¿Quieres corregir también `recetario.xsl` (mover el footer dentro del body)?
