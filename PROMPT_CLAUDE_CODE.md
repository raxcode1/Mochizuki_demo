Vas a construir el demo web de "Mochizuki RD", una tienda de mochi donuts japonesas y K-corn dogs coreanos en Santo Domingo, frente a la UASD. Es una propuesta que presentaré al dueño, no un sitio oficial. Trabajas en la carpeta actual (F:\Mochizuki_restaurante_demo), que ya contiene PLAN_ARQUITECTURA_DEMO.md y la carpeta referencias/.

## Paso 0: lee antes de escribir código
1. Lee PLAN_ARQUITECTURA_DEMO.md completo. Es la fuente de verdad de alcance, stack (Vite + HTML/CSS/JS plano, sin framework ni backend), estructura de carpetas, modelos de datos, identidad de marca (sección 2.1) y fases. No cambies el stack sin preguntarme.
2. Mira TODAS las imágenes de referencias/ (01 a 03: menú de Canva; 04 a 06: Instagram; 07 y 08: Uber Eats; 09: Google Maps). Úsalas para afinar colores, formas, jerarquía y tono visual. Son solo de consulta: no las copies al sitio, no las muevas a public/ ni a src/ y no las incluyas en el build.
3. Crea un CLAUDE.md en la raíz que resuma: el stack, los comandos (dev, build, preview), las reglas de marca y las reglas de datos de este prompt.
4. Muéstrame un plan corto de lo que harás en esta sesión y espera mi "ok" antes de generar archivos.

## Identidad de marca (el sitio debe sentirse como ellos)
Estética: street food asiático, juvenil, colorido, dulce y divertido. Nada corporativo ni minimalista frío.

Colores (medidos de las capturas, aproximados; guárdalos como variables CSS en src/styles/variables.css y afínalos contra las imágenes de referencias/):
- Naranja de marca: #F05424 (logo; botones y acentos principales)
- Naranja de pincelada: #FF7035 (etiquetas de categoría del menú)
- Marrón chocolate: #5A3C18 (texto del logo) y #70380A (fondos de bloque)
- Rosa donut: #FCBAC0
- Durazno suave: #FFD0B8
- Crema (fondo general): #FFF8F0
- Tinta (texto): #1A1A1A
Verifica contraste AA. El naranja sobre crema no sirve para texto pequeño: úsalo en botones con texto oscuro o blanco grande.

Logo: círculo naranja con una dona rosa y texto circular; el wordmark es "MOCHIZUKI" con "MOCHI" en marrón y "ZUKI" en naranja, y debajo "JAPANESE DONUTS & KOREAN CORN DOGS". NO uses el logo oficial: haz un wordmark de texto provisional con esa misma lógica de color, claramente marcado como provisional.

Tipografía (estimada a ojo, no confirmada): títulos en sans redondeada y muy gruesa tipo "Baloo 2" o "Fredoka" (700 a 800), en MAYÚSCULAS; textos en "Poppins" (400, 500, 600). Máximo 2 familias, con font-display: swap.

Formas y recursos visuales:
- Encabezados de categoría como pinceladas naranjas con texto blanco en mayúsculas (así se ven "MOCHI DONUTS", "YAKULTS" y "CAFÉS" en su menú).
- Bordes muy redondeados (16 a 24 px), manchas orgánicas marrón y durazno como fondo de bloques, círculos y puntos decorativos.
- La dona como motivo gráfico decorativo (SVG propio, simple y original).
- Etiquetas tipo pastilla para "NEW", "MÁS VENDIDO" y "+18".

Voz y copywriting (español dominicano, tuteo, cercano):
- Entusiasta y juvenil, con exclamaciones abiertas y cerradas (¡…!), imperativos ("Prepárate", "Ven", "Elige") y emojis de marca con moderación (🍩 🌭 🔥 ✨ 🧡). Puede mezclar un toque de inglés, como su "Asian Street Food".
- Mensajes de marca: son la primera tienda del país especializada en mochi donuts japonesas y corn dogs coreanos; los corn dogs se hacen al momento y eliges sabor, relleno y salsa; ambiente acogedor y buena música; ubicados en el campus universitario; promo "compra un corn dog y llévate una mochi donut gratis" (solo en tienda; no la muestres como vigente sin confirmarlo).
- Escribe copy ORIGINAL en ese tono. No copies textos literales de su Instagram ni de sus reseñas.

