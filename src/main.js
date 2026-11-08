// main.js — Punto de entrada del demo Mochizuki RD.
// Carga estilos, pinta la página con los datos de los JSON y conecta los clics.

// Fuentes autoalojadas (@fontsource ya trae font-display: swap).
// Solo el subconjunto "latin" (incluye á, é, ñ, ¡, ¿): menos peso.
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";

// Estilos: primero los tokens, luego la base, componentes y secciones.
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/secciones.css";

import menu from "./data/menu.json";
import { pintarMenu } from "./modules/menu.js";
import { crearPersonalizador } from "./modules/personalizador.js";
import { rellenarNegocio, cargarMapa } from "./modules/negocio.js";
import { buscarProducto } from "./modules/opciones.js";

// ---------- Aviso flotante ("¡Agregado!") ----------
const aviso = document.querySelector("[data-aviso]");
let temporizadorAviso;
function avisar(texto) {
  aviso.textContent = texto;
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => (aviso.textContent = ""), 2200);
}

// ---------- Agregar al pedido (se conecta al carrito en el paso 5) ----------
function agregar(productoId, seleccion = {}, cantidad = 1) {
  const producto = buscarProducto(productoId);
  avisar(`¡Listo! ${cantidad} × ${producto.nombre} 🧡`);
}

// ---------- Pintar la página ----------
rellenarNegocio();
pintarMenu({
  nav: document.querySelector('[data-menu="nav"]'),
  contenedor: document.querySelector('[data-menu="categorias"]'),
});

const personalizador = crearPersonalizador({
  dialogo: document.getElementById("personalizador"),
  onAgregar: agregar,
});

// Primer producto de la categoría que funciona como "paso 1: sabor" (corn dogs)
const conjuntoConSabor = Object.values(menu.conjuntos_opciones).find((c) => c.paso_sabor);
const primerCornDog = menu.productos.find((p) => p.categoria === conjuntoConSabor?.paso_sabor.categoria);

// ---------- Un solo "escuchador" de clics para toda la página ----------
// Cada botón dice qué hacer con data-accion (delegación de eventos).
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;

  switch (boton.dataset.accion) {
    case "personalizar":
      personalizador.abrir(boton.dataset.id);
      break;
    case "armar-corn-dog":
      if (primerCornDog) personalizador.abrir(primerCornDog.id);
      break;
    case "agregar":
      agregar(boton.dataset.id);
      break;
    case "cargar-mapa":
      cargarMapa(boton);
      break;
    case "cerrar-dialogo":
      boton.closest("dialog")?.close();
      break;
  }
});

// Cerrar un diálogo al tocar el fondo oscuro (fuera de la caja)
document.querySelectorAll("dialog").forEach((dialogo) => {
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) dialogo.close();
  });
});
