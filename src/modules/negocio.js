// negocio.js — Rellena la página con los datos de negocio.json.
// En el HTML solo hay "huecos" marcados con atributos:
//   data-negocio="direccion.calle"   -> se pone el texto de ese campo
//   data-enlace="instagram"          -> se pone el href (o se oculta si es null)
//   data-negocio-horario             -> horario o "Horario por confirmar"
//   data-negocio-lista="calificaciones"
// Así ningún dato del negocio queda escrito a mano en el HTML.

import negocio from "../data/negocio.json";
import { escaparHTML as esc } from "./formato.js";

// Lee un campo con ruta tipo "direccion.calle"
function leer(ruta) {
  return ruta.split(".").reduce((objeto, clave) => objeto?.[clave], negocio);
}

function rellenarTextos() {
  document.querySelectorAll("[data-negocio]").forEach((el) => {
    const valor = leer(el.dataset.negocio);
    if (valor != null) el.textContent = valor;
  });
}

function rellenarEnlaces() {
  const enlaces = { ...negocio.enlaces, telefono: `tel:${negocio.telefono.e164}` };
  document.querySelectorAll("[data-enlace]").forEach((a) => {
    const url = enlaces[a.dataset.enlace];
    if (url) {
      a.href = url;
    } else {
      // Sin enlace (ej. TikTok aún sin confirmar): se oculta el bloque
      (a.closest("[data-solo-si]") ?? a).hidden = true;
    }
  });
}

function rellenarHorario() {
  const el = document.querySelector("[data-negocio-horario]");
  if (!el) return;
  const { confirmado, dias, texto_pendiente } = negocio.horario;

  if (confirmado && dias.length > 0) {
    el.innerHTML = `<ul class="horario__lista">${dias
      .map((d) => `<li><strong>${esc(d.dias)}:</strong> ${esc(d.horas)}</li>`)
      .join("")}</ul>`;
  } else {
    el.innerHTML = `<span class="pastilla pastilla--aviso">${esc(texto_pendiente)}</span>`;
  }
}

function rellenarCalificaciones() {
  const lista = document.querySelector('[data-negocio-lista="calificaciones"]');
  if (!lista) return;
  lista.innerHTML = negocio.calificaciones
    .map(
      (c) =>
        `<li><span aria-hidden="true">⭐</span> ${esc(c.valor.toFixed(1))} en ${esc(c.fuente)} <small>(${esc(c.resenas)} reseñas)</small></li>`,
    )
    .join("");
}

// La promo solo se muestra si negocio.json dice mostrar: true (hoy: no)
function rellenarPromo() {
  const el = document.querySelector("[data-promo]");
  if (el && negocio.promo?.mostrar) {
    el.textContent = `🔥 ${negocio.promo.texto}`;
    el.hidden = false;
  }
}

export function rellenarNegocio() {
  rellenarTextos();
  rellenarEnlaces();
  rellenarHorario();
  rellenarCalificaciones();
  rellenarPromo();
}

// Carga el mapa de Google solo cuando el usuario lo pide:
// el iframe pesa mucho y bajaría la nota de rendimiento.
export function cargarMapa(boton) {
  const contenedor = boton.closest(".mapa");
  contenedor.innerHTML = `<iframe src="${esc(negocio.enlaces.maps_embed)}"
    title="Mapa de ubicación de ${esc(negocio.nombre)}" loading="lazy"
    referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}
