# Demo web · Mochizuki RD

Propuesta de sitio web para **Mochizuki RD** (mochi donuts japonesas y K-corn dogs coreanos, frente a la UASD, Santo Domingo).

> **Demo de propuesta por Raxotech. No es el sitio oficial.** Precios, horario y número de WhatsApp son de referencia y están por confirmar con el negocio.

## Requisitos

- Node.js 20 o superior (`node -v`)
- Git

## Comandos

```bash
npm install            # instala dependencias (solo la primera vez)
npm run dev            # desarrollo: http://localhost:5173
npm run dev -- --host  # igual, pero accesible desde el celular en la misma Wi-Fi
npm run build          # genera la carpeta dist/ (lo que se publica)
npm run preview        # sirve dist/ para probar exactamente lo de producción
```

## Dónde se edita cada cosa

| Quiero cambiar…                         | Archivo                     |
| --------------------------------------- | --------------------------- |
| Precios, productos, sabores, salsas     | `src/data/menu.json`        |
| Dirección, teléfono, WhatsApp, horario  | `src/data/negocio.json`     |
| Enlaces (Instagram, Uber Eats, Maps)    | `src/data/negocio.json`     |
| Colores, fuentes, radios, sombras       | `src/styles/variables.css`  |
| Fotos de productos                      | `public/img/` + campo `imagen` en `menu.json` |

Ningún precio, horario ni dirección está escrito en el HTML o el JS: todo sale de los dos JSON.

## Estructura

```
index.html            página única con secciones ancladas
src/main.js           punto de entrada: arma la página con los datos
src/styles/           variables.css, base.css, components.css
src/data/             negocio.json, menu.json
src/modules/          menu.js, personalizador.js, carrito.js, whatsapp.js, formato.js, ...
public/               favicon, robots.txt, sitemap.xml, img/ (placeholders)
referencias/          capturas de consulta: NO se publican (están en .gitignore)
```

## Publicar (Cloudflare Pages / Netlify / Vercel)

Comando de build `npm run build`, carpeta de salida `dist`.
