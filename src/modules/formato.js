// formato.js — Utilidades de formato de texto y moneda.

// Un solo formateador reutilizado (crearlo cada vez es más lento).
// Resultado: 1240 -> "RD$1,240"
const formateadorRD = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatoRD = (n) => formateadorRD.format(n);

// Para opciones con sobreprecio: 75 -> "+RD$75"; 0 -> "Gratis"
export const formatoExtra = (n) => (n > 0 ? `+${formatoRD(n)}` : "Gratis");

// Escapa texto antes de meterlo en innerHTML, para que un nombre con
// "<" o "&" en el JSON no rompa la página.
export function escaparHTML(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
