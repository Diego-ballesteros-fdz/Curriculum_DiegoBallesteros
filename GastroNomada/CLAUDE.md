# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

No build system or server required. Open `index.html` directly in a browser, or use a local static server:

```
# With Python
python -m http.server 8080

# With Node (if available)
npx serve .
```

The XML recipe page (`RecetarioExt.xml`) requires a server to apply the XSL transformation — browsers block local XSLT from `file://`.

## Architecture

GastroNómada is a static multi-page gastronomic website built with vanilla HTML, CSS, and JavaScript. There is no framework, bundler, or package manager.

### Page structure

Every page shares an identical nav and footer block that is copy-pasted inline. The nav contains three dropdowns (países, recetas, perfil), all toggled by the same JS pattern (see below). Pages at subdirectory depth prefix asset paths with `../`.

| Path | Purpose |
|---|---|
| `index.html` | Homepage with auto-scrolling image carousel |
| `Gastronomia_mundo/Española.html` | Spanish cuisine — the only completed country page |
| `Gastronomía_Tradicional/gastronomia_Tradicional.html` | Traditional world recipes grid |
| `Recetas_Modernas/Recetas_Modernas.html` | Modern/fusion recipes grid |
| `foro_gastronomico.html` | Forum page (embeds `Foro.html` in an iframe) |
| `Log_In/sign_in.html` | Registration form |
| `work_in_progress.html` | Placeholder for unfinished pages |
| `RecetarioExt.xml` | Recipe data rendered via `recetario.xsl` |

### CSS

`estilos.css` — the main stylesheet used by all HTML pages. Contains: generic reset, `#nav` and `.footer` styles, all three dropdown panels, image carousel (`@keyframes slide`), recipe overlay (`.Des_Recetas`), forum layout, sign-in form, and responsive breakpoints (`@media` at 1200px, 992px, 768px, 576px).

`estilo generico.css` — an alternative/older version of the nav and footer styles only, used by some subdirectory pages via `../estilo generico.css`. When editing nav or footer styles, check whether both files need updating.

### JavaScript dropdown pattern

All pages use the same three-dropdown logic. On `index.html` it is inlined in a `<script>` before `<body>`. On XSLT-rendered pages it lives in `Script.js` (external), because `document.addEventListener('DOMContentLoaded', ...)` does not fire reliably in browser-rendered XSLT — the external script runs synchronously instead.

```js
function cerrarOtrosDesplegables(excepto) { ... }  // closes all .active except the passed element
toggleButton.addEventListener('click', () => {
  cerrarOtrosDesplegables(content);
  content.classList.toggle('active');
});
```

Dropdown visibility is controlled entirely by the `.active` class (`display: none` → `display: block`).

### XML / XSLT recipe data

`RecetarioExt.xml` stores recipe records and references `recetario.xsl` for browser-side transformation into the shared HTML layout. The schema is defined in `recetario.xsd` (XML Schema) and `recetario.dtd` (DTD). `RecetarioInt.xml` and `RecetarioXSD.xml` are internal/validation copies.

### Color palette

| Token | Hex | Usage |
|---|---|---|
| Gold/tan | `#C5A880` | Nav/footer background, headings, accents |
| Cream | `#FAF3E0` | Body text |
| Dark | `#252525` | Dropdown backgrounds, hover state |
| Very dark | `#1C1C1C` | Input backgrounds |
| Mid-grey | `#404040` | Page background |

### Backend

`base_de_datos/gastronomada.php` is the target for the login and registration forms but is currently empty. The forum form posts to `foro.php` (not yet implemented).
