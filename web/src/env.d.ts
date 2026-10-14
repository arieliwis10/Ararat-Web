/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Base de la API pública, sin "/" final. Ej.: https://api.araratchile.com/public */
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
