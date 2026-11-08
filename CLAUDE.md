# CLAUDE.md — Demo web Mochizuki RD

Demo de **propuesta** (no sitio oficial) para Mochizuki RD: mochi donuts japonesas y K-corn dogs coreanos, frente a la UASD, Santo Domingo. Autor: Raymond (Raxotech).

Fuente de verdad del alcance: `PLAN_ARQUITECTURA_DEMO.md`. Prompt original: `PROMPT_CLAUDE_CODE.md`.

## Stack (no cambiar sin preguntar)
- **Vite** (plantilla vanilla) + **HTML + CSS plano con variables + JavaScript (ES modules)**.
- Sin framework, sin Tailwind, sin backend. Datos en JSON. Carrito en memoria + `localStorage` (clave `mochizuki_carrito`, siempre en `try/catch`).
- Pedido por enlace `wa.me`. Hosting estático (Cloudflare Pages / Netlify / Vercel).

## Comandos
```bash
npm install            # instalar dependencias
npm run dev            # servidor de desarrollo (http://localhost:5173)
npm run dev -- --host  # para probar desde el celular en la misma Wi-Fi
npm run build          # genera dist/
npm run preview        # sirve dist/ tal como quedará en producción
```

## Estructura
- `index.html` — una sola página con secciones ancladas (hero, menú, personalizador, ubicación/horario, redes, pie).
- `src/main.js` — punto de entrada.
- `src/styles/` — `variables.css` (tokens), `base.css` (reset/global), `components.css` (botón, pastilla, pincelada, tarjeta, opciones, carrito, diálogos), `secciones.css` (layout de cada sección).
- `src/data/` — `negocio.json` y `menu.json` (**únicas** fuentes de datos). `menu.json` tiene `conjuntos_opciones` (corn dog en 3 pasos, yakult, extras) referenciados por el campo `opciones` de cada producto.
- `src/modules/`:
  - `opciones.js` — lógica pura: precio con sobreprecios, validación, texto de opciones, clave de línea.
  - `menu.js` — pinta categorías y tarjetas. `personalizador.js` — diálogo de opciones.
  - `carrito.js` — estado + localStorage (guarda solo id/cantidad/selección; precios se recalculan del JSON). `carrito-ui.js` — diálogo del carrito.
  - `whatsapp.js` — mensaje y enlace wa.me. `formato.js` — RD$ y escape HTML. `negocio.js` — rellena `data-negocio` / `data-enlace`.
- `vite.config.js` — plugin `seo-desde-json` (title, OG, JSON-LD desde los JSON) y `bloquear-referencias` (404 en dev/preview).
- `public/` — favicon, robots, sitemap, `img/` (placeholders SVG propios; rutas listas para fotos reales con permiso).
- `referencias/` — capturas de terceros, **solo consulta**: nunca copiar a `public/` ni `src/`, nunca en el build, está en `.gitignore`.

## Reglas de marca
- Estética: street food asiático, juvenil, colorido, dulce y divertido. Nada corporativo ni minimalista frío.
- Colores (aprox., en `variables.css`): naranja marca `#F05424`, naranja pincelada `#FF7035`, marrón logo `#5A3C18`, marrón bloque `#70380A`, rosa donut `#FCBAC0`, durazno `#FFD0B8`, crema `#FFF8F0`, tinta `#1A1A1A`.
- Contraste AA: el naranja sobre crema **no** sirve para texto pequeño; usarlo en botones con texto oscuro o blanco grande.
- Logo: **no usar el oficial**. Wordmark de texto provisional "MOCHI" (marrón) + "ZUKI" (naranja) + "JAPANESE DONUTS & KOREAN CORN DOGS", marcado como provisional.
- Tipografía (estimada): títulos Baloo 2 / Fredoka 700–800 en MAYÚSCULAS; texto Poppins 400/500/600. Máx. 2 familias, `font-display: swap`.
- Formas: encabezados de categoría como pinceladas naranjas con texto blanco; bordes 16–24 px; manchas orgánicas marrón/durazno; puntos y círculos; dona como motivo SVG propio; pastillas "NEW", "MÁS VENDIDO", "+18".
- Voz: español dominicano, tuteo, entusiasta (¡…!), imperativos ("Ven", "Elige"), emojis con moderación (🍩 🌭 🔥 ✨ 🧡), toque de inglés ("Asian Street Food"). **Copy original**, nunca copiar textos de su Instagram ni reseñas.

## Reglas de datos (críticas)
- Todo precio, horario, dirección, teléfono y enlace vive en `src/data/negocio.json` o `src/data/menu.json`. **Nada escrito a mano en HTML ni JS.**
- Precios no confiables: usar el juego de **Uber Eats** como referencia, con campo `fuente` por producto, y mostrar "Precios de referencia" en el sitio.
- Horario **no confirmado** (Google 8:00 p. m. vs Uber Eats 7:30 p. m.): mostrar "Horario por confirmar"; campo preparado en el JSON. Sin `openingHours` en JSON-LD hasta confirmar.
- Dirección: C. José Dolores Alfonseca 6, Santo Domingo (frente a la UASD, Facultad de Economía). **No** usar Plaza Juan Dauhajre.
- WhatsApp sin verificar: en `negocio.json` con TODO visible; el botón lo lee de ahí.
- Sojus: etiqueta "+18" y **fuera** del flujo de pedido por WhatsApp.
- **No** incluir "Nama Donuts" ni el combo "Ding Dong".
- No inventar reseñas, cifras de clientes ni premios. Calificaciones (4.5 Google, 4.6 Uber Eats) solo como "cifra pública a la fecha del demo".
- Promo "corn dog + mochi donut gratis": no mostrarla como vigente sin confirmar.

## Imágenes y propiedad
- No descargar ni incrustar fotos, capturas ni el logo oficial. Placeholders con la paleta y SVG propios (dona, corn dog).
- Pie: "Demo de propuesta por Raxotech. No es el sitio oficial."

## Forma de trabajar
- Un commit por paso, mensaje claro. **Sin push.**
- Tras cada paso: `npm run build` y arreglar errores.
- Ante ambigüedad (fuentes, paleta, textos, precios): preguntar.
- Nada destructivo; no borrar archivos que no haya creado Claude.
- Código simple y comentado en español donde no sea obvio.
