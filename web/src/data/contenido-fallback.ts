/** Convierte el respaldo (data/trabajos.ts, kairos.ts, pyrotect.ts y las faq de servicios.ts) al formato de lib/contenido.ts. */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { rotuloTrabajo, type Contenido, type Foto } from '@/lib/contenido';
import { SERVICIOS, categoriaTitle } from '@/data/servicios';
import { EQUIPOS } from '@/data/kairos';
import { CATEGORIAS, DESTACADOS } from '@/data/pyrotect';
import { TRABAJOS } from '@/data/trabajos';
import { ACTIVIDADES } from '@/data/comunidad';

// Mismos tamaños que genera el backend al subir una foto.
const ANCHO_FOTO = 1600;
const ANCHO_MINIATURA = 800;

async function foto({ image, alt }: { image: ImageMetadata; alt: string }): Promise<Foto> {
  const version = (ancho: number) => getImage({ src: image, width: Math.min(ancho, image.width), format: 'webp' });
  const [grande, mini] = await Promise.all([version(ANCHO_FOTO), version(ANCHO_MINIATURA)]);
  return { src: grande.src, mini: mini.src, alt };
}

const fotos = (lista: { image: ImageMetadata; alt: string }[]) => Promise.all(lista.map(foto));

let cache: Promise<Contenido> | undefined;

/** Contenido de respaldo, ya con las URLs de sus imágenes optimizadas. */
export function contenidoLocal(): Promise<Contenido> {
  cache ??= (async () => ({
    trabajos: await Promise.all(
      TRABAJOS.map(async (t, i) => ({
        id: `local-${i}`,
        titulo: t.titulo,
        categoria: t.categoria,
        categoriaNombre: rotuloTrabajo(t.categoria, categoriaTitle(t.categoria) ?? ''),
        resumen: t.resumen,
        descripcion: t.descripcion ?? '',
        destacado: t.destacado ?? false,
        fotos: await fotos(t.fotos),
        video: t.video ?? null,
      })),
    ),
    equipos: await Promise.all(
      EQUIPOS.map(async (e, i) => ({
        id: `local-${i}`,
        nombre: e.nombre,
        categoria: e.categoria,
        detalle: e.detalle,
        precioDia: e.precioDia,
        unidades: e.unidades,
        fotos: await fotos(e.fotos),
      })),
    ),
    pyrotect: {
      categorias: await Promise.all(
        CATEGORIAS.map(async (c) => ({
          id: `local-${c.slug}`,
          nombre: c.name,
          descripcion: c.short,
          lineas: c.lineas,
          fotos: await fotos([{ image: c.image, alt: c.imageAlt }]),
        })),
      ),
      productos: await Promise.all(
        DESTACADOS.map(async (p, i) => ({
          id: `local-${i}`,
          nombre: p.name,
          categoria: p.category,
          fotos: await fotos([{ image: p.image, alt: p.name }]),
        })),
      ),
    },
    comunidad: await Promise.all(
      ACTIVIDADES.map(async (a, i) => ({
        id: `local-${i}`,
        titulo: a.titulo,
        eje: a.eje,
        resumen: a.resumen,
        descripcion: a.descripcion ?? '',
        fecha: a.fecha ?? null,
        fotos: await fotos(a.fotos),
      })),
    ),
    preguntas: SERVICIOS.flatMap((s) =>
      s.faq.map((f, i) => ({ id: `local-${s.slug}-${i}`, seccion: s.slug, pregunta: f.q, respuesta: f.a })),
    ),
  }))();
  return cache;
}
