import type { ImageMetadata } from 'astro';
import butaca from '@/assets/img/pyrotect-butaca.jpg';
import cascoCarbono from '@/assets/img/pyrotect-casco-carbono.jpg';
import cascoAbierto from '@/assets/img/pyrotect-casco-abierto.jpg';
import traje from '@/assets/img/pyrotect-traje.jpg';
import celda from '@/assets/img/pyrotect-celda.jpg';
import partes from '@/assets/img/pyrotect-partes.jpg';
import soporteRespaldo from '@/assets/img/pyrotect-soporte-respaldo.jpg';
import rieles from '@/assets/img/pyrotect-rieles.jpg';

export interface CategoriaPyrotect {
  slug: string;
  name: string;
  short: string;
  image: ImageMetadata;
  imageAlt: string;
  /** Líneas de producto dentro de la categoría */
  lineas: string[];
}

/**
 * RESPALDO del catálogo de Pyrotect. La fuente real es el panel web (/web-admin/): esto solo se
 * muestra si la API no responde. El menú de Pyrotect de la cabecera y el pie sí salen de aquí:
 * el `slug` de cada categoría debe ser su nombre en minúsculas y con guiones, que es el ancla
 * que genera la página (/pyrotect/#butacas).
 * No hay carrito ni precios: cada categoría se cotiza por WhatsApp o formulario.
 */
export const CATEGORIAS: CategoriaPyrotect[] = [
  {
    slug: 'butacas',
    name: 'Butacas',
    short: 'Asientos de competición y sus accesorios de montaje.',
    image: butaca,
    imageAlt: 'Butaca de competición Pyrotect Ultra',
    lineas: [
      'Asientos Carrera Ultra',
      'Asientos Elite',
      'Asientos Fibra de Carbono',
      'Asientos Carrera Deportiva',
      'Soportes de respaldo',
      'Correderas y soportes de montaje',
    ],
  },
  {
    slug: 'cascos',
    name: 'Cascos',
    short: 'Cascos abiertos e integrales, repuestos y accesorios de cuidado.',
    image: cascoCarbono,
    imageAlt: 'Casco integral Pyrotect en fibra de carbono',
    lineas: [
      'Casco Juvenil',
      'Casco Ultra Deportivo',
      'Casco Pro Deportivo',
      'Casco de flujo de aire profesional',
      'Partes de cascos',
      'Cuidado de cascos y bolsos',
    ],
  },
  {
    slug: 'trajes',
    name: 'Trajes',
    short: 'Trajes ignífugos de una y dos piezas, para adultos y juveniles.',
    image: traje,
    imageAlt: 'Traje de piloto Pyrotect Pro One FIA rojo',
    lineas: ['Trajes FIA', 'Trajes SFI-1', 'Trajes SFI-5', 'Trajes Junior'],
  },
  {
    slug: 'celdas-de-combustible',
    name: 'Celdas de combustible',
    short: 'Celdas de seguridad para UTV, todo terreno y turismo.',
    image: celda,
    imageAlt: 'Celda de combustible Pyrotect para UTV Can-Am Maverick X3',
    lineas: ['Celdas UTV', 'Celdas Todo Terreno', 'Celdas Especiales', 'PyroCell Elite', 'PyroCell Turismo'],
  },
  {
    slug: 'partes-de-celdas',
    name: 'Partes de celdas',
    short: 'Repuestos y componentes para celdas de combustible.',
    image: partes,
    imageAlt: 'Tapa de llenado ventilada para celda de combustible',
    lineas: ['Tapas', 'Platos', 'Válvulas', 'Fittings', 'Calibres', 'Recarga rápida (refueling)'],
  },
];

export interface DestacadoPyrotect {
  name: string;
  category: string;
  image: ImageMetadata;
}

export const DESTACADOS: DestacadoPyrotect[] = [
  { name: 'Asiento Carrera Ultra', category: 'Butacas', image: butaca },
  { name: 'Casco abierto SA2020 Pro Sport', category: 'Cascos', image: cascoAbierto },
  { name: 'Soporte de respaldo Pro-Series', category: 'Butacas', image: soporteRespaldo },
  { name: 'Rieles deslizantes para asiento', category: 'Butacas', image: rieles },
];
