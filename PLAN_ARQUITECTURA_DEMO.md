# Demo Mochizuki RD — Planificación y Arquitectura

> Documento de trabajo para construir, correr en local (VS Code) y publicar el demo de la solución web para **Mochizuki RD**.
> Autor: Raymond (Raxotech) · Versión 0.1 · Noviembre 2026

---

## 1. Contexto y objetivo

**Negocio:** Mochizuki RD, tienda de *mochi donuts* japonesas y *K-corn dogs* coreanos en Santo Domingo, frente a la Facultad de Economía de la UASD (C. José Dolores Alfonseca 6). Instagram `@mochizuki.rd` (~26K seguidores), 4.5★ en Google (89 reseñas), 4.6★ en Uber Eats (220+).

**Objetivo del demo:** llegar a la reunión con una web funcionando, con **su** menú real, que se vea y se use bien en el celular. El demo debe resolver los puntos de dolor detectados, no ser una plantilla genérica.

### Puntos de dolor que el demo debe resolver

| # | Dolor detectado | Cómo lo resuelve el demo |
|---|---|---|
| 1 | El menú enlazado en Google es un diseño de Canva horizontal (formato TV, 3 láminas), difícil de leer en celular, con **precios distintos entre láminas** | Menú móvil de una sola lista, con corn dogs primero y precios unificados |
| 2 | Dirección, horario y precios distintos entre Google, Uber Eats y directorios | **Una sola fuente de verdad** (`menu.json` + `negocio.json`) |
| 3 | Todo el pedido online pasa por Uber Eats (comisión, sin datos del cliente) | Botón **"Pedir por WhatsApp"** con el pedido armado; Uber Eats queda como alternativa |
| 4 | 26K seguidores en Instagram sin enlace en la bio | Una URL corta única para poner en la bio, Google y QR |
| 5 | No hay web propia ni presencia en búsquedas | SEO local básico (metadatos + datos estructurados) |

### Fuera del alcance del demo

Pagos en línea, cuentas de usuario, panel de administración, base de datos, integración con Uber Eats o con su punto de venta. Se mencionan como **fase 2** (sección 12).

---

## 2. Principios de diseño

1. **Mobile-first.** La mayoría llega desde Instagram o Google en el teléfono. Se diseña a 360–414 px y luego se adapta a escritorio.
2. **Sin backend en el demo.** Sitio estático. Menos cosas que fallar, hosting gratis, fácil de explicar.
3. **Una sola fuente de datos.** Precios, horarios y dirección viven en archivos JSON. Se edita ahí y cambia todo.
4. **Rápido.** Imágenes optimizadas, sin librerías pesadas. Meta: Lighthouse móvil ≥ 90.
5. **Simple de mantener.** Que Raymond pueda explicar cada archivo en dos minutos.

---

### 2.1 Identidad de marca (el sitio debe sentirse como ellos)

Fuente: las capturas de `referencias/` (menú de Canva, Instagram, Uber Eats). **Los valores son aproximados**: salen de capturas comprimidas. Si el dueño tiene manual de marca o el archivo de Canva, esos valores mandan.

**Estética:** street food asiático, juvenil, colorido, dulce y divertido. Nada corporativo ni minimalista frío.

**Colores** (variables CSS en `src/styles/variables.css`):

| Rol | Valor | De dónde sale |
|---|---|---|
| Naranja de marca | `#F05424` | Logo (círculo y "ZUKI") |
| Naranja de acento / pincelada | `#FF7035` | Etiquetas de categoría del menú de Canva |
| Marrón chocolate | `#5A3C18` (texto del logo) · `#70380A` (fondos del menú) | Logo y menú |
| Rosa donut | `#FCBAC0` | Dona del logo |
| Durazno suave | `#FFD0B8` | Detalles del menú |
| Crema (fondo) | `#FFF8F0` | Fondo del menú de corn dogs |
| Tinta (texto) | `#1A1A1A` | Texto base |

