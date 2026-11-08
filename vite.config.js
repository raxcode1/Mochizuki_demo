import { defineConfig } from "vite";

// Configuración mínima de Vite.
// El plugin "bloquear-referencias" evita que el servidor de desarrollo
// sirva la carpeta referencias/ (capturas de terceros, solo de consulta).
// En el build no hace falta: Vite solo empaqueta lo que index.html importa
// y lo que está en public/.
export default defineConfig({
  plugins: [
    {
      name: "bloquear-referencias",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && decodeURIComponent(req.url).startsWith("/referencias")) {
            res.statusCode = 404;
            res.end("No disponible");
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && decodeURIComponent(req.url).startsWith("/referencias")) {
            res.statusCode = 404;
            res.end("No disponible");
            return;
          }
          next();
        });
      },
    },
  ],
});
