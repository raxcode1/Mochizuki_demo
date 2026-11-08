// carrito-ui.js — Muestra el carrito en pantalla (diálogo, contador, barra).
// La lógica (sumar, guardar) está en carrito.js; aquí solo se pinta y se
// reacciona a los clics de los botones del carrito.

import negocio from "../data/negocio.json";
import * as carrito from "./carrito.js";
import { mensajePedido, enlaceWhatsApp, whatsappVerificado } from "./whatsapp.js";
import { formatoRD, escaparHTML as esc } from "./formato.js";

const BASE = import.meta.env.BASE_URL;

export function iniciarCarritoUI() {
  const dialogo = document.getElementById("carrito");
  const cuerpo = dialogo.querySelector('[data-carrito="cuerpo"]');
  const pie = dialogo.querySelector('[data-carrito="pie"]');

  // El pie se pinta UNA vez (así no se borra lo que escribes en los campos)
  pie.innerHTML = `
    <p class="carrito__total"><span>Total</span><span data-carrito="total"></span></p>
    <button type="button" class="boton boton--whatsapp boton--ancho" data-carrito="whatsapp">
      Pedir por WhatsApp
    </button>
    <a class="boton boton--secundario boton--chico boton--ancho" href="${esc(negocio.enlaces.ubereats)}" target="_blank" rel="noopener">
      O pide por Uber Eats
    </a>
    <p class="nota-pequena">
      <strong>Precios de referencia.</strong> ${esc(negocio.nota_precios)}
      Sojus (+18) solo en tienda.
      ${whatsappVerificado() ? "" : "⚠️ Demo: número de WhatsApp por verificar."}
    </p>`;

  const botonWhatsApp = pie.querySelector('[data-carrito="whatsapp"]');

  // ---------- Pintado del cuerpo (lista de productos) ----------
  function pintarVacio() {
    cuerpo.innerHTML = `
      <div class="carrito__vacio">
        <img src="${BASE}img/placeholders/mochi.svg" alt="" width="96" height="96" />
        <p><strong>Tu pedido está vacío.</strong><br />¡Ve al menú y antójate! 🍩</p>
        <a class="boton boton--primario" href="#menu" data-accion="cerrar-dialogo">Ver el menú</a>
      </div>`;
  }

  function pintarLinea(l) {
    const nombre = esc(l.nombre);
    return `
      <li class="linea">
        <div>
          <div class="linea__nombre">${nombre}</div>
          ${
            l.detalle.length
              ? `<ul class="linea__detalle">${l.detalle
                  .map((d) => `<li>${esc(d.etiqueta)}: ${esc(d.texto)}</li>`)
                  .join("")}</ul>`
              : ""
          }
          <div class="nota-pequena">${formatoRD(l.precioUnitario)} c/u</div>
        </div>
        <div class="linea__subtotal">${formatoRD(l.subtotal)}</div>
        <div class="linea__acciones">
          <div class="cantidad">
            <button type="button" class="boton-icono" data-carrito-accion="menos" data-clave="${esc(l.clave)}"
              aria-label="Quitar uno de ${nombre}">−</button>
            <span class="cantidad__valor" aria-label="Cantidad">${l.cantidad}</span>
            <button type="button" class="boton-icono" data-carrito-accion="mas" data-clave="${esc(l.clave)}"
              aria-label="Agregar uno de ${nombre}" ${l.cantidad >= l.maximo ? "disabled" : ""}>+</button>
          </div>
          <button type="button" class="linea__quitar" data-carrito-accion="quitar" data-clave="${esc(l.clave)}"
            aria-label="Eliminar ${nombre} del pedido">Eliminar</button>
        </div>
      </li>`;
  }

  function pintarCuerpo() {
    const lineas = carrito.obtenerLineas();
    if (lineas.length === 0) {
      pintarVacio();
    } else {
      cuerpo.innerHTML = `
        <ul class="carrito__lista">${lineas.map(pintarLinea).join("")}</ul>
        <div class="campos">
          <label class="campo">Tu nombre
            <input type="text" name="nombre" autocomplete="given-name" data-cliente="nombre" />
          </label>
          <label class="campo">Hora para recoger
            <input type="time" name="hora" data-cliente="hora" />
          </label>
        </div>
        <button type="button" class="linea__quitar" data-carrito-accion="vaciar">Vaciar pedido</button>`;
      // Restaurar lo que el cliente ya había escrito
      cuerpo.querySelector('[data-cliente="nombre"]').value = cliente.nombre;
      cuerpo.querySelector('[data-cliente="hora"]').value = cliente.hora;
    }
  }

  // Datos del cliente (en memoria, se sobreviven a los repintados)
  const cliente = { nombre: "", hora: "" };
  cuerpo.addEventListener("input", (e) => {
    const campo = e.target.dataset.cliente;
    if (campo) cliente[campo] = e.target.value;
  });

  // ---------- Contador de la cabecera y barra "Ver pedido" ----------
  function pintarResumen() {
    const cantidad = carrito.cantidadTotal();
    const total = formatoRD(carrito.total());

    document.querySelectorAll('[data-carrito="contador"], [data-carrito="cantidad"]').forEach((el) => {
      el.textContent = cantidad;
    });
    document.querySelectorAll('[data-carrito="total-barra"]').forEach((el) => (el.textContent = total));
    document.querySelectorAll('[data-carrito="barra"]').forEach((el) => (el.hidden = cantidad === 0));
    document.querySelectorAll('[data-accion="abrir-carrito"]').forEach((el) => {
      el.setAttribute("aria-label", `Ver tu pedido: ${cantidad} producto${cantidad === 1 ? "" : "s"}, ${total}`);
    });

    pie.querySelector('[data-carrito="total"]').textContent = total;
    botonWhatsApp.disabled = cantidad === 0; // carrito vacío = WhatsApp deshabilitado
  }

  function pintarTodo() {
    pintarCuerpo();
    pintarResumen();
  }

  // ---------- Clics dentro del carrito ----------
  cuerpo.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-carrito-accion]");
    if (!boton) return;
    const { carritoAccion, clave } = boton.dataset;
    if (carritoAccion === "mas") carrito.cambiarCantidad(clave, +1);
    if (carritoAccion === "menos") carrito.cambiarCantidad(clave, -1);
    if (carritoAccion === "quitar") carrito.quitar(clave);
    if (carritoAccion === "vaciar" && confirm("¿Vaciar todo el pedido?")) carrito.vaciar();

    // Tras repintar, devolver el foco a un botón equivalente (teclado / lector de pantalla)
    const mismo = cuerpo.querySelector(
      `[data-carrito-accion="${carritoAccion}"][data-clave="${CSS.escape(clave ?? "")}"]`,
    );
    (mismo && !mismo.disabled ? mismo : dialogo.querySelector("h2")).focus?.();
  });

  botonWhatsApp.addEventListener("click", () => {
    const lineas = carrito.obtenerLineas();
    if (lineas.length === 0) return;
    const texto = mensajePedido(lineas, carrito.total(), cliente);
    window.open(enlaceWhatsApp(texto), "_blank", "noopener");
  });

  carrito.suscribir(pintarTodo);
  pintarTodo();

  return {
    abrir() {
      pintarCuerpo();
      dialogo.showModal();
    },
  };
}