Comprobar contraste AA: el naranja sobre crema no sirve para texto pequeño; úsalo en botones con texto oscuro o blanco grande.

**Logo:** círculo naranja con una dona rosa al centro y texto circular. El wordmark es "MOCHIZUKI" con "MOCHI" en marrón y "ZUKI" en naranja, y debajo "JAPANESE DONUTS & KOREAN CORN DOGS". En el demo se usa un wordmark de texto **provisional**, no el logo oficial.

**Tipografía (estimada a ojo, sin confirmar):**
- Títulos: sans redondeada y muy gruesa, tipo **Baloo 2** o **Fredoka** (700–800), en MAYÚSCULAS. En sus posts de Instagram los titulares son sans condensadas muy pesadas.
- Texto: **Poppins** (400/500/600).
- Máximo 2 familias, con `font-display: swap`.

**Formas y recursos visuales:**
- Encabezados de categoría como **pinceladas naranjas** con texto blanco en mayúsculas (así se ven "MOCHI DONUTS", "YAKULTS", "CAFÉS" en el menú).
- Bordes muy redondeados (16–24 px), manchas orgánicas marrón/durazno de fondo, círculos y puntos decorativos.
- La dona como motivo gráfico (SVG propio, simple y original).
- Etiquetas tipo pastilla para "NEW", "MÁS VENDIDO" y "+18" (así lo hacen en el menú).

**Voz y copywriting (español dominicano, tuteo):**
- Entusiasta y juvenil, con exclamaciones abiertas y cerradas (¡…!), imperativos ("Prepárate", "Ven", "Elige") y emojis de marca con moderación (🍩 🌭 🔥 ✨ 🧡).
- Toque de inglés ("Asian Street Food").
- Mensajes de marca: primera tienda del país especializada en mochi donuts japonesas y corn dogs coreanos; corn dogs hechos al momento, con sabor, relleno y salsa a elección; ambiente acogedor con buena música; ubicada en el campus universitario; promo de "un corn dog + una mochi donut gratis" (solo en tienda; confirmar vigencia).
- **Copy original.** No copiar textos literales de su Instagram ni de sus reseñas.

---

## 3. Stack tecnológico

| Capa | Elección | Por qué |
|---|---|---|
| Build / dev server | **Vite** | Arranque instantáneo, recarga en caliente, build estático |
| Lenguaje | **HTML + CSS + JavaScript (ES modules)** | Sin framework: curva baja, nada que mantener |
| Estilos | **CSS plano con variables** (sin Tailwind) | Control total y archivos pequeños |
| Datos | **JSON** (`src/data/`) | Fácil de editar y de cambiar luego por un CMS o API |
| Estado del carrito | **JS en memoria + `localStorage`** | Basta para el demo |
| Pedido | **Enlace `wa.me`** con el pedido en texto | Sin backend, sin costo |
| Hosting | **Cloudflare Pages / Netlify / Vercel** (plan gratis) | Despliegue desde GitHub, HTTPS incluido |

> **Alternativa si quieres un framework:** Astro (genera HTML estático y permite componentes). Para el demo no hace falta; se puede migrar después.

**Requisitos en tu PC:**
- Node.js **LTS** (verifica con `node -v`; usa 20 o superior)
- Git
- VS Code

---

## 4. Arquitectura

### 4.1 Diagrama lógico

```
                     ┌─────────────────────────────┐
  Instagram bio ───▶ │                             │
  Google Maps   ───▶ │   Sitio estático (Vite)     │ ───▶ WhatsApp (wa.me)
  Código QR     ───▶ │   HTML + CSS + JS           │ ───▶ Uber Eats (enlace)
                     │                             │ ───▶ Google Maps (cómo llegar)
                     └──────────────┬──────────────┘
                                    │ lee en build/arranque
                     ┌──────────────▼──────────────┐
                     │ src/data/menu.json          │
                     │ src/data/negocio.json       │
                     └─────────────────────────────┘
```

