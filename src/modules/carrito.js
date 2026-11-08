// carrito.js — Estado del carrito: agregar, quitar, cantidades, total.
// Se guarda en localStorage con la clave "mochizuki_carrito".
//
// Cada línea guardada es:  { clave, id, cantidad, seleccion }
//   - id:        id del producto en menu.json
//   - seleccion: opciones elegidas, ej. { relleno: ["mozzarella"], salsa: ["ketchup"] }
//   - clave:     id + opciones; dos corn dogs con opciones distintas = 2 líneas
//
// OJO: NO guardamos nombre ni precio. Se recalculan siempre desde menu.json,
// así un cambio de precio en el JSON se refleja también en carritos guardados.

import {
  buscarProducto,
  sePuedePedir,
  limpiarSeleccion,
  precioUnitario,
  detalleOpciones,
  claveLinea,
} from "./opciones.js";

const CLAVE_STORAGE = "mochizuki_carrito";
const CANTIDAD_MAX = 20;

const oyentes = new Set(); // funciones a llamar cuando el carrito cambia
let lineas = cargar();

// ---------- Persistencia (siempre en try/catch: el storage puede fallar) ----------
function cargar() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE) ?? "[]");
    if (!Array.isArray(guardado)) return [];
    const resultado = [];
    for (const linea of guardado) {
      const producto = buscarProducto(linea?.id);
      // Si el producto ya no existe o no se puede pedir, se descarta
      if (!sePuedePedir(producto)) continue;
      const seleccion = limpiarSeleccion(producto, linea.seleccion);
      const cantidad = Math.min(CANTIDAD_MAX, Math.max(1, Math.floor(Number(linea.cantidad)) || 1));
      const clave = claveLinea(producto.id, seleccion);
      const repetida = resultado.find((l) => l.clave === clave);
      if (repetida) repetida.cantidad = Math.min(CANTIDAD_MAX, repetida.cantidad + cantidad);
      else resultado.push({ clave, id: producto.id, cantidad, seleccion });
    }
    return resultado;
  } catch {
    return [];
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lineas));
  } catch {
    // Modo privado o storage lleno: el carrito sigue funcionando en memoria
  }
}

function notificar() {
  guardar();
  oyentes.forEach((fn) => fn());
}

// ---------- Acciones ----------
export function agregar(productoId, seleccion = {}, cantidad = 1) {
  const producto = buscarProducto(productoId);
  if (!sePuedePedir(producto)) return false; // ej. sojus +18 o "disponible: false"

  const limpia = limpiarSeleccion(producto, seleccion);
  const clave = claveLinea(producto.id, limpia);
  const existente = lineas.find((l) => l.clave === clave);

  if (existente) {
    existente.cantidad = Math.min(CANTIDAD_MAX, existente.cantidad + cantidad);
  } else {
    lineas.push({ clave, id: producto.id, cantidad: Math.min(CANTIDAD_MAX, cantidad), seleccion: limpia });
  }
  notificar();
  return true;
}

// delta = +1 o -1. Si la cantidad llega a 0, la línea se elimina.
export function cambiarCantidad(clave, delta) {
  const linea = lineas.find((l) => l.clave === clave);
  if (!linea) return;
  linea.cantidad += delta;
  if (linea.cantidad <= 0) {
    lineas = lineas.filter((l) => l.clave !== clave);
  } else {
    linea.cantidad = Math.min(CANTIDAD_MAX, linea.cantidad);
  }
  notificar();
}

export function quitar(clave) {
  lineas = lineas.filter((l) => l.clave !== clave);
  notificar();
}

export function vaciar() {
  lineas = [];
  notificar();
}

// ---------- Lectura ----------
// Líneas "completas" con nombre, precio y detalle calculados desde menu.json
export function obtenerLineas() {
  return lineas.map((linea) => {
    const producto = buscarProducto(linea.id);
    const precio = precioUnitario(producto, linea.seleccion);
    return {
      ...linea,
      nombre: producto.nombre,
      precioUnitario: precio,
      subtotal: precio * linea.cantidad,
      detalle: detalleOpciones(producto, linea.seleccion),
      maximo: CANTIDAD_MAX,
    };
  });
}

export function total() {
  return obtenerLineas().reduce((suma, l) => suma + l.subtotal, 0);
}

export function cantidadTotal() {
  return lineas.reduce((suma, l) => suma + l.cantidad, 0);
}

// Registra una función que se ejecuta cada vez que el carrito cambia
export function suscribir(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}
