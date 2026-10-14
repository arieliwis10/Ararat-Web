import type { ImageMetadata } from 'astro';
import soldadura from '@/assets/img/servicio-soldadura.jpg';
import torno from '@/assets/img/servicio-torno.jpg';
import ferreteria from '@/assets/img/servicio-ferreteria.jpg';
import repuestos from '@/assets/img/servicio-repuestos.jpg';
import flexibles from '@/assets/img/servicio-flexibles.jpg';
import fabricacion from '@/assets/img/servicio-fabricacion.jpg';

export interface Servicio {
  slug: string;
  title: string;
  /** <title> y H1 orientados a búsqueda local */
  seoTitle: string;
  description: string;
  short: string;
  image: ImageMetadata;
  imageAlt: string;
  intro: string;
  items: string[];
  industries: string[];
  /** Respaldo: las preguntas reales se administran en el panel web (Preguntas frecuentes). */
  faq: { q: string; a: string }[];
}

/**
 * Textos de partida (Fase 1). Revísalos con el equipo: describen el rubro de forma
 * general y no prometen plazos ni certificaciones que no estén confirmadas.
 */
export const SERVICIOS: Servicio[] = [
  {
    slug: 'soldadura',
    title: 'Soldadura y estructuras metálicas',
    seoTitle: 'Soldadura industrial y estructuras metálicas',
    description:
      'Soldadura MIG, TIG y al arco en taller y en terreno. Fabricación y reparación de estructuras metálicas para minería, construcción y particulares.',
    short: 'Fabricación y reparación en taller o en terreno, en acero, inoxidable y aluminio.',
    image: soldadura,
    imageAlt: 'Soldador trabajando en el taller: soldadura MIG, TIG y arco',
    intro:
      'Fabricamos y reparamos estructuras, piezas y equipos metálicos. Trabajamos en nuestro taller o vamos a tu faena con taller móvil cuando el equipo no se puede mover.',
    items: [
      'Soldadura MIG, TIG y electrodo revestido',
      'Acero al carbono, acero inoxidable y aluminio',
      'Estructuras metálicas, rejas, portones y soportes',
      'Reparación de tolvas, baldes, chasis y carros',
      'Plegado y corte de planchas',
      'Trabajos en terreno con taller móvil',
    ],
    industries: ['Minería', 'Construcción', 'Agroindustria', 'Transporte', 'Particulares'],
    faq: [
      {
        q: '¿Hacen trabajos en terreno?',
        a: 'Sí. Contamos con taller móvil para reparaciones en faena cuando el equipo no se puede trasladar.',
      },
      {
        q: '¿Qué necesito para cotizar?',
        a: 'Una descripción del trabajo, medidas aproximadas y, si puedes, fotos o planos. Por WhatsApp es lo más rápido.',
      },
    ],
  },
  {
    slug: 'torno-y-mecanizado',
    title: 'Torno y mecanizado',
    seoTitle: 'Torno y mecanizado de piezas industriales',
    description:
      'Servicio de torno y mecanizado: fabricación de piezas a medida, ejes, bujes, poleas y recuperación de componentes desgastados.',
    short: 'Piezas a medida, ejes, bujes y recuperación de componentes desgastados.',
    image: torno,
    imageAlt: 'Operario de Ararat mecanizando una pieza en el torno, junto a una fresadora',
    intro:
      'Fabricamos piezas nuevas a partir de una muestra o un plano y recuperamos componentes que hoy te tienen la máquina detenida.',
    items: [
      'Fabricación de ejes, bujes, pasadores y poleas',
      'Piezas a medida desde muestra o plano',
      'Roscado, refrentado y cilindrado',
      'Recuperación de componentes desgastados',
      'Fresado y trabajos de precisión',
    ],
    industries: ['Minería', 'Industria', 'Agroindustria', 'Talleres'],
    faq: [
      {
        q: '¿Pueden fabricar una pieza sin plano?',
        a: 'Sí, a partir de la pieza original o de una muestra. Tráela al taller o envíanos fotos con medidas para una primera estimación.',
      },
    ],
  },
  {
    slug: 'insumos-de-ferreteria',
    title: 'Insumos de ferretería',
    seoTitle: 'Insumos de ferretería industrial',
    description:
      'Insumos de ferretería industrial: pernería, consumibles de soldadura, discos, abrasivos, herramientas y elementos de protección.',
    short: 'Pernería, consumibles de soldadura, abrasivos y herramientas.',
    image: ferreteria,
    imageAlt: 'Herramientas eléctricas y manuales de ferretería industrial',
    intro:
      'Abastecemos a empresas y particulares con los insumos que se usan todos los días en taller y en obra.',
    items: [
      'Pernería y fijaciones',
      'Consumibles de soldadura (alambre, electrodos, gases)',
      'Discos de corte y desbaste, abrasivos',
      'Herramientas manuales y eléctricas',
      'Elementos de protección personal',
    ],
    industries: ['Construcción', 'Industria', 'Talleres', 'Particulares'],
    faq: [
      {
        q: '¿Venden a empresas con factura?',
        a: 'Sí. Envíanos tu lista de productos y te respondemos con una cotización.',
      },
    ],
  },
  {
    slug: 'repuestos-industriales',
    title: 'Repuestos industriales',
    seoTitle: 'Repuestos industriales para maquinaria',
    description:
      'Repuestos industriales para maquinaria y equipos: rodamientos, retenes, transmisión, componentes hidráulicos y fabricación de repuestos a medida.',
    short: 'Rodamientos, transmisión, retenes y fabricación de repuestos a medida.',
    image: repuestos,
    imageAlt: 'Rodamientos, soportes, cadenas, piñones y retenes industriales',
    intro:
      'Te ayudamos a conseguir el repuesto correcto y, cuando no existe en el mercado, lo fabricamos en nuestra maestranza.',
    items: [
      'Rodamientos y retenes',
      'Elementos de transmisión: cadenas, piñones, correas',
      'Componentes hidráulicos y neumáticos',
      'Fabricación de repuestos descontinuados',
      'Asesoría para identificar el repuesto correcto',
    ],
    industries: ['Minería', 'Agroindustria', 'Industria', 'Transporte'],
    faq: [
      {
        q: '¿Qué pasa si el repuesto ya no se fabrica?',
        a: 'Lo podemos fabricar a partir de la pieza original en nuestro taller de mecanizado.',
      },
    ],
  },
  {
    slug: 'flexibles-hidraulicos',
    title: 'Flexibles hidráulicos',
    seoTitle: 'Flexibles hidráulicos y mangueras de alta presión',
    description:
      'Fabricación y reparación de flexibles hidráulicos y mangueras de alta presión, con terminales y acoples, para maquinaria pesada e industrial.',
    short: 'Armado de mangueras de alta presión con terminales y acoples.',
    image: flexibles,
    imageAlt: 'Mangueras hidráulicas con terminales y operario prensando un flexible',
    intro:
      'Armamos flexibles hidráulicos a medida para que tu maquinaria vuelva a operar lo antes posible.',
    items: [
      'Armado y prensado de mangueras hidráulicas',
      'Terminales, acoples y adaptadores',
      'Reemplazo a partir de la manguera original',
      'Mangueras para maquinaria pesada, agrícola e industrial',
    ],
    industries: ['Minería', 'Construcción', 'Agroindustria', 'Transporte'],
    faq: [
      {
        q: '¿Puedo llevar la manguera dañada?',
        a: 'Sí, es la forma más rápida: la usamos como muestra para largo, terminales y presión de trabajo.',
      },
    ],
  },
];

