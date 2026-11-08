// opciones.js — Lógica PURA de productos y opciones (sin tocar el DOM).
// Aquí se calcula el precio con sobreprecios y el texto de las opciones.
// Lo usan el personalizador, el carrito y el mensaje de WhatsApp,
// así el cálculo vive en un solo lugar.
//
// Una "selección" es un objeto { idDelGrupo: [idsElegidos] }, por ejemplo:
//   { relleno: ["mozzarella"], salsa: ["ketchup", "bbq"], extras: [] }

import menu from "../data/menu.json";
import { formatoRD, formatoExtra } from "./formato.js";

// Índice id -> producto para buscar rápido
const productosPorId = new Map(menu.productos.map((p) => [p.id, p]));

export function buscarProducto(id) {
  return productosPorId.get(id) ?? null;
}

// Devuelve el conjunto de opciones del producto (o null si no tiene)
export function conjuntoDe(producto) {
  if (!producto?.opciones) return null;
  return menu.conjuntos_opciones[producto.opciones] ?? null;
}

// ¿Se puede agregar al carrito? (disponible y no excluido del pedido online, ej. sojus +18)
export function sePuedePedir(producto) {
  return Boolean(producto) && producto.disponible !== false && producto.pedible_online !== false;
}

// Selección inicial: el valor "por_defecto" en grupos de opción única;
// vacía en los de opción múltiple.
export function seleccionPorDefecto(producto) {
  const seleccion = {};
  const conjunto = conjuntoDe(producto);
  if (!conjunto) return seleccion;
  for (const grupo of conjunto.grupos) {
    seleccion[grupo.id] = grupo.tipo === "unica" && grupo.por_defecto ? [grupo.por_defecto] : [];
  }
  return seleccion;
}

// Quita de la selección cualquier id que ya no exista en el menú
// (útil al leer un carrito viejo de localStorage).
export function limpiarSeleccion(producto, seleccion = {}) {
  const limpia = {};
  const conjunto = conjuntoDe(producto);
  if (!conjunto) return limpia;
  for (const grupo of conjunto.grupos) {
    const validos = new Set(grupo.items.map((i) => i.id));
    let elegidos = (seleccion[grupo.id] ?? []).filter((id) => validos.has(id));
    if (grupo.tipo === "unica") elegidos = elegidos.slice(0, 1);
    limpia[grupo.id] = elegidos;
  }
  return limpia;
}

// Devuelve un mensaje de error si falta algo obligatorio, o null si todo bien
export function validarSeleccion(producto, seleccion) {
  const conjunto = conjuntoDe(producto);
  if (!conjunto) return null;
  for (const grupo of conjunto.grupos) {
    const cuantos = (seleccion[grupo.id] ?? []).length;
    const minimo = grupo.tipo === "unica" ? 1 : (grupo.minimo ?? 0);
    if (cuantos < minimo) {
      return `¡Ups! ${grupo.titulo} (mínimo ${minimo}).`;
    }
  }
  return null;
}

// Cuántas unidades adicionales se cobran en un grupo con "incluidas"
// (ej. salsas: 1 incluida; si eliges 3, se cobran 2 adicionales)
function adicionalesCobrados(grupo, cantidadElegida) {
  if (grupo.incluidas == null) return 0;
  return Math.max(0, cantidadElegida - grupo.incluidas);
}

// Precio de UNA unidad = precio base + sobreprecios de las opciones elegidas
export function precioUnitario(producto, seleccion = {}) {
  let total = producto.precio;
  const conjunto = conjuntoDe(producto);
  if (!conjunto) return total;

  for (const grupo of conjunto.grupos) {
    const elegidos = seleccion[grupo.id] ?? [];
    for (const item of grupo.items) {
      if (elegidos.includes(item.id)) total += item.extra ?? 0;
    }
    total += adicionalesCobrados(grupo, elegidos.length) * (grupo.precio_adicional ?? 0);
  }
  return total;
}

// Texto de ayuda de un grupo, generado con los números del JSON
// (así no hay precios escritos a mano en el JS).
export function ayudaDeGrupo(grupo) {
  if (grupo.incluidas != null && grupo.precio_adicional) {
    const palabra = grupo.incluidas === 1 ? grupo.unidad : grupo.unidades; // "salsa" / "salsas"
    return `Incluye ${grupo.incluidas} ${palabra}. Cada adicional: ${formatoRD(grupo.precio_adicional)}.`;
  }
  if (grupo.tipo === "multiple") return "Opcional. Puedes marcar varias.";
  return "";
}

// Lista legible de las opciones elegidas, para el carrito y WhatsApp:
//   [{ etiqueta: "Relleno", texto: "Mozzarella (+RD$75)" },
//    { etiqueta: "Salsas", texto: "Ketchup, BBQ (1 adicional +RD$50)" }]
export function detalleOpciones(producto, seleccion = {}) {
  const conjunto = conjuntoDe(producto);
  if (!conjunto) return [];
  const detalle = [];

  for (const grupo of conjunto.grupos) {
    const elegidos = grupo.items.filter((i) => (seleccion[grupo.id] ?? []).includes(i.id));
    if (elegidos.length === 0) continue;

    const nombres = elegidos.map((i) => (i.extra > 0 ? `${i.nombre} (${formatoExtra(i.extra)})` : i.nombre));
    let texto = nombres.join(", ");

    const extras = adicionalesCobrados(grupo, elegidos.length);
    if (extras > 0) {
      texto += ` (${extras} adicional${extras > 1 ? "es" : ""} ${formatoExtra(extras * grupo.precio_adicional)})`;
    }
    detalle.push({ etiqueta: grupo.etiqueta, texto });
  }
  return detalle;
}

// Clave única de una línea del carrito: mismo producto con opciones
// distintas = líneas distintas. Ordenamos para que el orden de clic no importe.
export function claveLinea(productoId, seleccion = {}) {
  const partes = Object.keys(seleccion)
    .sort()
    .map((g) => `${g}=${[...seleccion[g]].sort().join("+")}`);
  return [productoId, ...partes].join("|");
}
