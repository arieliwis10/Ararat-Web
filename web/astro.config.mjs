// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio público. Se usa para URLs canónicas, Open Graph y el sitemap.
const SITE = 'https://araratchile.com';

export default defineConfig({
  site: SITE,
  output: 'static', // HTML plano: Apache lo sirve sin Node en producción
  trailingSlash: 'always', // Apache sirve carpeta/index.html → URLs con "/" final
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  // La página Comunidad pasó a llamarse Responsabilidad social: la dirección antigua redirige.
  redirects: {
    '/comunidad/': '/responsabilidad-social/',
  },
  // Las imágenes de src/assets se optimizan en build con sharp (AVIF/WebP + srcset).
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/comunidad/'),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