export interface LineaFabricacion {
  title: string;
  items: string[];
}

/**
 * Líneas de fabricación y proyectos (tomadas de la web anterior). Todavía no tienen
 * página propia: se muestran como listado y se cotizan como "otro".
 */
export const FABRICACION: LineaFabricacion[] = [
  {
    title: 'Estructuras metálicas',
    items: ['Estructuras a medida', 'Estanques y piping en acero inoxidable y al carbono'],
  },
  {
    title: 'Equipos industriales',
    items: ['Cintas transportadoras', 'Elevadores industriales', 'Transportadores frutícolas'],
  },
  {
    title: 'Equipos mineros',
    items: ['Baños industriales portátiles', 'Robot minero', 'Robot minicargador', 'Transformación de equipos especiales'],
  },
  {
    title: 'Buggy de competición',
    items: ['Estructuras y jaulas para buggy de competición'],
  },
  {
    title: 'Área eléctrica',
    items: ['Ingeniería y proyectos eléctricos', 'Tableros y gabinetes de control y fuerza', 'Montajes eléctricos'],
  },
  {
    title: 'Automatización industrial',
    items: ['Programación PLC / HMI', 'Monitoreo y control de procesos', 'Sistemas neumáticos e hidráulicos'],
  },
  {
    title: 'Mantención y repuestos',
    items: ['Mantención de equipos de proceso', 'Encajadoras', 'Flotadores por aire disuelto (DAF)'],
  },
];

/** Tarjeta que acompaña a los servicios y lleva al listado de fabricación. */
export const FABRICACION_CARD = {
  slug: 'fabricacion',
  title: 'Fabricación de equipos y proyectos',
  short: 'Equipos especiales, estructuras y proyectos a pedido para minería e industria.',
  image: fabricacion,
  imageAlt: 'Tolva con cinta transportadora y minicargador a control remoto fabricados por Ararat',
};

export const servicioBySlug = (slug: string) => SERVICIOS.find((s) => s.slug === slug);

/** Nombre de la categoría de un trabajo: uno de los servicios o 'fabricacion'. */
export const categoriaTitle = (slug: string) =>
  slug === FABRICACION_CARD.slug ? FABRICACION_CARD.title : servicioBySlug(slug)?.title;
