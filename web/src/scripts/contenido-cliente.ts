/**
 * Reemplaza las zonas [data-contenido] con lo publicado en el panel web.
 * Si la API no responde (caída, CORS, desafío de Imunify360), queda el contenido
 * de respaldo que ya viene en el HTML.
 */
import { CLAVE_API, desdeApi, preguntasDe, renderRegion, type Pregunta, type TipoRegion } from '@/lib/contenido';
import { faqSchema } from '@/lib/schema';

const TIMEOUT_MS = 8000;

const base = (import.meta.env.PUBLIC_API_URL ?? '').replace(/\/$/, '');
const regiones = [...document.querySelectorAll<HTMLElement>('[data-contenido]')];
// Muestra las zonas, que el <head> deja ocultas mientras se consulta la API (ver BaseLayout).
const mostrar = () => (document.documentElement.dataset.cargaContenido = 'lista');

/** Deja los datos estructurados de preguntas frecuentes (para Google) iguales a lo que se ve en la página. */
function actualizarSchemaFaq(preguntas: Pregunta[]) {
  let script = document.querySelector<HTMLScriptElement>('script[data-schema="FAQPage"]');
  if (!preguntas.length) return script?.remove();
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.schema = 'FAQPage';
    document.head.append(script);
  }
  script.textContent = JSON.stringify(faqSchema(preguntas.map((p) => ({ q: p.pregunta, a: p.respuesta }))));
}

async function cargar() {
  const control = new AbortController();
  const limite = setTimeout(() => control.abort(), TIMEOUT_MS);
  try {
    const url = new URL(`${base}/web/contenido/`, location.href);
    // GET con cabeceras simples: sin preflight CORS, igual que el formulario de cotización.
    const res = await fetch(url, { headers: { Accept: 'application/json' }, credentials: 'omit', signal: control.signal });
    if (!res.ok) return;
    const datos = await res.json();
    const contenido = desdeApi(datos, url.origin);
    for (const region of regiones) {
      const tipo = region.dataset.contenido as TipoRegion;
      // Un backend anterior no envía todo: esas zonas se quedan con su respaldo.
      if (!(CLAVE_API[tipo] in datos)) continue;
      const { html, total } = renderRegion(tipo, contenido, region.dataset.categoria);
      region.innerHTML = html;
      // El título y el marco de una zona sin elementos no se muestran.
      const bloque = region.closest<HTMLElement>('[data-contenido-bloque]');
      if (bloque) bloque.hidden = total === 0;
      // Si la zona es la pista de un carrusel, vuelve al inicio y actualiza sus flechas.
      region.scrollLeft = 0;
      region.dispatchEvent(new Event('scroll'));
      if (region.dataset.contenido === 'preguntas') actualizarSchemaFaq(preguntasDe(contenido, region.dataset.categoria));
    }
  } catch {
    // Queda el contenido de respaldo.
  } finally {
    clearTimeout(limite);
    mostrar();
  }
}

if (base && regiones.length) cargar();
else mostrar();
