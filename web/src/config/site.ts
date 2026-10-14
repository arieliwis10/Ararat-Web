/**
 * Datos del negocio en UN solo lugar.
 * Todo lo marcado con TODO es un supuesto: reemplázalo por el dato real.
 */
export const SITE = {
  url: 'https://araratchile.com',
  name: 'Ararat Maestranza',
  legalName: 'Ararat SpA', // TODO: razón social exacta
  tagline: 'Maestranza, mecanizado y arriendo de equipos para la industria',
  description:
    'Maestranza en la Región Metropolitana: soldadura, torno y mecanizado, flexibles hidráulicos, repuestos industriales y ferretería. Arriendo de equipos con Kairos e indumentaria racing Pyrotect. Atención 24/7 para minería, construcción y particulares.',
  locale: 'es_CL',

  contact: {
    // Formato internacional sin "+" ni espacios (requisito de wa.me).
    whatsapp: '56999405462',
    phoneDisplay: '+56 9 9940 5462',
    email: 'ventas@araratchile.com',
  },

  address: {
    street: 'La Rinconada 4, Lote B, Huelquén',
    city: 'Paine',
    region: 'Región Metropolitana',
    country: 'CL',
    postalCode: '',
    // Ficha "Ararat soldaduras" en Google Maps: enlace para abrirla y mapa para incrustar (por su id, sin API key).
    mapsUrl:
      'https://www.google.com/maps/place/Ararat+soldaduras/@-33.8276573,-70.6399078,17z/data=!3m1!4b1!4m6!3m5!1s0x9663251854176d4f:0x7043b6639c9208f4!8m2!3d-33.8276618!4d-70.6373329!16s%2Fg%2F11hdqw477v',
    mapsEmbedUrl: 'https://www.google.com/maps?cid=8089509894632376564&z=15&hl=es&output=embed',
    lat: -33.8276618,
    lng: -70.6373329,
  },

  // Lunes a viernes; la emergencia 24/7 se comunica aparte.
  hours: { opens: '08:30', closes: '18:00', label: 'Lun a Vie 08:30 – 18:00 · Emergencias 24/7' },

  areaServed: ['Región Metropolitana', "Región de O'Higgins", 'Región de Valparaíso'],

  social: {
    youtube: '', // TODO: URL del canal
    instagram: '', // TODO
    facebook: '', // TODO
  },

  // ID del video largo de YouTube que se muestra en portada y trabajos (lo que va después de "v=").
  youtubeFeatured: '', // TODO: p. ej. 'dQw4w9WgXcQ'

  kairos: {
    name: 'Kairos Arriendos',
    tagline: 'Arriendo de equipos y maquinaria por día para obra, taller e industria',
  },

  pyrotect: {
    name: 'Pyrotect Sudamérica',
    tagline: 'Indumentaria y equipamiento de seguridad para competición',
  },
} as const;
