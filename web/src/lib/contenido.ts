/**
 * Contenido administrable (trabajos, equipos, catálogo de Pyrotect y preguntas frecuentes) y su HTML.
 *
 * Estas funciones corren en dos lugares con el mismo resultado:
 * - en el build, con el contenido de respaldo de src/data (lo que se ve si la API no responde);
 * - en el navegador, con lo que entrega el panel web (GET {PUBLIC_API_URL}/web/contenido/).
 * Por eso devuelven texto HTML y no dependen de Astro ni de imágenes importadas.
 */
import { slugify } from '@/lib/slug';
import { waLink } from '@/lib/whatsapp';

export interface Foto {
  /** Foto grande, para el visor (o el archivo, si es un video) */
  src: string;
  /** Miniatura, para tarjetas y galerías (vacía en los videos) */
  mini: string;
  alt: string;
  /** El elemento es un video: el visor lo reproduce en vez de mostrar una imagen */
  video?: boolean;
}

export interface Trabajo {
  id: string | number;
  titulo: string;
  /** slug de un servicio de data/servicios.ts o 'fabricacion' */
  categoria: string;
  categoriaNombre: string;
  resumen: string;
  descripcion: string;
  destacado: boolean;
  /** La primera es la portada */
  fotos: Foto[];
  /** Video del trabajo (MP4): va en la galería después de las fotos */
  video: string | null;
}

/** Rótulo de la tarjeta: los proyectos de fabricación se presentan como "Proyecto especial". */
export const rotuloTrabajo = (categoria: string, nombre: string) => (categoria === 'fabricacion' ? 'Proyecto especial' : nombre);

export interface Equipo {
  id: string | number;
  nombre: string;
  categoria: string;
  detalle: string;
  /** Precios netos (sin IVA) en CLP; sin ninguno se muestra "Consultar" */
  precioDia: number | null;
  precioSemana: number | null;
  precioMes: number | null;
  unidades: number;
  /** La primera es la portada; el resto forma la galería */
  fotos: Foto[];
}

export interface Pregunta {
  id: string | number;
  /** Página donde se muestra: slug de un servicio, 'kairos' o 'pyrotect' */
  seccion: string;
  pregunta: string;
  respuesta: string;
}

export interface CategoriaPyrotect {
  id: string | number;
  nombre: string;
  descripcion: string;
  /** Líneas de producto: se muestran como etiquetas */
  lineas: string[];
  /** La primera es la foto de la categoría */
  fotos: Foto[];
}

export interface ProductoPyrotect {
  id: string | number;
  nombre: string;
  /** Nombre de su categoría */
  categoria: string;
  fotos: Foto[];
}

export interface Contenido {
  trabajos: Trabajo[];
  equipos: Equipo[];
  pyrotect: { categorias: CategoriaPyrotect[]; productos: ProductoPyrotect[] };
  comunidad: Actividad[];
  preguntas: Pregunta[];
}

/** Actividad de responsabilidad social (página /responsabilidad-social/). */
export interface Actividad {
  id: string | number;
  titulo: string;
  /** Uno de los ejes de EJES_COMUNIDAD */
  eje: string;
  resumen: string;
  descripcion: string;
  /** AAAA-MM-DD, opcional */
  fecha: string | null;
  fotos: Foto[];
}

export const EJES_COMUNIDAD: Record<string, string> = {
  deporte: 'Deporte',
  seguridad: 'Seguridad y bienestar',
  educacion: 'Educación y tecnología',
  ambiente: 'Medio ambiente',
  laboral: 'Trabajo seguro y cumplimiento',
};

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/**
 * Diapositiva de la portada: la foto de un eje con su nombre. Van todas apiladas y el script de la
 * portada muestra una a la vez (data-activa); la primera parte visible.
 */
