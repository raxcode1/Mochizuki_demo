// personalizador.js — Diálogo para elegir opciones antes de agregar.
// Para los corn dogs muestra los 3 pasos de su menú:
//   1) sabor  2) relleno  3) salsa  (+ extras)
// Para otros productos con opciones (yakult, onigiri...) muestra solo sus grupos.

import menu from "../data/menu.json";
import { formatoRD, formatoExtra, escaparHTML as esc } from "./formato.js";
import {
  buscarProducto,
  conjuntoDe,
  sePuedePedir,
  seleccionPorDefecto,
  limpiarSeleccion,
  validarSeleccion,
  precioUnitario,
  ayudaDeGrupo,
} from "./opciones.js";

const BASE = import.meta.env.BASE_URL;
const CANTIDAD_MAX = 20;
const CAMPO_SABOR = "__sabor"; // nombre del grupo de radios del paso 1

export function crearPersonalizador({ dialogo, onAgregar }) {
  // Atajo para encontrar piezas del diálogo por su data-personalizador
  const $ = (nombre) => dialogo.querySelector(`[data-personalizador="${nombre}"]`);
  const form = $("form");
  const cuerpo = $("cuerpo");

  let producto = null;
  let cantidad = 1;

  // ---------- Lectura del formulario ----------
  function leerSeleccion() {
    const seleccion = {};
    for (const grupo of conjuntoDe(producto)?.grupos ?? []) {
      seleccion[grupo.id] = [...form.querySelectorAll(`input[name="${grupo.id}"]:checked`)].map((i) => i.value);
    }
    return seleccion;
  }

  function actualizarPie() {
    $("cantidad").textContent = cantidad;
    $("menos").disabled = cantidad <= 1;
    $("mas").disabled = cantidad >= CANTIDAD_MAX;
    $("precio").textContent = formatoRD(precioUnitario(producto, leerSeleccion()) * cantidad);
  }

  // ---------- Pintado ----------
  function pintarCabeceraProducto() {
    return `
      <img src="${BASE}${esc(producto.imagen)}" alt="" width="72" height="72" />
      <div>
        <p><strong>${esc(producto.nombre)}</strong> · ${formatoRD(producto.precio)}</p>
        <p>${esc(producto.descripcion)}</p>
      </div>`;
  }

  function pintarPasoSabor(pasoSabor) {
    const sabores = menu.productos.filter((p) => p.categoria === pasoSabor.categoria && sePuedePedir(p));
    const opciones = sabores
      .map(
        (p) => `
        <label class="opcion">
          <input type="radio" name="${CAMPO_SABOR}" value="${p.id}" ${p.id === producto.id ? "checked" : ""} />
          <span class="opcion__caja">${esc(p.nombre_corto ?? p.nombre)}
            <span class="opcion__extra">${formatoRD(p.precio)}</span>
          </span>
        </label>`,
      )
      .join("");
    return `
      <fieldset class="paso">
        <legend class="paso__titulo"><span class="paso__numero">1</span>${esc(pasoSabor.titulo)}</legend>
        <div class="opciones">${opciones}</div>
      </fieldset>`;
  }

  function pintarGrupo(grupo, seleccion) {
    const tipo = grupo.tipo === "unica" ? "radio" : "checkbox";
    const elegidos = seleccion[grupo.id] ?? [];
    // En grupos con "incluidas" (salsas) el precio va en la ayuda, no en cada opción
    const mostrarExtraPorItem = grupo.incluidas == null;
    const ayuda = ayudaDeGrupo(grupo);

    const opciones = grupo.items
      .map((item) => {
        let extra = mostrarExtraPorItem ? formatoExtra(item.extra ?? 0) : "";
        if (item.por_confirmar) extra += " · por confirmar";
        return `
        <label class="opcion">
          <input type="${tipo}" name="${grupo.id}" value="${item.id}" ${elegidos.includes(item.id) ? "checked" : ""} />
          <span class="opcion__caja">${esc(item.nombre)}
            ${extra ? `<span class="opcion__extra">${esc(extra)}</span>` : ""}
          </span>
        </label>`;
      })
      .join("");

    return `
      <fieldset class="paso">
        <legend class="paso__titulo">
          ${grupo.paso ? `<span class="paso__numero">${grupo.paso}</span>` : ""}${esc(grupo.titulo)}
        </legend>
        ${ayuda ? `<p class="paso__ayuda">${esc(ayuda)}</p>` : ""}
        <div class="opciones">${opciones}</div>
      </fieldset>`;
  }

  function pintar(seleccion) {
    const conjunto = conjuntoDe(producto);
    $("titulo").textContent = conjunto.paso_sabor ? "Arma tu corn dog 🌭" : producto.nombre;

    cuerpo.innerHTML = `
      <div class="personalizador__producto" data-personalizador="producto">${pintarCabeceraProducto()}</div>
      ${conjunto.paso_sabor ? pintarPasoSabor(conjunto.paso_sabor) : ""}
      ${conjunto.grupos.map((g) => pintarGrupo(g, seleccion)).join("")}`;
    $("error").textContent = "";
    actualizarPie();
  }

  // ---------- Eventos ----------
  form.addEventListener("change", (evento) => {
    // Cambiar de sabor = cambiar de producto, pero se conservan relleno y salsas
    if (evento.target.name === CAMPO_SABOR) {
      const seleccion = leerSeleccion();
      producto = buscarProducto(evento.target.value);
      $("producto").innerHTML = pintarCabeceraProducto();
      // Si el nuevo producto tuviera otras opciones, se limpia la selección
      const limpia = limpiarSeleccion(producto, seleccion);
      if (JSON.stringify(limpia) !== JSON.stringify(seleccion)) pintar(limpia);
    }
    $("error").textContent = "";
    actualizarPie();
  });

  $("menos").addEventListener("click", () => {
    cantidad = Math.max(1, cantidad - 1);
    actualizarPie();
  });
  $("mas").addEventListener("click", () => {
    cantidad = Math.min(CANTIDAD_MAX, cantidad + 1);
    actualizarPie();
  });

  form.addEventListener("submit", (evento) => {
    evento.preventDefault(); // validamos antes de cerrar
    const seleccion = leerSeleccion();
    const error = validarSeleccion(producto, seleccion);
    if (error) {
      $("error").textContent = error;
      return;
    }
    onAgregar(producto.id, seleccion, cantidad);
    dialogo.close();
  });

  // ---------- API pública ----------
  return {
    abrir(productoId) {
      const elegido = buscarProducto(productoId);
      if (!elegido || !sePuedePedir(elegido) || !conjuntoDe(elegido)) return;
      producto = elegido;
      cantidad = 1;
      pintar(seleccionPorDefecto(producto));
      dialogo.showModal();
      cuerpo.scrollTop = 0;
    },
  };
}
