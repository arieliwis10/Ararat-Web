import type { ImageMetadata } from 'astro';
import pyrotect1 from '@/assets/img/banner-pyrotect-1.jpg';
import pyrotect2 from '@/assets/img/banner-pyrotect-2.jpg';
import pyrotect3 from '@/assets/img/banner-pyrotect-3.jpg';
import pyrotect4 from '@/assets/img/banner-pyrotect-4.jpg';
import pyrotect5 from '@/assets/img/banner-pyrotect-5.jpg';
import pyrotect6 from '@/assets/img/banner-pyrotect-6.jpg';

export interface Banner {
  image: ImageMetadata;
  /** El texto va dentro de la imagen: el alt debe repetirlo. */
  alt: string;
  href?: string;
}

/** Banners de la web anterior (2560×854). Para cambiarlos, reemplaza el archivo en assets/img. */
export const BANNERS_PYROTECT: Banner[] = [
  { image: pyrotect1, alt: 'Pyrotect: butacas de competición para UTV', href: '/pyrotect/#butacas' },
  { image: pyrotect2, alt: 'Pyrotect: cascos de competición', href: '/pyrotect/#cascos' },
  { image: pyrotect3, alt: 'Pyrotect: trajes de piloto', href: '/pyrotect/#trajes' },
  { image: pyrotect4, alt: 'Pyrotect: celdas de combustible de aluminio', href: '/pyrotect/#celdas-de-combustible' },
  { image: pyrotect5, alt: 'Pyrotect: celda de combustible PyroCell Baja', href: '/pyrotect/#celdas-de-combustible' },
  { image: pyrotect6, alt: 'Pyrotect: celdas de combustible para UTV', href: '/pyrotect/#celdas-de-combustible' },
];