### 4.2 Flujo del usuario

1. Llega desde Instagram, Google o un QR al **inicio**.
2. Ve horario, ubicación y los productos destacados.
3. Entra al **menú**, filtra por categoría y agrega productos al carrito.
4. Pulsa **"Pedir por WhatsApp"**: se abre WhatsApp con el pedido ya escrito.
5. Alternativa: **"Pedir por Uber Eats"** o **"Cómo llegar"**.

### 4.3 Páginas / secciones

Una sola página con secciones ancladas (suficiente para el demo):

| Sección | Contenido |
|---|---|
| Hero | Nombre, lema, botones "Ver menú" y "Pedir por WhatsApp" |
| Menú | Categorías, tarjetas de producto, carrito |
| Ubicación y horario | Mapa embebido o botón a Google Maps, horario, teléfono |
| Redes | Instagram, TikTok, Uber Eats |
| Pie | Datos de contacto y créditos ("Demo por Raxotech") |

---

## 5. Estructura de carpetas

```
Mochizuki_restaurante_demo/        # carpeta raíz del proyecto (F:\Mochizuki_restaurante_demo)
├─ PLAN_ARQUITECTURA_DEMO.md       # este documento
├─ CLAUDE.md                       # reglas de trabajo (lo crea Claude Code en el paso 0)
├─ referencias/                    # capturas del negocio (solo consulta, NO se publican)
│  ├─ 01 a 03  menú de Canva (3 láminas)
│  ├─ 04 a 06  Instagram (perfil y logo, feed, fachada)
│  ├─ 07 y 08  Uber Eats
│  └─ 09       ficha de Google Maps
├─ index.html
├─ package.json
├─ vite.config.js
├─ .gitignore
├─ README.md
├─ public/
│  ├─ favicon.svg
│  ├─ robots.txt
│  ├─ sitemap.xml
│  └─ img/                  # imágenes optimizadas (WebP)
└─ src/
   ├─ main.js               # punto de entrada
   ├─ styles/
   │  ├─ variables.css      # colores, tipografía, espaciados
   │  ├─ base.css           # reset y estilos globales
   │  └─ components.css     # tarjetas, botones, carrito
   ├─ data/
   │  ├─ menu.json          # productos y precios
   │  └─ negocio.json       # dirección, horario, enlaces
   ├─ modules/
   │  ├─ menu.js            # pinta categorías y productos
   │  ├─ carrito.js         # añadir, quitar, total, localStorage
   │  ├─ whatsapp.js        # construye el mensaje y el enlace
   │  └─ formato.js         # formato de moneda RD$
   └─ assets/               # logos y otros recursos fuente
```

---

## 6. Modelo de datos

### 6.1 `negocio.json`

```json
{
  "nombre": "Mochizuki RD",
  "lema": "Japanese Donuts & Korean Corn Dogs",
  "direccion": "C. José Dolores Alfonseca 6, Santo Domingo (frente a la UASD, Facultad de Economía)",
  "telefono": "(829) 648-8712",
  "whatsapp": "18296488712",
  "horario": "POR CONFIRMAR CON EL NEGOCIO",
  "enlaces": {
    "instagram": "https://www.instagram.com/mochizuki.rd/",
    "ubereats": "https://www.ubereats.com/do/store/mochizuki-rd-plaza-juan-dauhjare-santo-domingo/xVNTTgWZXpi13RLGwIXgJg",
    "maps": "https://www.google.com/maps/place/MOCHIZUKI+RD/@18.4620279,-69.9201848,17z"
  },
  "nota_precios": "ITBIS incluido. 10% de ley no incluido."
}
```

> **Pendiente:** confirmar que `18296488712` es un número con WhatsApp. Google muestra (829) 648-8712 como teléfono, pero eso no garantiza que sea WhatsApp.