function diapositivaComunidad(a: Actividad, i: number): string {
  const foto = a.fotos[0];
  return `<a href="/responsabilidad-social/#${esc(a.eje)}" class="absolute inset-0 opacity-0 transition-opacity duration-700 data-[activa]:opacity-100" data-diapo${i === 0 ? ' data-activa' : ''}>
    <img src="${esc(foto.src)}" alt="${esc(foto.alt)}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async" class="size-full object-cover object-[50%_20%]" />
    <span class="absolute bottom-4 left-4 right-4 rounded-md bg-acero-950/80 px-4 py-2 text-white">
      <span class="block font-display text-sm font-semibold uppercase tracking-[0.2em] text-cian-400">${esc(EJES_COMUNIDAD[a.eje] ?? '')}</span>
      <span class="block font-display text-xl font-bold uppercase tracking-wide">${esc(a.titulo)}</span>
    </span>
  </a>`;
}

/** Una actividad se muestra con la misma tarjeta (y visor) que un trabajo. */
function comoTrabajo(a: Actividad): Trabajo {
  const [anio, mes] = (a.fecha ?? '').split('-');
  const fecha = anio && mes ? `${MESES[Number(mes) - 1]} ${anio}` : '';
  return {
    id: a.id,
    titulo: a.titulo,
    categoria: a.eje,
    categoriaNombre: fecha || EJES_COMUNIDAD[a.eje] || '',
    resumen: a.resumen,
    descripcion: a.descripcion,
    destacado: false,
    fotos: a.fotos,
    video: null,
  };
}

export type TipoRegion =
  | 'trabajos-tarjetas'
  | 'trabajos-destacados'
  | 'equipos-catalogo'
  | 'pyrotect-categorias'
  | 'pyrotect-productos'
  | 'comunidad'
  | 'comunidad-diapos'
  | 'preguntas';

/** Clave de la respuesta de la API de la que sale cada zona (si la API no la trae, la zona conserva su respaldo). */
export const CLAVE_API: Record<TipoRegion, string> = {
  'trabajos-tarjetas': 'trabajos',
  'trabajos-destacados': 'trabajos',
  'equipos-catalogo': 'equipos',
  'pyrotect-categorias': 'pyrotect',
  'pyrotect-productos': 'pyrotect',
  comunidad: 'comunidad',
  'comunidad-diapos': 'comunidad',
  preguntas: 'preguntas',
};

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (valor: unknown) => String(valor ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);

const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

/** Precios del arriendo (día, semana y mes) con la nota de IVA; sin precios, "Consultar". */
function preciosEquipo(e: Equipo): string {
  const precios = (
    [
      ['Día', e.precioDia],
      ['Semana', e.precioSemana],
      ['Mes', e.precioMes],
    ] as const
  ).filter(([, valor]) => valor != null);
  if (!precios.length) return '<p class="mt-2 font-display text-xl font-bold">Consultar</p>';
  const celdas = precios.map(
    ([plazo, valor]) => `<div class="rounded-md bg-white/5 px-2 py-2 ring-1 ring-white/10">
      <dt class="text-xs font-semibold uppercase tracking-wide text-acero-300">${plazo}</dt>
      <dd class="font-display text-lg font-bold leading-tight">${clp.format(valor as number)}</dd>
    </div>`,
  );
  return `<dl class="mt-3 grid grid-cols-3 gap-2 text-center">${celdas.join('')}</dl>
      <p class="mt-1.5 text-xs text-acero-300">Valores netos</p>`;
}

/** Atributos que lee components/Visor.astro para abrir estas fotos en grande. */
const grupoVisor = (titulo: string, texto: string, fotos: Foto[]) =>
  ` data-visor-titulo="${esc(titulo)}" data-visor-texto="${esc(texto)}" data-visor-fotos="${esc(
    JSON.stringify(fotos.map(({ src, alt, video }) => ({ src, alt, ...(video && { video }) }))),
  )}"`;

const ICONO_PLAY = `<span class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
  <span class="flex size-14 items-center justify-center rounded-full bg-acero-950/70 text-white ring-2 ring-white/70">
    <svg viewBox="0 0 24 24" class="ml-1 size-7" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
  </span>
</span>`;

