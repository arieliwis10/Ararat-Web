import type { ImageMetadata } from 'astro';
import totemPortada from '@/assets/img/totem-solar-portada.jpg';
import totem2 from '@/assets/img/totem-solar-2.jpg';
import totem3 from '@/assets/img/totem-solar-3.jpg';
import totem4 from '@/assets/img/totem-solar-4.jpg';
import totem5 from '@/assets/img/totem-solar-5.jpg';
import totem6 from '@/assets/img/totem-solar-6.jpg';
import torre1 from '@/assets/img/torre-solar-1.jpg';
import torre2 from '@/assets/img/torre-solar-2.jpg';
import torre3 from '@/assets/img/torre-solar-3.jpg';
import torre4 from '@/assets/img/torre-solar-4.jpg';
import torre5 from '@/assets/img/torre-solar-5.jpg';
import torre6 from '@/assets/img/torre-solar-6.jpg';
import torre7 from '@/assets/img/torre-solar-7.jpg';
import torre8 from '@/assets/img/torre-solar-8.jpg';
import buggy1 from '@/assets/img/buggy-1.jpg';
import buggy2 from '@/assets/img/buggy-2.jpg';
import cinta1 from '@/assets/img/cinta-1.jpg';
import cinta2 from '@/assets/img/cinta-2.jpg';
import cinta3 from '@/assets/img/cinta-3.jpg';
import robot1 from '@/assets/img/robot-limpieza.jpg';

export interface TrabajoLocal {
  titulo: string;
  /** Categoría: el slug de un servicio de data/servicios.ts o 'fabricacion'. */
  categoria: string;
  resumen: string;
  descripcion?: string;
  destacado?: boolean;
  /** Video (ruta dentro de public/), se muestra después de las fotos. */
  video?: string;
  /** La primera foto es la portada. */
  fotos: { image: ImageMetadata; alt: string }[];
}

/**
 * RESPALDO de los trabajos realizados. La fuente real es el panel web (/web-admin/):
 * esta lista solo se muestra si la API no responde, así que conviene mantenerla
 * parecida a lo publicado en el panel.
 */
export const TRABAJOS: TrabajoLocal[] = [
  {
    titulo: 'Tótem solar',
    categoria: 'fabricacion',
    resumen: 'Tótems con panel solar para espacios públicos: carga de celulares e información de emergencia.',
    descripcion:
      'Desarrollamos y fabricamos tótems con panel solar para espacios públicos. Cada tótem indica el punto de encuentro ante una emergencia y permite cargar el celular. Los fabricamos en serie en nuestro taller y hoy están instalados en plazas y calles.',
    destacado: true,
    fotos: [
      { image: totemPortada, alt: 'Tótem solar instalado en la vía pública, con panel fotovoltaico y mapa del punto de encuentro' },
      { image: totem2, alt: 'Tótem solar instalado en una plaza, visto de costado' },
      { image: totem3, alt: 'Tótem solar sobre su base de hormigón, con el panel informativo de emergencia' },
      { image: totem4, alt: 'Tótem solar con punto de carga para celulares, junto a dos asientos de hormigón' },
      { image: totem5, alt: 'Tótems solares en fabricación en el taller de Ararat' },
      { image: totem6, alt: 'Estructuras de los tótems recién pintadas en el taller' },
    ],
  },
  {
    titulo: 'Torre solar de iluminación',
    categoria: 'fabricacion',
    resumen: 'Torres de iluminación móviles con paneles solares y batería, fabricadas para faena minera.',
    descripcion:
      'Diseñamos y fabricamos torres de iluminación autónomas para una faena minera. Cada torre va montada en un carro de arrastre y lleva paneles solares plegables, banco de baterías y un mástil abatible con focos. Hicimos el diseño en 3D, la estructura, la pintura y el armado en nuestro taller, y las entregamos en serie.',
    destacado: true,
    fotos: [
      { image: torre1, alt: 'Torre solar de iluminación con sus cuatro paneles solares desplegados' },
      { image: torre2, alt: 'Torres solares con el mástil de iluminación levantado' },
      { image: torre3, alt: 'Vista frontal de la torre solar con los paneles plegados y el banco de baterías' },
      { image: torre4, alt: 'Torres solares terminadas, plegadas para el traslado' },
      { image: torre5, alt: 'Estructura de la torre solar en fabricación en el taller' },
      { image: torre6, alt: 'Chasis del carro de arrastre de la torre solar en fabricación' },
      { image: torre7, alt: 'Diseño 3D de la torre solar con el mástil levantado' },
      { image: torre8, alt: 'Diseño 3D de la torre solar con el mástil abatido para el traslado' },
    ],
  },
  {
    titulo: 'Buggy de competición',
    categoria: 'fabricacion',
    resumen: 'Jaulas y estructuras para buggy y UTV de competición, trabajadas en nuestro taller.',
    fotos: [
      { image: buggy1, alt: 'UTV de competición con su jaula de seguridad, en el taller de Ararat' },
      { image: buggy2, alt: 'UTV de competición desarmado en el taller, con su jaula tubular a la vista' },
    ],
  },
  {
    titulo: 'Cintas transportadoras de banda modular',
    categoria: 'fabricacion',
    resumen: 'Dos cintas transportadoras de banda modular fabricadas e instaladas para el proyecto de una empresa china.',
    descripcion:
      'Fabricamos e instalamos dos cintas transportadoras de banda modular, con motorreductor y patas niveladoras, para la línea de una máquina industrial en el proyecto de una empresa china. La estructura, la pintura y el armado se hicieron en nuestro taller.',
    fotos: [
      { image: cinta1, alt: 'Cintas transportadoras de banda modular de Ararat instaladas junto a la máquina del cliente' },
      { image: cinta2, alt: 'Cinta transportadora de banda modular en armado en el taller de Ararat' },
      { image: cinta3, alt: 'Estructura de la cinta transportadora con su banda modular azul, en el taller' },
    ],
  },
  {
    titulo: 'Robot de limpieza Puma 2',
    categoria: 'fabricacion',
    resumen: 'Robot de limpieza a control remoto, sobre orugas y con pala frontal, fabricado a pedido.',
    fotos: [
      { image: robot1, alt: 'Robot de limpieza Puma 2 sobre orugas, con pala frontal y control remoto' },
    ],
  },
];
