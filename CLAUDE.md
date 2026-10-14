# Proyecto Ararat / Kairos — contexto para Claude

Responde siempre en español. Desarrollo en Windows con PowerShell y venv.

## Qué es
Web pública de **Ararat Maestranza** (soldadura, torno y mecanizado, insumos de ferretería,
repuestos industriales, flexibles hidráulicos) y **Kairos Arriendos** (arriendo de equipos por día).
Público: industria (minería, construcción) y particulares. Objetivo: cotizaciones y contacto por WhatsApp.

## Estructura del repo
- `backend/` → Django 6 + DRF + MySQL (SQLite en local). Compartido por la web y la app. JWT (simplejwt) para la app.
  - `backend/cotizaciones/` → app del formulario público: `POST /public/cotizaciones/`
    (anónimo, `authentication_classes = []`, honeypot `website`, `elapsed_ms`, throttling por IP en `throttles.py`).
  - `backend/contenido/` → panel propio de la web en `/web-admin/` (AdminSite aparte, en español) para trabajos
    realizados, equipos de Kairos, catálogo de Pyrotect y actividades de responsabilidad social (página `/responsabilidad-social/`, con fotos y portada) y preguntas frecuentes por página. Tablas propias; API pública `GET /public/web/contenido/`
    y fotos por `/public/web/media/...`.
- `backend-local/` → proyecto Django mínimo SOLO para probar en local (`iniciar-local.cmd`). No se publica.
- `frontend/` → app interna React + Vite (PWA) en `app.araratchile.com`. **NO TOCAR.**
- `web/` → web pública Astro (estática) + Tailwind v4 en `araratchile.com`.
  - Datos del negocio: `web/src/config/site.ts` (hay TODOs: WhatsApp, dirección, redes).
  - Contenido: `web/src/data/{servicios,kairos,trabajos}.ts`. Fotos: `web/src/assets/img/`.
  - Trabajos, equipos, catálogo de Pyrotect y preguntas frecuentes vienen del panel web en el navegador: `web/src/lib/contenido.ts` genera el mismo HTML en el build
    (con el respaldo de `data/trabajos.ts`, `data/kairos.ts`, `data/pyrotect.ts` y las `faq` de `data/servicios.ts`) y en el cliente (`scripts/contenido-cliente.ts`).
    Es JS propio, sin React: se evitó sumar un framework para dos listados.
  - URL de la API: `PUBLIC_API_URL` en `web/.env` / `web/.env.production`.

## Hosting y deploy (restricciones reales)
- Esta carpeta es un paquete sin git. El repo real (backend Django completo, `frontend/`, `.cpanel.yml`) es
  `Desktop\AraratSpa`; ahí se integran `web/` y las apps de `backend/` siguiendo `LEEME.md`.
- cPanel compartido (cuenta `araratch`), Python 3.12 vía Passenger. **No hay Node en producción.**
- Deploy con cPanel Git Version Control + `.cpanel.yml` desde la rama `main`.
- `backend/*` → `/home/araratch/api.araratchile.com/` (pip install, migrate, collectstatic, `tmp/restart.txt`).
- `frontend/dist/*` → `/home/araratch/app.araratchile.com/`.
- `web/dist/*` → `/home/araratch/public_html/`. `web/dist` se compila en local (`npm run build`) y se versiona.
- Nunca pisar `public_html/.htaccess` ni `public_html/api` (ahí vive la Python App). No crear `web/src/pages/api/`.
- Imunify360 puede bloquear con desafíos anti-bot: el formulario usa FormData (sin preflight) y ofrece WhatsApp si la API falla.

## Reglas
- CORS: solo **agregar** orígenes; nunca quitar `https://app.araratchile.com`.
- Las migraciones se versionan (el servidor solo corre `migrate`).
- Nada de secretos en el frontend; solo variables `PUBLIC_*`.
- Solución más simple que escale; no inflar el alcance de la fase actual.
- Avisar si un cambio puede romper la app interna o la API en producción.

## Fases
1. **Base (actual):** Astro, páginas, formulario de cotización, WhatsApp, SEO, deploy.
2. Dinámica: catálogo y precios desde la API (isla React `client:visible` con fallback), disponibilidad, galería administrable desde el admin.
3. Crecimiento: acceso de clientes, blog, reservas/pagos, analítica, posible VPS.