/** Fotos del trabajo y, al final, su video (si tiene). */
function galeriaTrabajo(t: Trabajo): Foto[] {
  return t.video ? [...t.fotos, { src: t.video, mini: '', alt: `Video: ${t.titulo}`, video: true }] : t.fotos;
}

/** "Ver proyecto (3 fotos y 1 video)", "Ver foto"… */
function textoGaleria(t: Trabajo): string {
  const fotos = t.fotos.length === 1 ? '1 foto' : `${t.fotos.length} fotos`;
  if (t.video) return `Ver proyecto (${fotos} y 1 video)`;
  return t.fotos.length > 1 ? `Ver proyecto (${fotos})` : 'Ver foto';
}

function miniaturas(fotos: Foto[]): string {
  const items = fotos.map((f, i) => {
    // El video muestra su primer cuadro (#t=0.1 hace que Safari también lo pinte).
    const vista = f.video
      ? `<video src="${esc(f.src)}#t=0.1" muted playsinline preload="metadata" aria-hidden="true" class="aspect-square w-full bg-black object-cover"></video>${ICONO_PLAY}`
      : `<img src="${esc(f.mini)}" alt="${esc(f.alt)}" loading="lazy" decoding="async" class="aspect-square w-full object-cover transition duration-300 group-hover:scale-105" />`;
    return `<li>
      <a href="${esc(f.src)}" class="group relative block overflow-hidden rounded-lg ring-1 ring-white/10" data-visor data-visor-indice="${i}"${f.video ? ` aria-label="${esc(f.alt)}"` : ''}>
        ${vista}
      </a>
    </li>`;
  });
  return `<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">${items.join('')}</ul>`;
}

/** Tarjeta de un trabajo: al tocarla se abren sus fotos en el visor. */
export function tarjetaTrabajo(t: Trabajo): string {
  const portada = t.fotos[0];
  return `<a href="${esc(portada.src)}" class="group block h-full transition hover:-translate-y-0.5" data-visor${grupoVisor(t.titulo, t.descripcion || t.resumen, galeriaTrabajo(t))}>
    <figure class="h-full overflow-hidden rounded-lg bg-white ring-1 ring-acero-100">
      <img src="${esc(portada.mini)}" alt="${esc(portada.alt)}" loading="lazy" decoding="async" class="aspect-[3/2] w-full object-cover object-[50%_25%]" />
      <figcaption class="p-4">
        <p class="eyebrow">${esc(t.categoriaNombre)}</p>
        <h3 class="mt-1 text-xl text-acero-900">${esc(t.titulo)}</h3>
        <p class="mt-1 text-sm text-acero-700">${esc(t.resumen)}</p>
        <p class="mt-3 font-display font-semibold uppercase tracking-wide text-cian-600 group-hover:text-cian-500">${textoGaleria(t)} →</p>
      </figcaption>
    </figure>
  </a>`;
}

/** Bloque grande de un trabajo destacado, con su descripción y su galería. */
function seccionDestacado(t: Trabajo): string {
  return `<section class="section border-t border-white/10 bg-acero-950 text-white"${grupoVisor(t.titulo, t.descripcion || t.resumen, galeriaTrabajo(t))}>
    <div class="container-x">
      <p class="eyebrow">${esc(t.categoriaNombre)}</p>
      <h2 class="mt-2 text-4xl sm:text-5xl">${esc(t.titulo)}</h2>
      <p class="mt-4 max-w-2xl whitespace-pre-line text-lg text-acero-300">${esc(t.descripcion || t.resumen)}</p>
      <p class="mt-6 text-sm text-acero-300">Toca una foto para verla en grande.</p>
      <div class="mt-3">${miniaturas(galeriaTrabajo(t))}</div>
    </div>
  </section>`;
}

const idGaleria = (e: Equipo) => `galeria-${slugify(e.nombre)}`;