### 6.2 `menu.json` (esquema)

```json
{
  "categorias": [
    { "id": "corn-dogs", "nombre": "K-Corn Dogs", "orden": 1 },
    { "id": "mochi", "nombre": "Mochi Donuts", "orden": 2 },
    { "id": "bebidas", "nombre": "Bebidas", "orden": 3 }
  ],
  "productos": [
    {
      "id": "cd-original",
      "categoria": "corn-dogs",
      "nombre": "K-Corn Dog Original",
      "descripcion": "Salchicha, queso o mitad y mitad. Elige salsa.",
      "precio": 300,
      "imagen": "img/cd-original.webp",
      "destacado": true,
      "disponible": true
    }
  ]
}
```

### 6.3 Datos reales recopilados (precios en RD$, **a confirmar con el negocio**)

Las fuentes públicas **no coinciden entre sí, ni siquiera dentro del mismo menú de Canva** (las láminas 2 y 3 traen precios distintos para los mismos corn dogs). Para el demo, marca todo como **"precios de referencia"** y usa un solo juego (sugerido: Uber Eats, que es el canal con ventas reales) hasta que el dueño confirme.

**Comparación de precios de corn dogs (RD$):**

| Producto | Canva lámina 2 | Canva lámina 3 | Uber Eats |
|---|---|---|---|
| Original | 250 (antes 400, "special offer") | 300 | 300 |
| Ramen | 425 | 350 | 325 |
| Papa | 475 | 350 | 375 |
| Cheetos Flamin' Hot | 475 | 350 | 375 |
| Doritos Crunch | 500 | 350 | 400 |
| Pizza Pizza (nuevo) | 500 | 375 | 400 |
| Corn Cheese (nuevo) | 500 | — | 400 |
| Onigiri | 250 | 200 | 250 |

