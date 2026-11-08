// whatsapp.js — Construye el texto del pedido y el enlace wa.me.
// El número sale de negocio.json (whatsapp.numero, AÚN SIN VERIFICAR).

import negocio from "../data/negocio.json";
import { formatoRD } from "./formato.js";

// Texto del pedido. Ejemplo:
//   ¡Hola, Mochizuki! 🧡 Quiero hacer este pedido:
//
//   • 2 x K-Corn Dog Papa: RD$1,000
//      - Relleno: Mozzarella (+RD$75)
//      - Salsas: Ketchup, BBQ (1 adicional +RD$50)
//
//   Total: RD$1,000
export function mensajePedido(lineas, totalPedido, { nombre = "", hora = "" } = {}) {
  const texto = ["¡Hola, Mochizuki! 🧡 Quiero hacer este pedido:", ""];

  for (const linea of lineas) {
    texto.push(`• ${linea.cantidad} x ${linea.nombre}: ${formatoRD(linea.subtotal)}`);
    for (const opcion of linea.detalle) {
      texto.push(`   - ${opcion.etiqueta}: ${opcion.texto}`);
    }
  }

  texto.push(
    "",
    `Total: ${formatoRD(totalPedido)}`,
    "(Precios de referencia de la web; confírmenme el total, por favor.)",
    "",
    `Nombre: ${nombre.trim()}`,
    `Para recoger a las: ${hora.trim()}`,
  );

  // "\n" = salto de línea; encodeURIComponent lo convierte en %0A
  return texto.join("\n");
}

// encodeURIComponent codifica acentos, emojis y saltos de línea para la URL
export function enlaceWhatsApp(texto) {
  return `https://wa.me/${negocio.whatsapp.numero}?text=${encodeURIComponent(texto)}`;
}

export const whatsappVerificado = () => negocio.whatsapp.verificado === true;