function tarjetaEquipo(e: Equipo): string {
  const galeria = e.fotos.length - 1;
  const wa = waLink(`Hola, quiero consultar disponibilidad y precio del arriendo de: ${e.nombre}.`);
  const form = `/contacto/?servicio=arriendo&equipo=${encodeURIComponent(e.nombre)}`;
  const unidades =
    e.unidades > 0
      ? `<p class="mt-3 flex items-center gap-2 text-sm font-semibold text-kairos-400">
          <span class="size-2 rounded-full bg-kairos-400" aria-hidden="true"></span>
          ${e.unidades} ${e.unidades === 1 ? 'unidad disponible' : 'unidades disponibles'}
        </p>`
      : `<p class="mt-3 text-sm font-semibold text-acero-300">Sin unidades disponibles por ahora</p>`;
  return `<article class="flex h-full flex-col overflow-hidden rounded-lg bg-acero-900 text-white ring-1 ring-white/10">
    <img src="${esc(e.fotos[0].mini)}" alt="${esc(e.fotos[0].alt)}" loading="lazy" decoding="async" class="aspect-square w-full object-cover" />
    <div class="flex flex-1 flex-col p-5">
      <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-kairos-400">${esc(e.categoria)}</p>
      <h3 class="mt-1 text-2xl">${esc(e.nombre)}</h3>
      ${e.detalle ? `<p class="mt-1 text-sm text-acero-300">${esc(e.detalle)}</p>` : ''}
      ${unidades}
      ${preciosEquipo(e)}
      ${
        galeria > 0
          ? `<a href="#${idGaleria(e)}" class="mt-2 font-display font-semibold uppercase tracking-wide text-kairos-400 hover:text-white">Ver galería (${galeria} ${galeria === 1 ? 'foto' : 'fotos'}) →</a>`
          : ''
      }
      <div class="mt-auto flex gap-2 pt-4">
        <a href="${esc(wa)}" target="_blank" rel="noopener" class="btn-whatsapp min-h-11 flex-1 px-3 text-base">Disponibilidad</a>
        <a href="${esc(form)}" class="btn-ghost min-h-11 px-3 text-base">Cotizar</a>
      </div>
    </div>
  </article>`;
}

/** Catálogo de Kairos: equipos agrupados por categoría y, debajo, la galería de cada uno. */
function catalogoEquipos(equipos: Equipo[]): string {
  const categorias = [...new Set(equipos.map((e) => e.categoria))];
  const grupos = categorias.map(
    (cat) => `<div id="${slugify(cat)}" class="mt-10 scroll-mt-20">
      <h3 class="text-2xl text-kairos-400">${esc(cat)}</h3>
      <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${equipos.filter((e) => e.categoria === cat).map(tarjetaEquipo).join('')}
      </div>
    </div>`,
  );
  const galerias = equipos
    .filter((e) => e.fotos.length > 1)
    .map((e) => {
      const fotos = e.fotos.slice(1);
      return `<div id="${idGaleria(e)}" class="mt-14 scroll-mt-20"${grupoVisor(e.nombre, e.detalle, fotos)}>
        <h3 class="text-2xl text-kairos-400">Galería: ${esc(e.nombre)}</h3>
        <p class="mt-1 text-sm text-acero-300">Toca una foto para verla en grande.</p>
        <div class="mt-4">${miniaturas(fotos)}</div>
      </div>`;
    });
  return grupos.join('') + galerias.join('');
}

const waPyrotect = (nombre: string) => waLink(`Hola, quiero cotizar productos Pyrotect: ${nombre}.`);

/** Foto de producto sobre blanco; si hay más de una, al tocarla se abren en el visor. */
function fotoPyrotect(fotos: Foto[], margen: string): string {
  const img = `<img src="${esc(fotos[0].mini)}" alt="${esc(fotos[0].alt)}" loading="lazy" decoding="async" class="aspect-square w-full bg-white object-contain ${margen}" />`;
  return fotos.length > 1 ? `<a href="${esc(fotos[0].src)}" class="block" data-visor>${img}</a>` : img;
}

