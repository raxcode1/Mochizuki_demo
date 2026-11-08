import { defineConfig } from "vite";
import { readFileSync } from "node:fs";

// ---------------------------------------------------------------
// Plugin 1: "seo-desde-json"
// Inyecta en el <head> el título, la descripción, Open Graph y el
// JSON-LD (datos estructurados tipo Restaurant) usando negocio.json
// y menu.json. Así los buscadores ven los datos en el HTML estático
// y no hay direcciones ni teléfonos escritos a mano en index.html.
// Se leen los JSON en cada build/recarga para tener siempre lo último.
// ---------------------------------------------------------------
const leerJSON = (ruta) => JSON.parse(readFileSync(new URL(ruta, import.meta.url), "utf8"));

function datosEstructurados(negocio, menu) {
  const precios = menu.productos.filter((p) => p.pedible_online !== false).map((p) => p.precio);
  const datos = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: negocio.nombre,
    description: negocio.descripcion_seo,
    url: negocio.sitio.url,
    image: `${negocio.sitio.url}/img/og.png`,
    servesCuisine: ["Japonesa", "Coreana", "Comida callejera asiática"],
    telephone: negocio.telefono.e164,
    priceRange: `RD$${Math.min(...precios)} - RD$${Math.max(...precios)}`,
    hasMenu: `${negocio.sitio.url}/#menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: negocio.direccion.calle,
      addressLocality: negocio.direccion.ciudad,
      postalCode: negocio.direccion.codigo_postal,
      addressCountry: negocio.direccion.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: negocio.geo.lat, longitude: negocio.geo.lng },
    sameAs: [negocio.enlaces.instagram, negocio.enlaces.tiktok].filter(Boolean),
  };
  // El horario SOLO se publica cuando esté confirmado en negocio.json
  if (negocio.horario.confirmado && negocio.horario.dias.length > 0) {
    datos.openingHours = negocio.horario.dias.map((d) => d.schema).filter(Boolean);
  }
  // JSON seguro dentro de <script>: "<" escapado para que no cierre la etiqueta
  return JSON.stringify(datos, null, 2).replaceAll("<", "\\u003c");
}

function seoDesdeJSON() {
  return {
    name: "seo-desde-json",
    transformIndexHtml() {
      const negocio = leerJSON("./src/data/negocio.json");
      const menu = leerJSON("./src/data/menu.json");
      const titulo = `${negocio.nombre} | Mochi Donuts y K-Corn Dogs en ${negocio.direccion.ciudad}`;
      const url = negocio.sitio.url;

      const meta = (atributo, nombre, contenido) => ({
        tag: "meta",
        attrs: { [atributo]: nombre, content: contenido },
        injectTo: "head",
      });

      return [
        { tag: "title", children: titulo, injectTo: "head" },
        meta("name", "description", negocio.descripcion_seo),
        { tag: "link", attrs: { rel: "canonical", href: `${url}/` }, injectTo: "head" },
        // Open Graph (WhatsApp, Facebook, Instagram usan esto al compartir el enlace)
        meta("property", "og:type", "website"),
        meta("property", "og:locale", "es_DO"),
        meta("property", "og:site_name", negocio.nombre),
        meta("property", "og:title", titulo),
        meta("property", "og:description", negocio.descripcion_seo),
        meta("property", "og:url", `${url}/`),
        meta("property", "og:image", `${url}/img/og.png`),
        meta("property", "og:image:width", "1200"),
        meta("property", "og:image:height", "630"),
        meta("property", "og:image:alt", `${negocio.nombre}: ${negocio.lema}`),
        meta("name", "twitter:card", "summary_large_image"),
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          children: datosEstructurados(negocio, menu),
          injectTo: "head",
        },
      ]; // Vite escapa los valores de los atributos por nosotros
    },
  };
}

// ---------------------------------------------------------------
// Plugin 2: "bloquear-referencias"
// Evita que el servidor de desarrollo (y el de preview) sirvan la
// carpeta referencias/ (capturas de terceros, solo de consulta).
// En el build no hace falta: Vite solo empaqueta lo que index.html
// importa y lo que está en public/.
// ---------------------------------------------------------------
function bloquearReferencias() {
  const middleware = (req, res, next) => {
    if (req.url && decodeURIComponent(req.url).toLowerCase().startsWith("/referencias")) {
      res.statusCode = 404;
      res.end("No disponible");
      return;
    }
    next();
  };
  return {
    name: "bloquear-referencias",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [seoDesdeJSON(), bloquearReferencias()],
});
