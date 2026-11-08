// menu.js — Pinta la barra de categorías y las tarjetas de producto
// a partir de menu.json. No guarda estado: solo genera HTML.
// Los botones llevan data-accion y data-id; main.js escucha los clics.

import menu from "../data/menu.json";
import { formatoRD, escaparHTML as esc } from "./formato.js";
import { conjuntoDe, sePuedePedir } from "./opciones.js";

// Ruta base del sitio ("/" en local). Las imágenes viven en public/.
const BASE = import.meta.env.BASE_URL;

export function pintarMenu({ nav, contenedor }) {
  const categorias = [...menu.categorias].sort((a, b) => a.orden - b.orden);

  nav.innerHTML = categorias
    .map((c) => `<li><a href="#cat-${c.id}">${c.emoji} ${esc(c.nombre)}</a></li>`)
    .join("");

  contenedor.innerHTML = categorias.map(pintarCategoria).join("");
}

function pintarCategoria(categoria) {
  const productos = menu.productos.filter((p) => p.categoria === categoria.id);
  if (productos.length === 0) return "";

  // Si algún conjunto de opciones usa esta categoría como "paso 1: sabor"
  // (los corn dogs), mostramos la franja "¿Cómo funciona?" con los 3 pasos.
  const conjuntoConSabor = Object.values(menu.conjuntos_opciones).find(
    (c) => c.paso_sabor?.categoria === categoria.id,
  );

  return `
    <section class="categoria" id="cat-${categoria.id}" aria-labelledby="titulo-${categoria.id}">
      <h3 class="pincelada" id="titulo-${categoria.id}">${esc(categoria.nombre)}</h3>
      ${categoria.intro ? `<p class="categoria__intro">${esc(categoria.intro)}</p>` : ""}
      ${conjuntoConSabor ? pintarComoFunciona(conjuntoConSabor, productos[0]) : ""}
      <div class="rejilla">${productos.map(pintarTarjeta).join("")}</div>
    </section>`;
}

// Franja marrón con los pasos del personalizador, generada desde el JSON
function pintarComoFunciona(conjunto, primerProducto) {
  const pasos = [
    `<li><span><strong>${esc(conjunto.paso_sabor.titulo)}</strong></span></li>`,
    ...conjunto.grupos
      .filter((g) => g.paso)
      .map(
        (g) =>
          `<li><span><strong>${esc(g.titulo)}:</strong> ${esc(g.items.map((i) => i.nombre).join(", "))}</span></li>`,
      ),
  ];

  return `
    <div class="como-funciona">
      <h4>¿Cómo funciona?</h4>
      <ol class="como-funciona__pasos">${pasos.join("")}</ol>
      <button type="button" class="boton boton--primario" data-accion="personalizar" data-id="${primerProducto.id}">
        ¡Arma el tuyo! 🌭
      </button>
    </div>`;
}

function pintarEtiquetas(producto) {
  return (producto.etiquetas ?? [])
    .map((id) => menu.etiquetas[id])
    .filter(Boolean)
    .map((e) => `<span class="pastilla ${e.clase}">${esc(e.texto)}</span>`)
    .join("");
}

// Botón según el tipo de producto
function pintarAccion(producto) {
  const nombre = esc(producto.nombre);
  if (producto.disponible === false) {
    return `<span class="pastilla pastilla--claro">Agotado</span>`;
  }
  if (!sePuedePedir(producto)) {
    return `<span class="pastilla pastilla--claro">Solo en tienda</span>`;
  }
  if (conjuntoDe(producto)) {
    return `<button type="button" class="boton boton--primario boton--chico" data-accion="personalizar" data-id="${producto.id}" aria-label="Personalizar ${nombre}">Personalizar</button>`;
  }
  return `<button type="button" class="boton boton--primario boton--chico" data-accion="agregar" data-id="${producto.id}" aria-label="Agregar ${nombre} al pedido">Agregar</button>`;
}

function pintarTarjeta(producto) {
  // Las ilustraciones provisionales están en img/placeholders/.
  // Cuando haya fotos reales (con permiso), basta cambiar "imagen" en el JSON.
  const esPlaceholder = producto.imagen.includes("placeholders/");
  const alt = esPlaceholder ? `Ilustración provisional de ${producto.nombre}` : producto.nombre;

  return `
    <article class="tarjeta ${sePuedePedir(producto) ? "" : "tarjeta--bloqueada"}">
      <div class="tarjeta__imagen">
        <img src="${BASE}${esc(producto.imagen)}" alt="${esc(alt)}" width="160" height="160"
             loading="lazy" decoding="async" class="${esPlaceholder ? "" : "es-foto"}" />
        <div class="tarjeta__etiquetas">${pintarEtiquetas(producto)}</div>
      </div>
      <div class="tarjeta__cuerpo">
        <h4 class="tarjeta__nombre">${esc(producto.nombre)}</h4>
        <p class="tarjeta__descripcion">${esc(producto.descripcion)}</p>
        <div class="tarjeta__pie">
          <span class="precio">${formatoRD(producto.precio)}</span>
          ${pintarAccion(producto)}
        </div>
      </div>
    </article>`;
}