/** Categoría del catálogo de Pyrotect: foto, líneas de producto y botones para cotizar. */
function categoriaPyrotect(c: CategoriaPyrotect): string {
  const lineas = c.lineas.map(
    (l) => `<li class="rounded-md bg-acero-50 px-3 py-1.5 text-sm text-acero-900 ring-1 ring-acero-100">${esc(l)}</li>`,
  );
  const form = `/contacto/?servicio=pyrotect&producto=${encodeURIComponent(c.nombre)}`;
  return `<article id="${slugify(c.nombre)}" class="grid scroll-mt-20 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-acero-100 sm:grid-cols-[16rem_1fr]"${grupoVisor(c.nombre, c.descripcion, c.fotos)}>
    ${fotoPyrotect(c.fotos, 'p-4')}
    <div class="flex flex-col border-t border-acero-100 p-6 sm:border-l sm:border-t-0">
      <h3 class="text-3xl text-acero-900">${esc(c.nombre)}</h3>
      ${c.descripcion ? `<p class="mt-2 text-acero-700">${esc(c.descripcion)}</p>` : ''}
      ${lineas.length ? `<ul class="mt-4 flex flex-wrap gap-2">${lineas.join('')}</ul>` : ''}
      <div class="mt-auto flex flex-col gap-2 pt-6 sm:flex-row">
        <a href="${esc(waPyrotect(c.nombre))}" target="_blank" rel="noopener" class="btn-whatsapp min-h-11 px-4 text-base">Cotizar por WhatsApp</a>
        <a href="${esc(form)}" class="btn min-h-11 border border-acero-300 px-4 text-base text-acero-900 hover:bg-acero-100">Formulario</a>
      </div>
    </div>
  </article>`;
}

/** Tarjeta de un producto destacado de Pyrotect. */
function productoPyrotect(p: ProductoPyrotect): string {
  return `<div class="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-acero-100"${grupoVisor(p.nombre, p.categoria, p.fotos)}>
    ${fotoPyrotect(p.fotos, 'p-3')}
    <div class="flex flex-1 flex-col border-t border-acero-100 p-4">
      <p class="font-display text-sm font-semibold uppercase tracking-[0.2em] text-pyro-600">${esc(p.categoria)}</p>
      <h3 class="mt-1 flex-1 text-xl text-acero-900">${esc(p.nombre)}</h3>
      <a href="${esc(waPyrotect(p.nombre))}" target="_blank" rel="noopener" class="btn-whatsapp mt-4 min-h-11 px-3 text-base">Cotizar</a>
    </div>
  </div>`;
}

/** Una pregunta frecuente: se despliega al tocarla (<details>, sin JS). */
function itemPregunta(p: Pregunta): string {
  return `<details class="group py-4">
    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
      ${esc(p.pregunta)}
      <span class="text-cian-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
    </summary>
    <p class="mt-3 whitespace-pre-line text-acero-700">${esc(p.respuesta)}</p>
  </details>`;
}

/** Preguntas frecuentes de una página (`seccion`: slug de un servicio, 'kairos' o 'pyrotect'). */
export const preguntasDe = (contenido: Contenido, seccion?: string) => contenido.preguntas.filter((p) => p.seccion === seccion);

/**
 * HTML de una zona de la página y cuántos elementos tiene (0 = su bloque se oculta).
 * `categoria` filtra los trabajos por categoría y las preguntas por página.
 */