## El menú y el personalizador de corn dogs
Su menú real se arma en 3 pasos, y el sitio debe reflejarlo:
1. Elige tu sabor: Original, Ramen, Papa, Cheetos Flamin' Hot, Doritos Crunch, Pizza Pizza, Corn Cheese.
2. Elige tu relleno: salchicha (gratis), mozzarella (+75) o mitad y mitad (+25 o gratis según la lámina; confirmar).
3. Elige tu salsa (+1): ketchup, sweet chili, BBQ, honey mustard, spicy mayo, parmesano.
Extras: azúcar (gratis) y salsa adicional (+50).
El carrito debe guardar esas opciones por línea y sumar los sobreprecios (ver PLAN sección 6.3 y 8.3).

## Reglas de datos (críticas)
- Todos los datos viven en src/data/negocio.json y src/data/menu.json. Ningún precio, horario ni dirección va escrito a mano en el HTML o el JS.
- Los precios NO son confiables: las láminas 2 y 3 del menú de Canva y Uber Eats traen precios distintos para los mismos productos (tabla en PLAN sección 6.3). Usa el juego de Uber Eats como referencia, déjalo en el JSON con un comentario o campo "fuente" por producto y muestra en el sitio la nota "Precios de referencia".
- El horario NO está confirmado (Google dice cierre a las 8:00 p. m.; Uber Eats, 7:30 p. m.): no lo inventes. Muestra "Horario por confirmar" y deja el campo preparado.
- La dirección que uso es C. José Dolores Alfonseca 6, Santo Domingo (frente a la UASD, Facultad de Economía). Uber Eats aún muestra la de Plaza Juan Dauhajre: no la uses.
- El número de WhatsApp está sin verificar: déjalo en negocio.json con un TODO visible y que el botón lo lea de ahí.
- Las sojus (alcohol) llevan etiqueta "+18" y no entran en el flujo de pedido por WhatsApp del demo.
- No incluyas "Nama Donuts" ni el combo "Ding Dong" de Uber Eats: no están confirmados en el menú propio.
- No inventes reseñas, cifras de clientes ni premios. Si muestras la calificación (4.5 en Google, 4.6 en Uber Eats), indícala como cifra pública a la fecha del demo.

## Imágenes y propiedad
- No descargues ni incrustes fotos, capturas ni el logo oficial del negocio. Usa marcadores de posición con la paleta de marca (bloques de color con ilustraciones simples de dona y corn dog en SVG propio) y deja las rutas listas para sustituirlas por fotos reales con permiso.
- Pie de página: "Demo de propuesta por Raxotech. No es el sitio oficial."
- Asegura que referencias/ esté en .gitignore.

## Qué construir en esta sesión (Fase 1 del plan, en este orden)
1. Crear el proyecto Vite vanilla EN ESTA MISMA CARPETA, sin borrar PLAN_ARQUITECTURA_DEMO.md ni referencias/ (si la herramienta pregunta por directorio no vacío, elige ignorar archivos existentes y continuar). Estructura de carpetas del plan, .gitignore, README y scripts dev, build y preview.
2. Sistema de diseño: variables.css (colores, tipografías, radios, sombras, espaciados), base.css y components.css (botón, pastilla, pincelada de categoría, tarjeta de producto, carrito).
3. negocio.json y menu.json con los datos del plan, incluyendo el campo opciones por producto.
4. Secciones mobile-first: hero, menú por categorías (corn dogs primero), personalizador de corn dog en 3 pasos, ubicación y horario, redes, pie.
5. Carrito con localStorage y botón "Pedir por WhatsApp" que arma el mensaje con las opciones de cada línea (módulos carrito.js, whatsapp.js, formato.js). Botón secundario a Uber Eats y botón "Cómo llegar".
6. SEO básico: title, description, Open Graph y JSON-LD tipo Restaurant, sin horario hasta confirmarlo.
7. Accesibilidad: alt en imágenes, foco visible, botones táctiles de 44 por 44 px mínimo, un solo h1.

## Forma de trabajar
- Un commit por paso con mensaje claro. No hagas push.
- Al terminar cada paso corre npm run build y arregla errores antes de seguir.
- Si algo es ambiguo o necesitas una decisión mía (fuentes, paleta, textos, precios), pregúntame en lugar de suponer.
- No ejecutes comandos destructivos ni borres archivos que no hayas creado tú.
- Código simple y comentado en español donde no sea obvio: soy estudiante y debo poder explicarlo.

## Definición de terminado
- npm run dev funciona y se ve bien a 360, 414, 768 y 1280 px.
- npm run build y npm run preview funcionan sin errores y dist/ no contiene nada de referencias/.
- El enlace de WhatsApp abre con el pedido bien armado (acentos, saltos de línea y opciones del corn dog).
- Ningún dato duro fuera de los JSON.
- Al final dame: lista de pendientes, qué datos debo confirmar con el dueño y cómo probarlo en mi celular con npm run dev -- --host.
