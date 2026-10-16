import type { ImageMetadata } from 'astro';
import autocargable from '@/assets/img/equipo-autocargable.jpg';
import gruaHorquilla from '@/assets/img/equipo-grua-horquilla.jpg';
import autocargable1 from '@/assets/img/autocargable-galeria-1.jpg';
import autocargable2 from '@/assets/img/autocargable-galeria-2.jpg';
import autocargable3 from '@/assets/img/autocargable-galeria-3.jpg';
import autocargable4 from '@/assets/img/autocargable-galeria-4.jpg';
import autocargable5 from '@/assets/img/autocargable-galeria-5.jpg';
import autocargable6 from '@/assets/img/autocargable-galeria-6.jpg';
import autocargable7 from '@/assets/img/autocargable-galeria-7.jpg';

export interface EquipoLocal {
  nombre: string;
  categoria: string;
  detalle: string;
  /** Precios netos (sin IVA) en CLP. null = no se muestra; sin ninguno, "Consultar". */
  precioDia: number | null;
  precioSemana: number | null;
  precioMes: number | null;
  unidades: number;
  /** La primera foto es la portada; el resto forma la galería. */
  fotos: { image: ImageMetadata; alt: string }[];
}

/**
 * RESPALDO del catálogo de Kairos. La fuente real es el panel web (/web-admin/):
 * esta lista solo se muestra si la API no responde. El menú de Kairos en la
 * cabecera toma las categorías de aquí.
 */
export const EQUIPOS: EquipoLocal[] = [
  {
    nombre: 'Autocargable para bins',
    categoria: 'Maquinaria',
    detalle: 'Ref. A4B 20-1',
    precioDia: 45000,
    precioSemana: 180000,
    precioMes: 600000,
    unidades: 20,
    fotos: [
      { image: autocargable, alt: 'Autocargable para bins A4B 20-1 de Kairos Arriendos' },
      { image: autocargable1, alt: 'Autocargable para bins visto desde atrás, con sus dos rieles de carga' },
      { image: autocargable2, alt: 'Autocargable para bins enganchado a un tractor, vista en diagonal' },
      { image: autocargable3, alt: 'Autocargable para bins visto desde el enganche, con sus mangueras hidráulicas' },
      { image: autocargable4, alt: 'Vista lateral del autocargable: sistema hidráulico y ruedas en tándem' },
      { image: autocargable5, alt: 'Detalle del motor hidráulico del autocargable, con la placa Ararat' },
      { image: autocargable6, alt: 'Detalle del motor hidráulico y la cadena de arrastre' },
      { image: autocargable7, alt: 'Rieles con cadena y ruedas traseras del autocargable' },
    ],
  },
  {
    nombre: 'Grúa horquilla 2,5 T',
    categoria: 'Maquinaria',
    detalle: '2,5 toneladas de carga · Ref. G2.5T 15-80',
    precioDia: 60000,
    precioSemana: 220000,
    precioMes: 800000,
    unidades: 20,
    fotos: [{ image: gruaHorquilla, alt: 'Grúa horquilla TCM de 2,5 toneladas de Kairos Arriendos' }],
  },
];