export function renderRegion(tipo: TipoRegion, contenido: Contenido, categoria?: string): { html: string; total: number } {
  if (tipo === 'comunidad-diapos') {
    // Una diapositiva por eje (la primera actividad publicada de cada uno), en el orden de EJES_COMUNIDAD.
    const portadas = Object.keys(EJES_COMUNIDAD)
      .map((eje) => contenido.comunidad.find((a) => a.eje === eje))
      .filter((a): a is Actividad => Boolean(a));
    return { html: portadas.map(diapositivaComunidad).join(''), total: portadas.length };
  }
  if (tipo === 'comunidad') {
    const actividades = contenido.comunidad.filter((a) => !categoria || a.eje === categoria);
    return { html: actividades.map((a) => tarjetaTrabajo(comoTrabajo(a))).join(''), total: actividades.length };
  }
  if (tipo === 'preguntas') {
    const preguntas = preguntasDe(contenido, categoria);
    return { html: preguntas.map(itemPregunta).join(''), total: preguntas.length };
  }
  if (tipo === 'pyrotect-categorias') {
    const { categorias } = contenido.pyrotect;
    return { html: categorias.map(categoriaPyrotect).join(''), total: categorias.length };
  }
  if (tipo === 'pyrotect-productos') {
    const { productos } = contenido.pyrotect;
    return { html: productos.map(productoPyrotect).join(''), total: productos.length };
  }
  if (tipo === 'equipos-catalogo') {
    return { html: catalogoEquipos(contenido.equipos), total: contenido.equipos.length };
  }
  if (tipo === 'trabajos-destacados') {
    const destacados = contenido.trabajos.filter((t) => t.destacado);
    return { html: destacados.map(seccionDestacado).join(''), total: destacados.length };
  }
  const trabajos = categoria ? contenido.trabajos.filter((t) => t.categoria === categoria) : contenido.trabajos;
  // Cada tarjeta va en un <div>: así sirve igual como celda de grilla y como diapositiva del carrusel.
  return { html: trabajos.map((t) => `<div>${tarjetaTrabajo(t)}</div>`).join(''), total: trabajos.length };
}

interface FotoApi {
  src: string;
  mini: string;
  alt: string;
}

/** Convierte la respuesta de la API. Las fotos llegan como rutas del servidor: `origen` es el de la API. */
export function desdeApi(datos: any, origen: string): Contenido {
  const fotos = (lista: FotoApi[]): Foto[] =>
    lista.map((f) => ({ src: new URL(f.src, origen).href, mini: new URL(f.mini, origen).href, alt: f.alt }));
  return {
    trabajos: datos.trabajos.map((t: any) => ({
      id: t.id,
      titulo: t.titulo,
      categoria: t.categoria,
      categoriaNombre: rotuloTrabajo(t.categoria, t.categoria_nombre),
      resumen: t.resumen,
      descripcion: t.descripcion,
      destacado: t.destacado,
      fotos: fotos(t.fotos),
      video: t.video ? new URL(t.video, origen).href : null,
    })),
    equipos: datos.equipos.map((e: any) => ({
      id: e.id,
      nombre: e.nombre,
      categoria: e.categoria,
      detalle: e.detalle,
      precioDia: e.precio_dia,
      precioSemana: e.precio_semana ?? null,
      precioMes: e.precio_mes ?? null,
      unidades: e.unidades,
      fotos: fotos(e.fotos),
    })),
    // Pyrotect y las preguntas son opcionales: un backend anterior no los envía (ver CLAVE_API).
    pyrotect: {
      categorias: (datos.pyrotect?.categorias ?? []).map((c: any) => ({
        id: c.id,
        nombre: c.nombre,
        descripcion: c.descripcion,
        lineas: c.lineas,
        fotos: fotos(c.fotos),
      })),
      productos: (datos.pyrotect?.productos ?? []).map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        fotos: fotos(p.fotos),
      })),
    },
    comunidad: (datos.comunidad ?? []).map((a: any) => ({
      id: a.id,
      titulo: a.titulo,
      eje: a.eje,
      resumen: a.resumen,
      descripcion: a.descripcion,
      fecha: a.fecha,
      fotos: fotos(a.fotos),
    })),
    preguntas: (datos.preguntas ?? []).map((p: any) => ({
      id: p.id,
      seccion: p.seccion,
      pregunta: p.pregunta,
      respuesta: p.respuesta,
    })),
  };
}