**Flujo de personalización (viene del menú de Canva, hay que reflejarlo en el carrito):**
1. **Paso 1: elige tu sabor** (Original, Ramen, Papa, Cheetos Flamin' Hot, Doritos Crunch, Pizza Pizza, Corn Cheese).
2. **Paso 2: elige tu relleno:** salchicha (gratis), mozzarella (+75) o mitad y mitad (gratis en la lámina 2, +25 en la lámina 3).
3. **Paso 3: elige tu salsa (+1):** ketchup, sweet chili, BBQ, honey mustard, spicy mayo, parmesano.
4. **Extras:** azúcar (gratis), salsa adicional (+50).

> Implicación técnica: `menu.json` necesita un campo `opciones` por producto (relleno, salsa, extras con sobreprecio) y el carrito debe guardar la configuración de cada línea. Ajusta el módulo `carrito.js` en consecuencia.

**K-Corn Dogs (Uber Eats):**

| Producto | Precio |
|---|---|
| Original | 300 |
| Papa | 375 |
| Cheetos Flamin' Hot | 375 |
| Ramen | 325 |
| Doritos | 400 |
| Pizza (mozzarella, salsa, pepperoni, albahaca) | 400 |
| Corn Cheese | 400 |
| K-Corn Dog Box (Original + Papa + Doritos, 3 salsas) | 975 |

**Mochi Donuts:**

| Producto | Canva (menú en Google) | Uber Eats |
|---|---|---|
| 1 unidad | 150 | — |
| 6 unidades | 720 | 650 |
| 12 unidades | 1,380 | 1,240 |

**Otros (Canva / Uber Eats):** Onigiri atún o surimi 250 · Yakult 24 oz (chinola, fresa, fruit punch, naranja) 300 · Slushie frozen mango/fresa 200 · Matcha latte fresa/mango 280, blueberry 300 · Té de jamaica 275 · Refresco 80 (Uber: Sprite 65) · Agua 50 (Uber: 30) · Espresso 70 · Capuccino 140 · Popping pearl 50 · Leche de almendra 50 · Sojus 550 (**solo +18**).

> Los precios en Uber Eats pueden incluir ajustes de plataforma. **Pregunta cuál es el precio real en tienda** y usa ese como oficial.

---

## 7. Funcionalidades por fase

### Fase 1 — MVP del demo (objetivo: llevarlo a la reunión)

- [ ] Hero con botones de acción
- [ ] Menú por categorías, con corn dogs primero
- [ ] Tarjetas de producto con foto (placeholder si no hay)
- [ ] Personalizador de corn dog en 3 pasos (sabor, relleno, salsa) como en su menú
- [ ] Carrito: agregar, quitar, cantidad, total
- [ ] Botón "Pedir por WhatsApp" con mensaje armado
- [ ] Botón "Pedir por Uber Eats"
- [ ] Ubicación, horario y botón "Cómo llegar"
- [ ] Enlaces a Instagram y TikTok
- [ ] Diseño responsive
- [ ] Datos estructurados (SEO local)

### Fase 2 — Si les interesa

- [ ] Pedido para recoger con hora (pensado para estudiantes entre clases)
- [ ] Promos en la web (ej. "1 corn dog = 1 mochi donut gratis", promo estudiante)
- [ ] Fidelización con número de teléfono
- [ ] Panel simple para editar el menú sin tocar código (CMS ligero o Google Sheets como fuente)
- [ ] Pago en línea
- [ ] Dashboard de ventas y productos más pedidos (donde aportan tus datos y matemáticas)

---

## 8. Detalle técnico clave

### 8.1 Mensaje de WhatsApp (`whatsapp.js`)

```js
import negocio from "../data/negocio.json";
import { formatoRD } from "./formato.js";

export function enlaceWhatsApp(items) {
  const lineas = items.map(
    (i) => `• ${i.cantidad} x ${i.nombre} — ${formatoRD(i.precio * i.cantidad)}`
  );
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const texto = [
    "Hola Mochizuki, quiero hacer este pedido:",
    "",
    ...lineas,
    "",
    `Total: ${formatoRD(total)}`,
    "Nombre:",
    "Para recoger a las:",
  ].join("\n");

  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
}
```

### 8.2 Formato de moneda (`formato.js`)

```js
export const formatoRD = (n) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(n);
```

### 8.3 Carrito (`carrito.js`) — reglas

- Estructura: `[{ id, nombre, precio, cantidad, opciones: { relleno, salsas: [], extras: [] } }]`. Dos líneas del mismo producto con opciones distintas son líneas separadas.
- El precio de la línea = precio base + sobreprecios de las opciones (ej. mozzarella +75, salsa adicional +50).
- Persistir en `localStorage` bajo la clave `mochizuki_carrito`, envuelto en `try/catch`.
- Cantidad mínima 1; si baja a 0, se elimina.
- Los productos con `disponible: false` no se pueden agregar.

### 8.4 SEO local (en `index.html`)

```html
<title>Mochizuki RD | Mochi Donuts y K-Corn Dogs en Santo Domingo</title>
<meta name="description" content="Mochi donuts japonesas y corn dogs coreanos frente a la UASD. Mira el menú y pide por WhatsApp." />
<meta property="og:title" content="Mochizuki RD" />
<meta property="og:image" content="/img/og.webp" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Mochizuki RD",
  "servesCuisine": ["Japonesa", "Coreana"],
  "telephone": "+1-829-648-8712",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "C. José Dolores Alfonseca 6",
    "addressLocality": "Santo Domingo",
    "addressCountry": "DO"
  },
  "sameAs": ["https://www.instagram.com/mochizuki.rd/"]
}
</script>
```

> Completa `openingHours` solo cuando confirmes el horario real.

### 8.5 Accesibilidad y rendimiento

- Texto alternativo en todas las imágenes; contraste suficiente.
- Imágenes en **WebP**, máximo ~150 KB cada una, `loading="lazy"`.
- Botones táctiles de al menos 44×44 px.
- Fuentes: máximo 2 familias, con `font-display: swap`.

---

## 9. Entorno local en VS Code (paso a paso)

### 9.1 Extensiones recomendadas

- **ESLint** y **Prettier** (formato consistente)
- **Live Server** (opcional, Vite ya trae su servidor)
- **Error Lens** (errores en línea)
- **Path Intellisense**
- **Image Preview**
- **GitLens** (opcional)

### 9.2 Crear el proyecto

```bash
# 1. Abrir la carpeta que ya existe (contiene el plan y /referencias)
cd F:\Mochizuki_restaurante_demo

# 2. Crear el proyecto Vite EN ESTA MISMA CARPETA (plantilla JavaScript sin framework).
#    Si pregunta por "directorio no vacío", elige "Ignore files and continue":
#    no borra PLAN_ARQUITECTURA_DEMO.md ni la carpeta referencias.
npm create vite@latest . -- --template vanilla
npm install

# 3. Abrir en VS Code
code .

# 4. Correr en local
npm run dev
```

Vite imprime una dirección como `http://localhost:5173`. Ábrela en el navegador; los cambios se ven al guardar.

### 9.3 Probar en tu celular (misma red Wi-Fi)

```bash
npm run dev -- --host
```

Vite muestra una dirección tipo `http://192.168.x.x:5173`. Ábrela desde el teléfono. Es la mejor forma de revisar el diseño real en móvil.

### 9.4 Scripts útiles (`package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

- `npm run dev` — desarrollo con recarga en caliente
- `npm run build` — genera la carpeta `dist/` (lo que se sube a producción)
- `npm run preview` — sirve `dist/` localmente para probar **lo mismo que verá producción**

### 9.5 Configuración de VS Code (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n"
}
```

### 9.6 Git desde el inicio

```bash
git init
git add .
git commit -m "chore: proyecto inicial del demo Mochizuki"
```

`.gitignore` mínimo:

```
node_modules
dist
.env
.DS_Store
referencias/
```

> `referencias/` queda fuera de Git a propósito: son capturas de terceros solo para consulta y no deben acabar en un repositorio ni en producción.

---

## 10. Calendario sugerido

| Día | Entregable |
|---|---|
| 1 | Proyecto creado, estructura de carpetas, `negocio.json` y `menu.json` con datos reales |
| 2 | Maquetación mobile: hero, menú y tarjetas |
| 3 | Carrito + mensaje de WhatsApp |
| 4 | Ubicación, horario, redes, SEO básico |
| 5 | Pulido visual, imágenes optimizadas, pruebas en celular |
| 6 | Despliegue de prueba, Lighthouse, lista de verificación |
| 7 | Ensayo de la presentación |

Los tiempos son una estimación; ajústalos a tu semana de clases.

---

## 11. Pruebas y lista de verificación

### Antes de mostrarlo

- [ ] Se ve bien en 360 px, 414 px, tablet y escritorio
- [ ] Probado en Chrome y Safari (iPhone) si es posible
- [ ] El carrito suma bien (probar con cantidades distintas)
- [ ] El enlace de WhatsApp abre con el mensaje correcto, incluidos acentos y saltos de línea
- [ ] Los botones de Uber Eats, Instagram y Maps abren lo correcto
- [ ] Sin errores en la consola del navegador
- [ ] `npm run build` termina sin errores y `npm run preview` funciona
- [ ] Lighthouse móvil: Rendimiento, Accesibilidad y SEO ≥ 90
- [ ] Todos los precios marcados como "referencia" hasta la confirmación

### Pruebas manuales del carrito

| Caso | Resultado esperado |
|---|---|
| Agregar 1 producto | Total = precio |
| Agregar el mismo 3 veces | Cantidad 3, total triple |
| Quitar hasta 0 | Producto desaparece |
| Recargar la página | El carrito se conserva |
| Carrito vacío | El botón de WhatsApp está deshabilitado |

---

## 12. Plan a producción

### 12.1 Despliegue del demo (para compartir un enlace)

1. Subir el proyecto a un repositorio de GitHub (puede ser privado).
2. Conectar el repositorio a **Cloudflare Pages**, **Netlify** o **Vercel**.
3. Configuración de build: comando `npm run build`, carpeta de salida `dist`.
4. Cada `git push` publica una nueva versión automáticamente.

Resultado: una URL tipo `mochizuki-demo.pages.dev` para enseñar al dueño desde su teléfono.

### 12.2 Si dicen que sí

- Registrar un **dominio propio** (ej. `mochizuki.do` o `mochizukird.com`, según disponibilidad y costo).
- Conectarlo al hosting y activar HTTPS.
- **Enlazar la web en Google Business Profile**, en la bio de Instagram y en el QR del local.
- Corregir dirección, horario y categoría en Google, Uber Eats y directorios.
- Añadir analítica privada y ligera (Plausible o Cloudflare Web Analytics) para medir visitas y clics a WhatsApp.

---

## 13. Riesgos y decisiones abiertas

| Tema | Riesgo | Qué hacer |
|---|---|---|
| Fotos y logo | Usar imágenes del negocio sin permiso | Para el demo, placeholders o fotos propias; pedir autorización antes de publicar las suyas |
| Precios | Dos fuentes con valores distintos | Confirmar con el dueño; etiquetar "referencia" |
| Dirección / sucursales | Uber Eats y donde.do siguen apuntando a Plaza Juan Dauhajre; Google e Instagram, a C. José Dolores Alfonseca 6 (una publicación habla de "Nueva ubicación") | Confirmar si se mudaron o si son dos sucursales, y cuál es la oficial |
| Producto "Nama Donuts" | Aparece en un póster de Instagram (sabores Cookies & Cream, Matcha, Chocolate, Fresa) pero no en ningún menú | Preguntar si está a la venta antes de incluirlo |
| Combos de Uber Eats | Hay una promo "Ding Dong" (2 corn dogs originales + bebida) que existe solo en esa plataforma | Preguntar si la quieren replicar en la web propia |
| Carpeta `referencias/` | Contiene capturas del negocio | Es solo para consulta: no se incluye en `dist/`, no se sube a producción ni se publica en el repositorio |
| Número de WhatsApp | Puede que el (829) 648-8712 no tenga WhatsApp | Confirmar o pedir el número oficial de pedidos |
| Horario | Google dice 8:00 p. m., Uber Eats 7:30 p. m. | Confirmar y unificar |
| Pedidos por WhatsApp | Alguien debe atenderlos | Preguntar quién responde y en qué horario |
| Marca | El demo usa su nombre y marca | Indicar claramente que es una propuesta, no una web oficial, y no publicarla como suya sin su acuerdo |

---

## 14. Preguntas para la reunión con el dueño

1. ¿Cuántos pedidos al día entran por Uber Eats y qué comisión pagan?
2. ¿Cuál es el horario real y la dirección oficial? ¿Hay más de una sucursal?
3. ¿Qué precios son los oficiales en tienda?
4. ¿Atienden pedidos por WhatsApp? ¿Quién los responde?
5. ¿Quién maneja Instagram y la ficha de Google?
6. ¿Qué es lo que más tiempo les quita hoy?
7. ¿Les interesaría una promo para estudiantes o pedidos para recoger entre clases?

---

## 15. Referencias del proyecto

- Capturas del negocio: carpeta `referencias/` (9 imágenes, descritas en la sección 5)
- Informe de puntos de dolor: https://claude.ai/artifact/QS7raa8DYsuxMHKE9pBqji
- Ficha de Google Maps, Uber Eats e Instagram: enlaces en `negocio.json`
- Documentación de Vite: https://vite.dev
