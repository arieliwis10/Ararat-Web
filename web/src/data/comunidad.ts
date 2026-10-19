import type { ImageMetadata } from 'astro';
import mtb1 from '@/assets/img/comunidad-mtb-1.jpg';
import mtb2 from '@/assets/img/comunidad-mtb-2.jpg';
import mtb3 from '@/assets/img/comunidad-mtb-3.jpg';
import mtb4 from '@/assets/img/comunidad-mtb-4.jpg';
import mtb5 from '@/assets/img/comunidad-mtb-5.jpg';
import mtb6 from '@/assets/img/comunidad-mtb-6.jpg';
import mtb7 from '@/assets/img/comunidad-mtb-7.jpg';
import seguridad1 from '@/assets/img/comunidad-seguridad-1.jpg';
import seguridad2 from '@/assets/img/comunidad-seguridad-2.jpg';
import seguridad3 from '@/assets/img/comunidad-seguridad-3.jpg';
import seguridad4 from '@/assets/img/comunidad-seguridad-4.jpg';
import robotica1 from '@/assets/img/comunidad-robotica-1.jpg';
import robotica2 from '@/assets/img/comunidad-robotica-2.jpg';

export interface ActividadLocal {
  titulo: string;
  /** Uno de los ejes de EJES_COMUNIDAD (lib/contenido.ts): 'deporte', 'seguridad', 'educacion', 'ambiente' o 'laboral' */
  eje: string;
  resumen: string;
  descripcion?: string;
  /** AAAA-MM-DD */
  fecha?: string;
  /** La primera foto es la portada. */
  fotos: { image: ImageMetadata; alt: string }[];
}

/**
 * RESPALDO de la página Responsabilidad social. La fuente real es el panel web (/web-admin/): esto solo
 * se muestra si la API no responde, así que debe tener solo lo publicado en el panel.
 * Las fotos de seguridad y de la Liga de Robótica se publican con autorización (empresa, 2026-10-14).
 */
export const ACTIVIDADES: ActividadLocal[] = [
  {
    titulo: 'Ciclismo de montaña',
    eje: 'deporte',
    resumen: 'Apoyamos a un ciclista de mountain bike que compite con los colores de Ararat.',
    fotos: [
      { image: mtb1, alt: 'Ciclista de mountain bike con la camiseta de Ararat en plena competencia' },
      { image: mtb2, alt: 'Ciclista patrocinado por Ararat bajando un sendero en carrera' },
      { image: mtb3, alt: 'Ciclista con la camiseta de Ararat en una carrera de MTB' },
      { image: mtb4, alt: 'Ciclista patrocinado por Ararat junto a su bicicleta en el podio' },
      { image: mtb5, alt: 'Ciclista con la camiseta de Ararat junto a su bicicleta en un evento de ciclismo' },
      { image: mtb6, alt: 'Dos ciclistas con la camiseta de Ararat junto a sus bicicletas en el MTB Tour' },
      { image: mtb7, alt: 'Partida de una cicletada de la Oficina de Deportes de Paine, con un vehículo de rally abriendo la ruta' },
    ],
  },
  {
    titulo: 'Compromiso con la seguridad',
    eje: 'seguridad',
    resumen: 'Colaboramos en actividades que promueven la seguridad de nuestra comunidad.',
    fotos: [
      { image: seguridad1, alt: 'Autoridades y representantes de la comunidad en una actividad de seguridad' },
      { image: seguridad2, alt: 'Autoridades y vecinos en una ceremonia de seguridad comunitaria' },
      { image: seguridad3, alt: 'Ceremonia de seguridad comunitaria en los jardines de la unidad' },
      { image: seguridad4, alt: 'Izamiento de banderas en una ceremonia de seguridad comunitaria' },
    ],
  },
  {
    titulo: 'Liga de Robótica',
    eje: 'educacion',
    resumen: 'Patrocinamos la Liga de Robótica y fomentamos la tecnología entre niños y jóvenes.',
    fotos: [
      { image: robotica1, alt: 'Premiación de la Liga de Robótica patrocinada por Ararat' },
      { image: robotica2, alt: 'Equipo de la Liga de Robótica con camisetas de Ararat en la Universidad Santo Tomás' },
    ],
  },
];
